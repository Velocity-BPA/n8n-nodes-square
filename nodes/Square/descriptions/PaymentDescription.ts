/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties } from 'n8n-workflow';

export const paymentOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['payment'],
      },
    },
    options: [
      {
        name: 'Cancel',
        value: 'cancel',
        description: 'Cancel a payment',
        action: 'Cancel a payment',
      },
      {
        name: 'Complete',
        value: 'complete',
        description: 'Complete a payment',
        action: 'Complete a payment',
      },
      {
        name: 'Create',
        value: 'create',
        description: 'Create a payment',
        action: 'Create a payment',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a payment by ID',
        action: 'Get a payment',
      },
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Get many payments',
        action: 'Get many payments',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a payment',
        action: 'Update a payment',
      },
    ],
    default: 'create',
  },
];

export const paymentFields: INodeProperties[] = [
  // ----------------------------------
  //         payment: create
  // ----------------------------------
  {
    displayName: 'Source ID',
    name: 'sourceId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['payment'],
        operation: ['create'],
      },
    },
    description: 'The ID of the source (card nonce, card ID, or external card) for the payment',
  },
  {
    displayName: 'Amount',
    name: 'amount',
    type: 'number',
    required: true,
    default: 0,
    displayOptions: {
      show: {
        resource: ['payment'],
        operation: ['create'],
      },
    },
    description: 'The payment amount in the base currency unit (e.g., dollars, not cents)',
  },
  {
    displayName: 'Currency',
    name: 'currency',
    type: 'string',
    required: true,
    default: 'USD',
    displayOptions: {
      show: {
        resource: ['payment'],
        operation: ['create'],
      },
    },
    description: 'The currency code (e.g., USD, EUR, GBP)',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['payment'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Autocomplete',
        name: 'autocomplete',
        type: 'boolean',
        default: true,
        description: 'Whether to automatically complete the payment after authorization',
      },
      {
        displayName: 'Billing Address - City',
        name: 'billingCity',
        type: 'string',
        default: '',
        description: 'City of the billing address',
      },
      {
        displayName: 'Billing Address - Country',
        name: 'billingCountry',
        type: 'string',
        default: '',
        description: 'Country of the billing address (ISO 3166-1 alpha-2)',
      },
      {
        displayName: 'Billing Address - Line 1',
        name: 'billingAddressLine1',
        type: 'string',
        default: '',
        description: 'First line of the billing address',
      },
      {
        displayName: 'Billing Address - Postal Code',
        name: 'billingPostalCode',
        type: 'string',
        default: '',
        description: 'Postal code of the billing address',
      },
      {
        displayName: 'Buyer Email',
        name: 'buyerEmailAddress',
        type: 'string',
        default: '',
        description: 'The email address of the buyer',
      },
      {
        displayName: 'Customer ID',
        name: 'customerId',
        type: 'string',
        default: '',
        description: 'The ID of the customer associated with the payment',
      },
      {
        displayName: 'Delay Action',
        name: 'delayAction',
        type: 'options',
        options: [
          { name: 'Cancel', value: 'CANCEL' },
          { name: 'Complete', value: 'COMPLETE' },
        ],
        default: 'CANCEL',
        description: 'The action to perform on the payment after the delay duration',
      },
      {
        displayName: 'Delay Duration',
        name: 'delayDuration',
        type: 'string',
        default: '',
        description: 'The duration to delay the completion or cancellation (ISO 8601 format)',
      },
      {
        displayName: 'Location ID',
        name: 'locationId',
        type: 'string',
        default: '',
        description: 'The ID of the location to associate with the payment',
      },
      {
        displayName: 'Note',
        name: 'note',
        type: 'string',
        default: '',
        description: 'A note to associate with the payment',
      },
      {
        displayName: 'Order ID',
        name: 'orderId',
        type: 'string',
        default: '',
        description: 'The ID of the order to associate with the payment',
      },
      {
        displayName: 'Reference ID',
        name: 'referenceId',
        type: 'string',
        default: '',
        description: 'A user-defined reference ID for the payment',
      },
      {
        displayName: 'Statement Description',
        name: 'statementDescriptionIdentifier',
        type: 'string',
        default: '',
        description: "A description that appears on the buyer's statement",
      },
      {
        displayName: 'Tip Amount',
        name: 'tipAmount',
        type: 'number',
        default: 0,
        description: 'The tip amount in base currency unit',
      },
      {
        displayName: 'Verification Token',
        name: 'verificationToken',
        type: 'string',
        default: '',
        description: 'A token generated by the Web Payments SDK for SCA verification',
      },
    ],
  },

  // ----------------------------------
  //         payment: get/cancel/complete/update
  // ----------------------------------
  {
    displayName: 'Payment ID',
    name: 'paymentId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['payment'],
        operation: ['get', 'cancel', 'complete', 'update'],
      },
    },
    description: 'The ID of the payment',
  },

  // ----------------------------------
  //         payment: getMany
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['payment'],
        operation: ['getMany'],
      },
    },
    description: 'Whether to return all results or only up to a given limit',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    default: 50,
    displayOptions: {
      show: {
        resource: ['payment'],
        operation: ['getMany'],
        returnAll: [false],
      },
    },
    typeOptions: {
      minValue: 1,
      maxValue: 100,
    },
    description: 'Max number of results to return',
  },
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['payment'],
        operation: ['getMany'],
      },
    },
    options: [
      {
        displayName: 'Begin Time',
        name: 'beginTime',
        type: 'dateTime',
        default: '',
        description: 'The beginning of the time range to retrieve payments',
      },
      {
        displayName: 'Card Brand',
        name: 'cardBrand',
        type: 'options',
        options: [
          { name: 'American Express', value: 'AMERICAN_EXPRESS' },
          { name: 'China Unionpay', value: 'CHINA_UNIONPAY' },
          { name: 'Discover', value: 'DISCOVER' },
          { name: 'Discover Diners', value: 'DISCOVER_DINERS' },
          { name: 'Interac', value: 'INTERAC' },
          { name: 'JCB', value: 'JCB' },
          { name: 'Mastercard', value: 'MASTERCARD' },
          { name: 'Square Gift Card', value: 'SQUARE_GIFT_CARD' },
          { name: 'Visa', value: 'VISA' },
        ],
        default: 'VISA',
        description: 'Filter by card brand',
      },
      {
        displayName: 'End Time',
        name: 'endTime',
        type: 'dateTime',
        default: '',
        description: 'The end of the time range to retrieve payments',
      },
      {
        displayName: 'Last 4 Digits',
        name: 'last4',
        type: 'string',
        default: '',
        description: 'Filter by the last 4 digits of the card number',
      },
      {
        displayName: 'Location ID',
        name: 'locationId',
        type: 'string',
        default: '',
        description: 'Filter by location ID',
      },
      {
        displayName: 'Sort Order',
        name: 'sortOrder',
        type: 'options',
        options: [
          { name: 'Ascending', value: 'ASC' },
          { name: 'Descending', value: 'DESC' },
        ],
        default: 'DESC',
        description: 'The order to sort results',
      },
    ],
  },

  // ----------------------------------
  //         payment: update
  // ----------------------------------
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['payment'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Tip Amount',
        name: 'tipAmount',
        type: 'number',
        default: 0,
        description: 'The tip amount to add to the payment (in base currency)',
      },
      {
        displayName: 'Version Token',
        name: 'versionToken',
        type: 'string',
        default: '',
        description: 'The version token for optimistic concurrency',
      },
    ],
  },
];
