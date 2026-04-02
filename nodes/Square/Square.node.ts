/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  IDataObject,
} from 'n8n-workflow';

import {
  squareApiRequest,
  squareApiRequestAllItems,
  toMoney,
  generateIdempotencyKey,
  toRfc3339,
  removeEmptyFields,
  parseStringList,
  emitLicenseNotice,
} from './utils/helpers';

import { paymentOperations, paymentFields } from './descriptions/PaymentDescription';
import { refundOperations, refundFields } from './descriptions/RefundDescription';
import { orderOperations, orderFields } from './descriptions/OrderDescription';
import { customerOperations, customerFields } from './descriptions/CustomerDescription';
import { catalogOperations, catalogFields } from './descriptions/CatalogDescription';
import { inventoryOperations, inventoryFields } from './descriptions/InventoryDescription';
import { invoiceOperations, invoiceFields } from './descriptions/InvoiceDescription';
import { subscriptionOperations, subscriptionFields } from './descriptions/SubscriptionDescription';
import { locationOperations, locationFields } from './descriptions/LocationDescription';
import { loyaltyOperations, loyaltyFields } from './descriptions/LoyaltyDescription';
import { giftCardOperations, giftCardFields } from './descriptions/GiftCardDescription';
import { teamOperations, teamFields } from './descriptions/TeamDescription';
import { bookingOperations, bookingFields } from './descriptions/BookingDescription';

export class Square implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Square',
    name: 'square',
    icon: 'file:square.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Complete Square SMB payments and POS integration - payments, orders, customers, catalog, inventory, invoices, subscriptions, loyalty, gift cards, team, and bookings',
    defaults: {
      name: 'Square',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'squareApi',
        required: true,
        displayOptions: {
          show: {
            authentication: ['accessToken'],
          },
        },
      },
      {
        name: 'squareOAuth2Api',
        required: true,
        displayOptions: {
          show: {
            authentication: ['oAuth2'],
          },
        },
      },
    ],
    properties: [
      {
        displayName: 'Authentication',
        name: 'authentication',
        type: 'options',
        options: [
          {
            name: 'Access Token',
            value: 'accessToken',
          },
          {
            name: 'OAuth2',
            value: 'oAuth2',
          },
        ],
        default: 'accessToken',
      },
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          { name: 'Booking', value: 'booking' },
          { name: 'Catalog', value: 'catalog' },
          { name: 'Customer', value: 'customer' },
          { name: 'Gift Card', value: 'giftCard' },
          { name: 'Inventory', value: 'inventory' },
          { name: 'Invoice', value: 'invoice' },
          { name: 'Location', value: 'location' },
          { name: 'Loyalty', value: 'loyalty' },
          { name: 'Order', value: 'order' },
          { name: 'Payment', value: 'payment' },
          { name: 'Refund', value: 'refund' },
          { name: 'Subscription', value: 'subscription' },
          { name: 'Team', value: 'team' },
        ],
        default: 'payment',
      },
      ...paymentOperations,
      ...paymentFields,
      ...refundOperations,
      ...refundFields,
      ...orderOperations,
      ...orderFields,
      ...customerOperations,
      ...customerFields,
      ...catalogOperations,
      ...catalogFields,
      ...inventoryOperations,
      ...inventoryFields,
      ...invoiceOperations,
      ...invoiceFields,
      ...subscriptionOperations,
      ...subscriptionFields,
      ...locationOperations,
      ...locationFields,
      ...loyaltyOperations,
      ...loyaltyFields,
      ...giftCardOperations,
      ...giftCardFields,
      ...teamOperations,
      ...teamFields,
      ...bookingOperations,
      ...bookingFields,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    emitLicenseNotice(this);

    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let responseData: IDataObject | IDataObject[] = {};

        // ============ PAYMENT ============
        if (resource === 'payment') {
          if (operation === 'create') {
            const sourceId = this.getNodeParameter('sourceId', i) as string;
            const amount = this.getNodeParameter('amount', i) as number;
            const currency = this.getNodeParameter('currency', i) as string;
            const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

            const body: IDataObject = {
              idempotency_key: generateIdempotencyKey(),
              source_id: sourceId,
              amount_money: toMoney(amount, currency),
            };

            if (additionalFields.autocomplete !== undefined) {
              body.autocomplete = additionalFields.autocomplete;
            }
            if (additionalFields.customerId) {
              body.customer_id = additionalFields.customerId;
            }
            if (additionalFields.locationId) {
              body.location_id = additionalFields.locationId;
            }
            if (additionalFields.orderId) {
              body.order_id = additionalFields.orderId;
            }
            if (additionalFields.referenceId) {
              body.reference_id = additionalFields.referenceId;
            }
            if (additionalFields.note) {
              body.note = additionalFields.note;
            }
            if (additionalFields.buyerEmailAddress) {
              body.buyer_email_address = additionalFields.buyerEmailAddress;
            }
            if (additionalFields.tipAmount) {
              body.tip_money = toMoney(additionalFields.tipAmount as number, currency);
            }
            if (additionalFields.verificationToken) {
              body.verification_token = additionalFields.verificationToken;
            }
            if (additionalFields.billingAddressLine1 || additionalFields.billingCity || additionalFields.billingPostalCode || additionalFields.billingCountry) {
              body.billing_address = removeEmptyFields({
                address_line_1: additionalFields.billingAddressLine1,
                locality: additionalFields.billingCity,
                postal_code: additionalFields.billingPostalCode,
                country: additionalFields.billingCountry,
              });
            }

            responseData = await squareApiRequest.call(this, 'POST', '/v2/payments', body) as any;
          }

          if (operation === 'get') {
            const paymentId = this.getNodeParameter('paymentId', i) as string;
            responseData = await squareApiRequest.call(this, 'GET', `/v2/payments/${paymentId}`) as any;
          }

          if (operation === 'getMany') {
            const returnAll = this.getNodeParameter('returnAll', i) as boolean;
            const filters = this.getNodeParameter('filters', i) as IDataObject;
            const qs: IDataObject = {};

            if (filters.beginTime) {
              qs.begin_time = toRfc3339(filters.beginTime as string);
            }
            if (filters.endTime) {
              qs.end_time = toRfc3339(filters.endTime as string);
            }
            if (filters.sortOrder) {
              qs.sort_order = filters.sortOrder;
            }
            if (filters.locationId) {
              qs.location_id = filters.locationId;
            }
            if (filters.cardBrand) {
              qs.card_brand = filters.cardBrand;
            }
            if (filters.last4) {
              qs.last_4 = filters.last4;
            }

            if (returnAll) {
              responseData = await squareApiRequestAllItems.call(this, 'GET', '/v2/payments', 'payments', {}, qs) as any;
            } else {
              const limit = this.getNodeParameter('limit', i) as number;
              qs.limit = limit;
              const response = await squareApiRequest.call(this, 'GET', '/v2/payments', {}, qs) as any;
              responseData = response.payments || [];
            }
          }

          if (operation === 'update') {
            const paymentId = this.getNodeParameter('paymentId', i) as string;
            const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

            const body: IDataObject = {
              idempotency_key: generateIdempotencyKey(),
            };

            if (updateFields.tipAmount !== undefined) {
              body.tip_money = toMoney(updateFields.tipAmount as number, 'USD');
            }
            if (updateFields.versionToken) {
              body.version_token = updateFields.versionToken;
            }

            responseData = await squareApiRequest.call(this, 'PUT', `/v2/payments/${paymentId}`, body) as any;
          }

          if (operation === 'cancel') {
            const paymentId = this.getNodeParameter('paymentId', i) as string;
            responseData = await squareApiRequest.call(this, 'POST', `/v2/payments/${paymentId}/cancel`) as any;
          }

          if (operation === 'complete') {
            const paymentId = this.getNodeParameter('paymentId', i) as string;
            responseData = await squareApiRequest.call(this, 'POST', `/v2/payments/${paymentId}/complete`) as any;
          }
        }

        // ============ REFUND ============
        if (resource === 'refund') {
          if (operation === 'create') {
            const paymentId = this.getNodeParameter('paymentId', i) as string;
            const amount = this.getNodeParameter('amount', i) as number;
            const currency = this.getNodeParameter('currency', i) as string;
            const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

            const body: IDataObject = {
              idempotency_key: generateIdempotencyKey(),
              payment_id: paymentId,
              amount_money: toMoney(amount, currency),
            };

            if (additionalFields.reason) {
              body.reason = additionalFields.reason;
            }
            if (additionalFields.locationId) {
              body.location_id = additionalFields.locationId;
            }

            responseData = await squareApiRequest.call(this, 'POST', '/v2/refunds', body) as any;
          }

          if (operation === 'get') {
            const refundId = this.getNodeParameter('refundId', i) as string;
            responseData = await squareApiRequest.call(this, 'GET', `/v2/refunds/${refundId}`) as any;
          }

          if (operation === 'getMany') {
            const returnAll = this.getNodeParameter('returnAll', i) as boolean;
            const filters = this.getNodeParameter('filters', i) as IDataObject;
            const qs: IDataObject = {};

            if (filters.beginTime) {
              qs.begin_time = toRfc3339(filters.beginTime as string);
            }
            if (filters.endTime) {
              qs.end_time = toRfc3339(filters.endTime as string);
            }
            if (filters.sortOrder) {
              qs.sort_order = filters.sortOrder;
            }
            if (filters.locationId) {
              qs.location_id = filters.locationId;
            }

            if (returnAll) {
              responseData = await squareApiRequestAllItems.call(this, 'GET', '/v2/refunds', 'refunds', {}, qs) as any;
            } else {
              const limit = this.getNodeParameter('limit', i) as number;
              qs.limit = limit;
              const response = await squareApiRequest.call(this, 'GET', '/v2/refunds', {}, qs) as any;
              responseData = response.refunds || [];
            }
          }
        }

        // ============ ORDER ============
        if (resource === 'order') {
          if (operation === 'create') {
            const locationId = this.getNodeParameter('locationId', i) as string;
            const lineItemsData = this.getNodeParameter('lineItems', i) as IDataObject;
            const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

            const lineItems: IDataObject[] = [];
            if (lineItemsData.item && Array.isArray(lineItemsData.item)) {
              for (const item of lineItemsData.item) {
                const lineItem: IDataObject = {
                  quantity: item.quantity || '1',
                };
                if (item.name) lineItem.name = item.name;
                if (item.catalogObjectId) lineItem.catalog_object_id = item.catalogObjectId;
                if (item.basePriceAmount) {
                  lineItem.base_price_money = toMoney(item.basePriceAmount as number, (item.currency as string) || 'USD');
                }
                if (item.note) lineItem.note = item.note;
                lineItems.push(lineItem);
              }
            }

            const order: IDataObject = {
              location_id: locationId,
            };
            if (lineItems.length > 0) {
              order.line_items = lineItems;
            }
            if (additionalFields.customerId) order.customer_id = additionalFields.customerId;
            if (additionalFields.referenceId) order.reference_id = additionalFields.referenceId;
            if (additionalFields.state) order.state = additionalFields.state;
            if (additionalFields.ticketName) order.ticket_name = additionalFields.ticketName;

            const body: IDataObject = {
              idempotency_key: generateIdempotencyKey(),
              order,
            };

            responseData = await squareApiRequest.call(this, 'POST', '/v2/orders', body) as any;
          }

          if (operation === 'get') {
            const orderId = this.getNodeParameter('orderId', i) as string;
            responseData = await squareApiRequest.call(this, 'GET', `/v2/orders/${orderId}`) as any;
          }

          if (operation === 'search') {
            const locationIds = this.getNodeParameter('locationIds', i) as string;
            const returnAll = this.getNodeParameter('returnAll', i) as boolean;
            const filters = this.getNodeParameter('filters', i) as IDataObject;

            const body: IDataObject = {
              location_ids: parseStringList(locationIds),
            };

            const query: IDataObject = {};
            const filter: IDataObject = {};

            if (filters.states && (filters.states as string[]).length > 0) {
              filter.state_filter = { states: filters.states };
            }
            if (filters.customerIds) {
              filter.customer_filter = { customer_ids: parseStringList(filters.customerIds as string) };
            }
            if (filters.fulfillmentTypes && (filters.fulfillmentTypes as string[]).length > 0) {
              filter.fulfillment_filter = { fulfillment_types: filters.fulfillmentTypes };
            }

            if (Object.keys(filter).length > 0) {
              query.filter = filter;
            }

            if (filters.sortField) {
              query.sort = { sort_field: filters.sortField, sort_order: filters.sortOrder || 'DESC' };
            }

            if (Object.keys(query).length > 0) {
              body.query = query;
            }

            if (returnAll) {
              responseData = await squareApiRequestAllItems.call(this, 'POST', '/v2/orders/search', 'orders', body) as any;
            } else {
              const limit = this.getNodeParameter('limit', i) as number;
              body.limit = limit;
              const response = await squareApiRequest.call(this, 'POST', '/v2/orders/search', body) as any;
              responseData = response.orders || [];
            }
          }

          if (operation === 'update') {
            const orderId = this.getNodeParameter('orderId', i) as string;
            const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

            const order: IDataObject = {};
            if (updateFields.state) order.state = updateFields.state;
            if (updateFields.ticketName) order.ticket_name = updateFields.ticketName;
            if (updateFields.version) order.version = updateFields.version;

            const body: IDataObject = {
              idempotency_key: generateIdempotencyKey(),
              order: { ...order, location_id: orderId },
            };

            responseData = await squareApiRequest.call(this, 'PUT', `/v2/orders/${orderId}`, body) as any;
          }

          if (operation === 'pay') {
            const orderId = this.getNodeParameter('orderId', i) as string;
            const paymentIds = this.getNodeParameter('paymentIds', i) as string;

            const body: IDataObject = {
              idempotency_key: generateIdempotencyKey(),
              payment_ids: parseStringList(paymentIds),
            };

            responseData = await squareApiRequest.call(this, 'POST', `/v2/orders/${orderId}/pay`, body) as any;
          }

          if (operation === 'calculate') {
            const locationId = this.getNodeParameter('locationId', i) as string;
            const lineItemsData = this.getNodeParameter('lineItems', i) as IDataObject;

            const lineItems: IDataObject[] = [];
            if (lineItemsData.item && Array.isArray(lineItemsData.item)) {
              for (const item of lineItemsData.item) {
                const lineItem: IDataObject = {
                  quantity: item.quantity || '1',
                };
                if (item.name) lineItem.name = item.name;
                if (item.basePriceAmount) {
                  lineItem.base_price_money = toMoney(item.basePriceAmount as number, (item.currency as string) || 'USD');
                }
                lineItems.push(lineItem);
              }
            }

            const body: IDataObject = {
              order: {
                location_id: locationId,
                line_items: lineItems,
              },
            };

            responseData = await squareApiRequest.call(this, 'POST', '/v2/orders/calculate', body) as any;
          }

          if (operation === 'clone') {
            const orderId = this.getNodeParameter('orderId', i) as string;
            const cloneOptions = this.getNodeParameter('cloneOptions', i) as IDataObject;

            const body: IDataObject = {
              idempotency_key: generateIdempotencyKey(),
              order_id: orderId,
            };

            if (cloneOptions.version) {
              body.version = cloneOptions.version;
            }

            responseData = await squareApiRequest.call(this, 'POST', '/v2/orders/clone', body) as any;
          }
        }

        // ============ CUSTOMER ============
        if (resource === 'customer') {
          if (operation === 'create') {
            const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

            const body: IDataObject = {
              idempotency_key: generateIdempotencyKey(),
            };

            if (additionalFields.givenName) body.given_name = additionalFields.givenName;
            if (additionalFields.familyName) body.family_name = additionalFields.familyName;
            if (additionalFields.emailAddress) body.email_address = additionalFields.emailAddress;
            if (additionalFields.phoneNumber) body.phone_number = additionalFields.phoneNumber;
            if (additionalFields.companyName) body.company_name = additionalFields.companyName;
            if (additionalFields.nickname) body.nickname = additionalFields.nickname;
            if (additionalFields.note) body.note = additionalFields.note;
            if (additionalFields.birthday) body.birthday = additionalFields.birthday;
            if (additionalFields.referenceId) body.reference_id = additionalFields.referenceId;
            if (additionalFields.taxExempt !== undefined) body.tax_ids = additionalFields.taxExempt ? [{ eu_vat: 'EXEMPT' }] : undefined;

            if (additionalFields.addressLine1 || additionalFields.addressCity) {
              body.address = removeEmptyFields({
                address_line_1: additionalFields.addressLine1,
                address_line_2: additionalFields.addressLine2,
                locality: additionalFields.addressCity,
                administrative_district_level_1: additionalFields.addressState,
                postal_code: additionalFields.addressPostalCode,
                country: additionalFields.addressCountry,
              });
            }

            responseData = await squareApiRequest.call(this, 'POST', '/v2/customers', body) as any;
          }

          if (operation === 'get') {
            const customerId = this.getNodeParameter('customerId', i) as string;
            responseData = await squareApiRequest.call(this, 'GET', `/v2/customers/${customerId}`) as any;
          }

          if (operation === 'getMany') {
            const returnAll = this.getNodeParameter('returnAll', i) as boolean;
            const options = this.getNodeParameter('options', i) as IDataObject;
            const qs: IDataObject = {};

            if (options.sortField) qs.sort_field = options.sortField;
            if (options.sortOrder) qs.sort_order = options.sortOrder;

            if (returnAll) {
              responseData = await squareApiRequestAllItems.call(this, 'GET', '/v2/customers', 'customers', {}, qs) as any;
            } else {
              const limit = this.getNodeParameter('limit', i) as number;
              qs.limit = limit;
              const response = await squareApiRequest.call(this, 'GET', '/v2/customers', {}, qs) as any;
              responseData = response.customers || [];
            }
          }

          if (operation === 'search') {
            const returnAll = this.getNodeParameter('returnAll', i) as boolean;
            const filters = this.getNodeParameter('filters', i) as IDataObject;

            const body: IDataObject = {};
            const query: IDataObject = {};

            if (filters.emailAddress) {
              query.filter = query.filter || {};
              (query.filter as IDataObject).email_address = { exact: filters.emailAddress };
            }
            if (filters.phoneNumber) {
              query.filter = query.filter || {};
              (query.filter as IDataObject).phone_number = { exact: filters.phoneNumber };
            }
            if (filters.referenceId) {
              query.filter = query.filter || {};
              (query.filter as IDataObject).reference_id = { exact: filters.referenceId };
            }

            if (filters.sortField) {
              query.sort = { field: filters.sortField, order: filters.sortOrder || 'ASC' };
            }

            if (Object.keys(query).length > 0) {
              body.query = query;
            }

            if (returnAll) {
              responseData = await squareApiRequestAllItems.call(this, 'POST', '/v2/customers/search', 'customers', body) as any;
            } else {
              const limit = this.getNodeParameter('limit', i) as number;
              body.limit = limit;
              const response = await squareApiRequest.call(this, 'POST', '/v2/customers/search', body) as any;
              responseData = response.customers || [];
            }
          }

          if (operation === 'update') {
            const customerId = this.getNodeParameter('customerId', i) as string;
            const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

            const body: IDataObject = {};

            if (updateFields.givenName) body.given_name = updateFields.givenName;
            if (updateFields.familyName) body.family_name = updateFields.familyName;
            if (updateFields.emailAddress) body.email_address = updateFields.emailAddress;
            if (updateFields.phoneNumber) body.phone_number = updateFields.phoneNumber;
            if (updateFields.companyName) body.company_name = updateFields.companyName;
            if (updateFields.nickname) body.nickname = updateFields.nickname;
            if (updateFields.note) body.note = updateFields.note;
            if (updateFields.birthday) body.birthday = updateFields.birthday;
            if (updateFields.referenceId) body.reference_id = updateFields.referenceId;
            if (updateFields.version) body.version = updateFields.version;

            responseData = await squareApiRequest.call(this, 'PUT', `/v2/customers/${customerId}`, body) as any;
          }

          if (operation === 'delete') {
            const customerId = this.getNodeParameter('customerId', i) as string;
            responseData = await squareApiRequest.call(this, 'DELETE', `/v2/customers/${customerId}`) as any;
          }

          if (operation === 'addCard') {
            const customerId = this.getNodeParameter('customerId', i) as string;
            const cardNonce = this.getNodeParameter('cardNonce', i) as string;
            const cardOptions = this.getNodeParameter('cardOptions', i) as IDataObject;

            const body: IDataObject = {
              idempotency_key: generateIdempotencyKey(),
              source_id: cardNonce,
            };

            if (cardOptions.cardholderName) body.cardholder_name = cardOptions.cardholderName;
            if (cardOptions.verificationToken) body.verification_token = cardOptions.verificationToken;

            if (cardOptions.billingAddressLine1 || cardOptions.billingCity) {
              body.billing_address = removeEmptyFields({
                address_line_1: cardOptions.billingAddressLine1,
                locality: cardOptions.billingCity,
                postal_code: cardOptions.billingPostalCode,
                country: cardOptions.billingCountry,
              });
            }

            responseData = await squareApiRequest.call(this, 'POST', `/v2/customers/${customerId}/cards`, body) as any;
          }

          if (operation === 'deleteCard') {
            const customerId = this.getNodeParameter('customerId', i) as string;
            const cardId = this.getNodeParameter('cardId', i) as string;
            responseData = await squareApiRequest.call(this, 'DELETE', `/v2/customers/${customerId}/cards/${cardId}`) as any;
          }
        }

        // ============ CATALOG ============
        if (resource === 'catalog') {
          if (operation === 'list') {
            const returnAll = this.getNodeParameter('returnAll', i) as boolean;
            const options = this.getNodeParameter('options', i) as IDataObject;
            const qs: IDataObject = {};

            if (options.types && (options.types as string[]).length > 0) {
              qs.types = (options.types as string[]).join(',');
            }
            if (options.catalogVersion) {
              qs.catalog_version = options.catalogVersion;
            }

            if (returnAll) {
              responseData = await squareApiRequestAllItems.call(this, 'GET', '/v2/catalog/list', 'objects', {}, qs) as any;
            } else {
              const limit = this.getNodeParameter('limit', i) as number;
              qs.limit = limit;
              const response = await squareApiRequest.call(this, 'GET', '/v2/catalog/list', {}, qs) as any;
              responseData = response.objects || [];
            }
          }

          if (operation === 'get') {
            const objectId = this.getNodeParameter('objectId', i) as string;
            const options = this.getNodeParameter('options', i) as IDataObject;
            const qs: IDataObject = {};

            if (options.includeRelatedObjects) qs.include_related_objects = options.includeRelatedObjects;
            if (options.catalogVersion) qs.catalog_version = options.catalogVersion;

            responseData = await squareApiRequest.call(this, 'GET', `/v2/catalog/object/${objectId}`, {}, qs) as any;
          }

          if (operation === 'delete') {
            const objectId = this.getNodeParameter('objectId', i) as string;
            responseData = await squareApiRequest.call(this, 'DELETE', `/v2/catalog/object/${objectId}`) as any;
          }

          if (operation === 'search') {
            const returnAll = this.getNodeParameter('returnAll', i) as boolean;
            const filters = this.getNodeParameter('filters', i) as IDataObject;

            const body: IDataObject = {};

            if (filters.objectTypes && (filters.objectTypes as string[]).length > 0) {
              body.object_types = filters.objectTypes;
            }
            if (filters.textQuery) {
              body.query = { text_query: { keywords: [filters.textQuery] } };
            }
            if (filters.includeRelatedObjects) {
              body.include_related_objects = filters.includeRelatedObjects;
            }
            if (filters.includeDeletedObjects) {
              body.include_deleted_objects = filters.includeDeletedObjects;
            }

            if (returnAll) {
              responseData = await squareApiRequestAllItems.call(this, 'POST', '/v2/catalog/search', 'objects', body) as any;
            } else {
              const limit = this.getNodeParameter('limit', i) as number;
              body.limit = limit;
              const response = await squareApiRequest.call(this, 'POST', '/v2/catalog/search', body) as any;
              responseData = response.objects || [];
            }
          }

          if (operation === 'upsert') {
            const objectType = this.getNodeParameter('objectType', i) as string;
            const objectId = this.getNodeParameter('objectId', i) as string;
            const objectData = this.getNodeParameter('objectData', i) as string;

            const parsedData = typeof objectData === 'string' ? JSON.parse(objectData) : objectData;

            const body: IDataObject = {
              idempotency_key: generateIdempotencyKey(),
              object: {
                type: objectType,
                id: objectId,
                [`${objectType.toLowerCase()}_data`]: parsedData,
              },
            };

            responseData = await squareApiRequest.call(this, 'POST', '/v2/catalog/object', body) as any;
          }

          if (operation === 'batchRetrieve') {
            const objectIds = this.getNodeParameter('objectIds', i) as string;
            const options = this.getNodeParameter('options', i) as IDataObject;

            const body: IDataObject = {
              object_ids: parseStringList(objectIds),
            };

            if (options.includeRelatedObjects) body.include_related_objects = options.includeRelatedObjects;
            if (options.includeDeletedObjects) body.include_deleted_objects = options.includeDeletedObjects;

            responseData = await squareApiRequest.call(this, 'POST', '/v2/catalog/batch-retrieve', body) as any;
          }

          if (operation === 'batchDelete') {
            const objectIds = this.getNodeParameter('objectIds', i) as string;

            const body: IDataObject = {
              object_ids: parseStringList(objectIds),
            };

            responseData = await squareApiRequest.call(this, 'POST', '/v2/catalog/batch-delete', body) as any;
          }

          if (operation === 'batchUpsert') {
            const batches = this.getNodeParameter('batches', i) as string;

            const body: IDataObject = {
              idempotency_key: generateIdempotencyKey(),
              batches: typeof batches === 'string' ? JSON.parse(batches) : batches,
            };

            responseData = await squareApiRequest.call(this, 'POST', '/v2/catalog/batch-upsert', body) as any;
          }

          if (operation === 'updateItemModifierLists') {
            const itemIds = this.getNodeParameter('itemIds', i) as string;
            const modifierListsToEnable = this.getNodeParameter('modifierListsToEnable', i) as string;
            const modifierListsToDisable = this.getNodeParameter('modifierListsToDisable', i) as string;

            const body: IDataObject = {
              item_ids: parseStringList(itemIds),
            };

            if (modifierListsToEnable) {
              body.modifier_lists_to_enable = parseStringList(modifierListsToEnable);
            }
            if (modifierListsToDisable) {
              body.modifier_lists_to_disable = parseStringList(modifierListsToDisable);
            }

            responseData = await squareApiRequest.call(this, 'POST', '/v2/catalog/update-item-modifier-lists', body) as any;
          }

          if (operation === 'updateItemTaxes') {
            const itemIds = this.getNodeParameter('itemIds', i) as string;
            const taxesToEnable = this.getNodeParameter('taxesToEnable', i) as string;
            const taxesToDisable = this.getNodeParameter('taxesToDisable', i) as string;

            const body: IDataObject = {
              item_ids: parseStringList(itemIds),
            };

            if (taxesToEnable) {
              body.taxes_to_enable = parseStringList(taxesToEnable);
            }
            if (taxesToDisable) {
              body.taxes_to_disable = parseStringList(taxesToDisable);
            }

            responseData = await squareApiRequest.call(this, 'POST', '/v2/catalog/update-item-taxes', body) as any;
          }
        }

        // ============ INVENTORY ============
        if (resource === 'inventory') {
          if (operation === 'getCount') {
            const catalogObjectId = this.getNodeParameter('catalogObjectId', i) as string;
            const options = this.getNodeParameter('options', i) as IDataObject;
            const qs: IDataObject = {};

            if (options.locationIds) {
              qs.location_ids = options.locationIds;
            }

            responseData = await squareApiRequest.call(this, 'GET', `/v2/inventory/${catalogObjectId}`, {}, qs) as any;
          }

          if (operation === 'batchRetrieveCounts') {
            const catalogObjectIds = this.getNodeParameter('catalogObjectIds', i) as string;
            const options = this.getNodeParameter('options', i) as IDataObject;

            const body: IDataObject = {
              catalog_object_ids: parseStringList(catalogObjectIds),
            };

            if (options.locationIds) {
              body.location_ids = parseStringList(options.locationIds as string);
            }
            if (options.states && (options.states as string[]).length > 0) {
              body.states = options.states;
            }
            if (options.updatedAfter) {
              body.updated_after = toRfc3339(options.updatedAfter as string);
            }

            responseData = await squareApiRequest.call(this, 'POST', '/v2/inventory/counts/batch-retrieve', body) as any;
          }

          if (operation === 'batchRetrieveChanges') {
            const options = this.getNodeParameter('options', i) as IDataObject;

            const body: IDataObject = {};

            if (options.catalogObjectIds) {
              body.catalog_object_ids = parseStringList(options.catalogObjectIds as string);
            }
            if (options.locationIds) {
              body.location_ids = parseStringList(options.locationIds as string);
            }
            if (options.types && (options.types as string[]).length > 0) {
              body.types = options.types;
            }
            if (options.states && (options.states as string[]).length > 0) {
              body.states = options.states;
            }
            if (options.updatedAfter) {
              body.updated_after = toRfc3339(options.updatedAfter as string);
            }
            if (options.updatedBefore) {
              body.updated_before = toRfc3339(options.updatedBefore as string);
            }

            responseData = await squareApiRequest.call(this, 'POST', '/v2/inventory/changes/batch-retrieve', body) as any;
          }

          if (operation === 'batchChange') {
            const changesData = this.getNodeParameter('changes', i) as IDataObject;
            const ignoreUnchangedCounts = this.getNodeParameter('ignoreUnchangedCounts', i) as boolean;

            const changes: IDataObject[] = [];
            if (changesData.change && Array.isArray(changesData.change)) {
              for (const change of changesData.change) {
                const changeObj: IDataObject = {
                  type: change.type,
                };

                if (change.type === 'ADJUSTMENT') {
                  changeObj.adjustment = {
                    catalog_object_id: change.catalogObjectId,
                    location_id: change.locationId,
                    quantity: change.quantity,
                    from_state: change.fromState,
                    to_state: change.toState,
                    occurred_at: change.occurredAt ? toRfc3339(change.occurredAt as string) : new Date().toISOString(),
                  };
                  if (change.referenceId) {
                    (changeObj.adjustment as IDataObject).reference_id = change.referenceId;
                  }
                } else if (change.type === 'PHYSICAL_COUNT') {
                  changeObj.physical_count = {
                    catalog_object_id: change.catalogObjectId,
                    location_id: change.locationId,
                    quantity: change.quantity,
                    state: change.toState || 'IN_STOCK',
                    occurred_at: change.occurredAt ? toRfc3339(change.occurredAt as string) : new Date().toISOString(),
                  };
                }

                changes.push(changeObj);
              }
            }

            const body: IDataObject = {
              idempotency_key: generateIdempotencyKey(),
              changes,
              ignore_unchanged_counts: ignoreUnchangedCounts,
            };

            responseData = await squareApiRequest.call(this, 'POST', '/v2/inventory/changes/batch-create', body) as any;
          }
        }

        // ============ INVOICE ============
        if (resource === 'invoice') {
          if (operation === 'create') {
            const locationId = this.getNodeParameter('locationId', i) as string;
            const orderId = this.getNodeParameter('orderId', i) as string;
            const primaryRecipient = this.getNodeParameter('primaryRecipient', i) as IDataObject;
            const paymentRequestsData = this.getNodeParameter('paymentRequests', i) as IDataObject;
            const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

            const invoice: IDataObject = {
              location_id: locationId,
              order_id: orderId,
            };

            if (primaryRecipient.customerId || primaryRecipient.emailAddress) {
              invoice.primary_recipient = removeEmptyFields({
                customer_id: primaryRecipient.customerId,
                email_address: primaryRecipient.emailAddress,
                phone_number: primaryRecipient.phoneNumber,
              });
            }

            if (paymentRequestsData.request && Array.isArray(paymentRequestsData.request)) {
              invoice.payment_requests = (paymentRequestsData.request as IDataObject[]).map((req) => removeEmptyFields({
                request_type: req.requestType,
                due_date: req.dueDate,
                automatic_payment_source: req.automaticPaymentSource,
                percentage_requested: req.percentageRequested,
                tipping_enabled: req.tippingEnabled,
              }));
            }

            if (additionalFields.title) invoice.title = additionalFields.title;
            if (additionalFields.description) invoice.description = additionalFields.description;
            if (additionalFields.invoiceNumber) invoice.invoice_number = additionalFields.invoiceNumber;
            if (additionalFields.deliveryMethod) invoice.delivery_method = additionalFields.deliveryMethod;
            if (additionalFields.terms) invoice.payment_conditions = additionalFields.terms;
            if (additionalFields.scheduledAt) invoice.scheduled_at = toRfc3339(additionalFields.scheduledAt as string);

            const body: IDataObject = {
              idempotency_key: generateIdempotencyKey(),
              invoice,
            };

            responseData = await squareApiRequest.call(this, 'POST', '/v2/invoices', body) as any;
          }

          if (operation === 'get') {
            const invoiceId = this.getNodeParameter('invoiceId', i) as string;
            responseData = await squareApiRequest.call(this, 'GET', `/v2/invoices/${invoiceId}`) as any;
          }

          if (operation === 'getMany') {
            const locationId = this.getNodeParameter('locationId', i) as string;
            const returnAll = this.getNodeParameter('returnAll', i) as boolean;
            const qs: IDataObject = { location_id: locationId };

            if (returnAll) {
              responseData = await squareApiRequestAllItems.call(this, 'GET', '/v2/invoices', 'invoices', {}, qs) as any;
            } else {
              const limit = this.getNodeParameter('limit', i) as number;
              qs.limit = limit;
              const response = await squareApiRequest.call(this, 'GET', '/v2/invoices', {}, qs) as any;
              responseData = response.invoices || [];
            }
          }

          if (operation === 'search') {
            const locationIds = this.getNodeParameter('locationIds', i) as string;
            const returnAll = this.getNodeParameter('returnAll', i) as boolean;
            const filters = this.getNodeParameter('filters', i) as IDataObject;

            const body: IDataObject = {
              query: {
                filter: {
                  location_ids: parseStringList(locationIds),
                },
              },
            };

            if (filters.customerIds) {
              (body.query as IDataObject).filter = {
                ...((body.query as IDataObject).filter as IDataObject),
                customer_ids: parseStringList(filters.customerIds as string),
              };
            }

            if (returnAll) {
              responseData = await squareApiRequestAllItems.call(this, 'POST', '/v2/invoices/search', 'invoices', body) as any;
            } else {
              const limit = this.getNodeParameter('limit', i) as number;
              body.limit = limit;
              const response = await squareApiRequest.call(this, 'POST', '/v2/invoices/search', body) as any;
              responseData = response.invoices || [];
            }
          }

          if (operation === 'update') {
            const invoiceId = this.getNodeParameter('invoiceId', i) as string;
            const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

            const invoice: IDataObject = {};
            if (updateFields.title) invoice.title = updateFields.title;
            if (updateFields.description) invoice.description = updateFields.description;
            if (updateFields.invoiceNumber) invoice.invoice_number = updateFields.invoiceNumber;
            if (updateFields.terms) invoice.payment_conditions = updateFields.terms;
            if (updateFields.scheduledAt) invoice.scheduled_at = toRfc3339(updateFields.scheduledAt as string);

            const body: IDataObject = {
              idempotency_key: generateIdempotencyKey(),
              invoice,
              fields_to_clear: [],
            };

            responseData = await squareApiRequest.call(this, 'PUT', `/v2/invoices/${invoiceId}`, body) as any;
          }

          if (operation === 'delete') {
            const invoiceId = this.getNodeParameter('invoiceId', i) as string;
            responseData = await squareApiRequest.call(this, 'DELETE', `/v2/invoices/${invoiceId}`) as any;
          }

          if (operation === 'publish') {
            const invoiceId = this.getNodeParameter('invoiceId', i) as string;
            const version = this.getNodeParameter('version', i) as number;

            const body: IDataObject = {
              idempotency_key: generateIdempotencyKey(),
              version,
            };

            responseData = await squareApiRequest.call(this, 'POST', `/v2/invoices/${invoiceId}/publish`, body) as any;
          }

          if (operation === 'cancel') {
            const invoiceId = this.getNodeParameter('invoiceId', i) as string;
            const version = this.getNodeParameter('version', i) as number;

            const body: IDataObject = { version };

            responseData = await squareApiRequest.call(this, 'POST', `/v2/invoices/${invoiceId}/cancel`, body) as any;
          }
        }

        // ============ SUBSCRIPTION ============
        if (resource === 'subscription') {
          if (operation === 'create') {
            const locationId = this.getNodeParameter('locationId', i) as string;
            const planVariationId = this.getNodeParameter('planVariationId', i) as string;
            const customerId = this.getNodeParameter('customerId', i) as string;
            const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

            const body: IDataObject = {
              idempotency_key: generateIdempotencyKey(),
              location_id: locationId,
              plan_variation_id: planVariationId,
              customer_id: customerId,
            };

            if (additionalFields.cardId) body.card_id = additionalFields.cardId;
            if (additionalFields.sourceId) body.source_id = additionalFields.sourceId;
            if (additionalFields.startDate) body.start_date = additionalFields.startDate;
            if (additionalFields.taxPercentage) body.tax_percentage = additionalFields.taxPercentage;
            if (additionalFields.timezone) body.timezone = additionalFields.timezone;
            if (additionalFields.monthlyBillingAnchorDate) body.monthly_billing_anchor_date = additionalFields.monthlyBillingAnchorDate;

            responseData = await squareApiRequest.call(this, 'POST', '/v2/subscriptions', body) as any;
          }

          if (operation === 'get') {
            const subscriptionId = this.getNodeParameter('subscriptionId', i) as string;
            responseData = await squareApiRequest.call(this, 'GET', `/v2/subscriptions/${subscriptionId}`) as any;
          }

          if (operation === 'search') {
            const returnAll = this.getNodeParameter('returnAll', i) as boolean;
            const filters = this.getNodeParameter('filters', i) as IDataObject;

            const body: IDataObject = {};
            const query: IDataObject = { filter: {} };

            if (filters.customerIds) {
              (query.filter as IDataObject).customer_ids = parseStringList(filters.customerIds as string);
            }
            if (filters.locationIds) {
              (query.filter as IDataObject).location_ids = parseStringList(filters.locationIds as string);
            }
            if (filters.sourceNames) {
              (query.filter as IDataObject).source_names = parseStringList(filters.sourceNames as string);
            }

            if (Object.keys(query.filter as IDataObject).length > 0) {
              body.query = query;
            }

            if (returnAll) {
              responseData = await squareApiRequestAllItems.call(this, 'POST', '/v2/subscriptions/search', 'subscriptions', body) as any;
            } else {
              const limit = this.getNodeParameter('limit', i) as number;
              body.limit = limit;
              const response = await squareApiRequest.call(this, 'POST', '/v2/subscriptions/search', body) as any;
              responseData = response.subscriptions || [];
            }
          }

          if (operation === 'update') {
            const subscriptionId = this.getNodeParameter('subscriptionId', i) as string;
            const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

            const subscription: IDataObject = {};
            if (updateFields.cardId) subscription.card_id = updateFields.cardId;
            if (updateFields.sourceId) subscription.source_id = updateFields.sourceId;
            if (updateFields.planVariationId) subscription.plan_variation_id = updateFields.planVariationId;
            if (updateFields.taxPercentage) subscription.tax_percentage = updateFields.taxPercentage;
            if (updateFields.canceledDate) subscription.canceled_date = updateFields.canceledDate;
            if (updateFields.version) subscription.version = updateFields.version;

            if (updateFields.priceOverrideAmount) {
              subscription.price_override_money = toMoney(
                updateFields.priceOverrideAmount as number,
                (updateFields.priceOverrideCurrency as string) || 'USD'
              );
            }

            const body: IDataObject = { subscription };

            responseData = await squareApiRequest.call(this, 'PUT', `/v2/subscriptions/${subscriptionId}`, body) as any;
          }

          if (operation === 'cancel') {
            const subscriptionId = this.getNodeParameter('subscriptionId', i) as string;
            responseData = await squareApiRequest.call(this, 'POST', `/v2/subscriptions/${subscriptionId}/cancel`) as any;
          }

          if (operation === 'pause') {
            const subscriptionId = this.getNodeParameter('subscriptionId', i) as string;
            const pauseOptions = this.getNodeParameter('pauseOptions', i) as IDataObject;

            const body: IDataObject = {};
            if (pauseOptions.pauseCycleCount) body.pause_cycle_count = pauseOptions.pauseCycleCount;
            if (pauseOptions.pauseEffectiveDate) body.pause_effective_date = pauseOptions.pauseEffectiveDate;
            if (pauseOptions.pauseReason) body.pause_reason = pauseOptions.pauseReason;

            responseData = await squareApiRequest.call(this, 'POST', `/v2/subscriptions/${subscriptionId}/pause`, body) as any;
          }

          if (operation === 'resume') {
            const subscriptionId = this.getNodeParameter('subscriptionId', i) as string;
            const resumeOptions = this.getNodeParameter('resumeOptions', i) as IDataObject;

            const body: IDataObject = {};
            if (resumeOptions.resumeChangeTiming) body.resume_change_timing = resumeOptions.resumeChangeTiming;
            if (resumeOptions.resumeEffectiveDate) body.resume_effective_date = resumeOptions.resumeEffectiveDate;

            responseData = await squareApiRequest.call(this, 'POST', `/v2/subscriptions/${subscriptionId}/resume`, body) as any;
          }
        }

        // ============ LOCATION ============
        if (resource === 'location') {
          if (operation === 'create') {
            const name = this.getNodeParameter('name', i) as string;
            const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

            const location: IDataObject = { name };

            if (additionalFields.description) location.description = additionalFields.description;
            if (additionalFields.type) location.type = additionalFields.type;
            if (additionalFields.phoneNumber) location.phone_number = additionalFields.phoneNumber;
            if (additionalFields.businessName) location.business_name = additionalFields.businessName;
            if (additionalFields.businessEmail) location.business_email = additionalFields.businessEmail;
            if (additionalFields.websiteUrl) location.website_url = additionalFields.websiteUrl;
            if (additionalFields.timezone) location.timezone = additionalFields.timezone;
            if (additionalFields.languageCode) location.language_code = additionalFields.languageCode;
            if (additionalFields.facebookUrl) location.facebook_url = additionalFields.facebookUrl;
            if (additionalFields.instagramUsername) location.instagram_username = additionalFields.instagramUsername;
            if (additionalFields.twitterUsername) location.twitter_username = additionalFields.twitterUsername;

            if (additionalFields.addressLine1 || additionalFields.addressCity) {
              location.address = removeEmptyFields({
                address_line_1: additionalFields.addressLine1,
                address_line_2: additionalFields.addressLine2,
                locality: additionalFields.addressCity,
                administrative_district_level_1: additionalFields.addressState,
                postal_code: additionalFields.addressPostalCode,
                country: additionalFields.addressCountry,
              });
            }

            const body: IDataObject = { location };

            responseData = await squareApiRequest.call(this, 'POST', '/v2/locations', body) as any;
          }

          if (operation === 'get') {
            const locationId = this.getNodeParameter('locationId', i) as string;
            responseData = await squareApiRequest.call(this, 'GET', `/v2/locations/${locationId}`) as any;
          }

          if (operation === 'getMany') {
            const returnAll = this.getNodeParameter('returnAll', i) as boolean;

            if (returnAll) {
              responseData = await squareApiRequestAllItems.call(this, 'GET', '/v2/locations', 'locations') as any;
            } else {
              const limit = this.getNodeParameter('limit', i) as number;
              const response = await squareApiRequest.call(this, 'GET', '/v2/locations') as any;
              responseData = (response.locations || []).slice(0, limit);
            }
          }

          if (operation === 'update') {
            const locationId = this.getNodeParameter('locationId', i) as string;
            const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

            const location: IDataObject = {};

            if (updateFields.name) location.name = updateFields.name;
            if (updateFields.description) location.description = updateFields.description;
            if (updateFields.status) location.status = updateFields.status;
            if (updateFields.phoneNumber) location.phone_number = updateFields.phoneNumber;
            if (updateFields.businessName) location.business_name = updateFields.businessName;
            if (updateFields.businessEmail) location.business_email = updateFields.businessEmail;
            if (updateFields.websiteUrl) location.website_url = updateFields.websiteUrl;
            if (updateFields.timezone) location.timezone = updateFields.timezone;
            if (updateFields.facebookUrl) location.facebook_url = updateFields.facebookUrl;
            if (updateFields.instagramUsername) location.instagram_username = updateFields.instagramUsername;
            if (updateFields.twitterUsername) location.twitter_username = updateFields.twitterUsername;

            const body: IDataObject = { location };

            responseData = await squareApiRequest.call(this, 'PUT', `/v2/locations/${locationId}`, body) as any;
          }
        }

        // ============ LOYALTY ============
        if (resource === 'loyalty') {
          if (operation === 'createAccount') {
            const programId = this.getNodeParameter('programId', i) as string;
            const mappingType = this.getNodeParameter('mappingType', i) as string;
            const mappingValue = this.getNodeParameter('mappingValue', i) as string;

            const mapping: IDataObject = { type: mappingType };
            if (mappingType === 'CUSTOMER_ID') {
              mapping.value = mappingValue;
            } else {
              mapping.phone_number = mappingValue;
            }

            const body: IDataObject = {
              idempotency_key: generateIdempotencyKey(),
              loyalty_account: {
                program_id: programId,
                mapping,
              },
            };

            responseData = await squareApiRequest.call(this, 'POST', '/v2/loyalty/accounts', body) as any;
          }

          if (operation === 'getAccount') {
            const accountId = this.getNodeParameter('accountId', i) as string;
            responseData = await squareApiRequest.call(this, 'GET', `/v2/loyalty/accounts/${accountId}`) as any;
          }

          if (operation === 'getProgram') {
            const programId = this.getNodeParameter('programId', i) as string;
            responseData = await squareApiRequest.call(this, 'GET', `/v2/loyalty/programs/${programId}`) as any;
          }

          if (operation === 'searchAccounts') {
            const returnAll = this.getNodeParameter('returnAll', i) as boolean;
            const filters = this.getNodeParameter('filters', i) as IDataObject;

            const body: IDataObject = {};
            const query: IDataObject = {};

            if (filters.customerIds) {
              query.customer_ids = parseStringList(filters.customerIds as string);
            }
            if (filters.phoneNumber) {
              query.mappings = [{ phone_number: filters.phoneNumber }];
            }

            if (Object.keys(query).length > 0) {
              body.query = query;
            }

            if (returnAll) {
              responseData = await squareApiRequestAllItems.call(this, 'POST', '/v2/loyalty/accounts/search', 'loyalty_accounts', body) as any;
            } else {
              const limit = this.getNodeParameter('limit', i) as number;
              body.limit = limit;
              const response = await squareApiRequest.call(this, 'POST', '/v2/loyalty/accounts/search', body) as any;
              responseData = response.loyalty_accounts || [];
            }
          }

          if (operation === 'accumulatePoints') {
            const accountId = this.getNodeParameter('accountId', i) as string;
            const accumulateType = this.getNodeParameter('accumulateType', i) as string;
            const locationId = this.getNodeParameter('locationId', i) as string;

            const body: IDataObject = {
              idempotency_key: generateIdempotencyKey(),
              location_id: locationId,
            };

            if (accumulateType === 'ORDER') {
              const orderId = this.getNodeParameter('orderId', i) as string;
              body.accumulate_points = { order_id: orderId };
            } else {
              const points = this.getNodeParameter('points', i) as number;
              body.accumulate_points = { points };
            }

            responseData = await squareApiRequest.call(this, 'POST', `/v2/loyalty/accounts/${accountId}/accumulate`, body) as any;
          }

          if (operation === 'adjustPoints') {
            const accountId = this.getNodeParameter('accountId', i) as string;
            const points = this.getNodeParameter('points', i) as number;
            const reason = this.getNodeParameter('reason', i) as string;

            const body: IDataObject = {
              idempotency_key: generateIdempotencyKey(),
              adjust_points: {
                points,
                reason,
              },
            };

            responseData = await squareApiRequest.call(this, 'POST', `/v2/loyalty/accounts/${accountId}/adjust`, body) as any;
          }

          if (operation === 'redeemReward') {
            const rewardId = this.getNodeParameter('rewardId', i) as string;
            const locationId = this.getNodeParameter('locationId', i) as string;
            const orderId = this.getNodeParameter('orderId', i) as string;

            const body: IDataObject = {
              idempotency_key: generateIdempotencyKey(),
              location_id: locationId,
            };

            if (orderId) {
              body.order_id = orderId;