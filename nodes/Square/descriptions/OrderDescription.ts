/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties } from 'n8n-workflow';

export const orderOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['order'],
      },
    },
    options: [
      {
        name: 'Calculate',
        value: 'calculate',
        description: 'Calculate an order (pricing preview)',
        action: 'Calculate an order',
      },
      {
        name: 'Clone',
        value: 'clone',
        description: 'Clone an existing order',
        action: 'Clone an order',
      },
      {
        name: 'Create',
        value: 'create',
        description: 'Create an order',
        action: 'Create an order',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get an order by ID',
        action: 'Get an order',
      },
      {
        name: 'Pay',
        value: 'pay',
        description: 'Pay for an order',
        action: 'Pay for an order',
      },
      {
        name: 'Search',
        value: 'search',
        description: 'Search for orders',
        action: 'Search orders',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update an order',
        action: 'Update an order',
      },
    ],
    default: 'create',
  },
];

export const orderFields: INodeProperties[] = [
  // ----------------------------------
  //         order: create/calculate
  // ----------------------------------
  {
    displayName: 'Location ID',
    name: 'locationId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['order'],
        operation: ['create', 'calculate'],
      },
    },
    description: 'The ID of the location for the order',
  },
  {
    displayName: 'Line Items',
    name: 'lineItems',
    type: 'fixedCollection',
    typeOptions: {
      multipleValues: true,
    },
    default: {},
    displayOptions: {
      show: {
        resource: ['order'],
        operation: ['create', 'calculate'],
      },
    },
    options: [
      {
        name: 'item',
        displayName: 'Item',
        values: [
          {
            displayName: 'Name',
            name: 'name',
            type: 'string',
            default: '',
            description: 'The name of the line item',
          },
          {
            displayName: 'Quantity',
            name: 'quantity',
            type: 'string',
            default: '1',
            description: 'The quantity of the item',
          },
          {
            displayName: 'Base Price Amount',
            name: 'basePriceAmount',
            type: 'number',
            default: 0,
            description: 'The base price in base currency unit',
          },
          {
            displayName: 'Currency',
            name: 'currency',
            type: 'string',
            default: 'USD',
            description: 'The currency code',
          },
          {
            displayName: 'Catalog Object ID',
            name: 'catalogObjectId',
            type: 'string',
            default: '',
            description: 'The ID of the catalog item variation',
          },
          {
            displayName: 'Note',
            name: 'note',
            type: 'string',
            default: '',
            description: 'A note for the line item',
          },
        ],
      },
    ],
    description: 'The line items in the order',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['order'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Customer ID',
        name: 'customerId',
        type: 'string',
        default: '',
        description: 'The ID of the customer associated with the order',
      },
      {
        displayName: 'Reference ID',
        name: 'referenceId',
        type: 'string',
        default: '',
        description: 'A user-defined reference ID for the order',
      },
      {
        displayName: 'Source Name',
        name: 'sourceName',
        type: 'string',
        default: '',
        description: 'The source of the order (for third-party applications)',
      },
      {
        displayName: 'State',
        name: 'state',
        type: 'options',
        options: [
          { name: 'Open', value: 'OPEN' },
          { name: 'Completed', value: 'COMPLETED' },
          { name: 'Canceled', value: 'CANCELED' },
          { name: 'Draft', value: 'DRAFT' },
        ],
        default: 'OPEN',
        description: 'The state of the order',
      },
      {
        displayName: 'Ticket Name',
        name: 'ticketName',
        type: 'string',
        default: '',
        description: 'The ticket name to display for the order',
      },
    ],
  },

  // ----------------------------------
  //         order: get/update/pay/clone
  // ----------------------------------
  {
    displayName: 'Order ID',
    name: 'orderId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['order'],
        operation: ['get', 'update', 'pay', 'clone'],
      },
    },
    description: 'The ID of the order',
  },

  // ----------------------------------
  //         order: search
  // ----------------------------------
  {
    displayName: 'Location IDs',
    name: 'locationIds',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['order'],
        operation: ['search'],
      },
    },
    description: 'Comma-separated list of location IDs to search',
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['order'],
        operation: ['search'],
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
        resource: ['order'],
        operation: ['search'],
        returnAll: [false],
      },
    },
    typeOptions: {
      minValue: 1,
      maxValue: 500,
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
        resource: ['order'],
        operation: ['search'],
      },
    },
    options: [
      {
        displayName: 'Customer IDs',
        name: 'customerIds',
        type: 'string',
        default: '',
        description: 'Comma-separated list of customer IDs to filter by',
      },
      {
        displayName: 'Date Time Filter - End At',
        name: 'dateTimeFilterEndAt',
        type: 'dateTime',
        default: '',
        description: 'End time for the date time filter',
      },
      {
        displayName: 'Date Time Filter - Start At',
        name: 'dateTimeFilterStartAt',
        type: 'dateTime',
        default: '',
        description: 'Start time for the date time filter',
      },
      {
        displayName: 'Fulfillment States',
        name: 'fulfillmentStates',
        type: 'multiOptions',
        options: [
          { name: 'Proposed', value: 'PROPOSED' },
          { name: 'Reserved', value: 'RESERVED' },
          { name: 'Prepared', value: 'PREPARED' },
          { name: 'Completed', value: 'COMPLETED' },
          { name: 'Canceled', value: 'CANCELED' },
          { name: 'Failed', value: 'FAILED' },
        ],
        default: [],
        description: 'Fulfillment states to filter by',
      },
      {
        displayName: 'Fulfillment Types',
        name: 'fulfillmentTypes',
        type: 'multiOptions',
        options: [
          { name: 'Pickup', value: 'PICKUP' },
          { name: 'Shipment', value: 'SHIPMENT' },
          { name: 'Delivery', value: 'DELIVERY' },
        ],
        default: [],
        description: 'Fulfillment types to filter by',
      },
      {
        displayName: 'Sort Field',
        name: 'sortField',
        type: 'options',
        options: [
          { name: 'Created At', value: 'CREATED_AT' },
          { name: 'Updated At', value: 'UPDATED_AT' },
          { name: 'Closed At', value: 'CLOSED_AT' },
        ],
        default: 'CREATED_AT',
        description: 'Field to sort by',
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
        description: 'Sort order',
      },
      {
        displayName: 'Source Names',
        name: 'sourceNames',
        type: 'string',
        default: '',
        description: 'Comma-separated list of source names to filter by',
      },
      {
        displayName: 'States',
        name: 'states',
        type: 'multiOptions',
        options: [
          { name: 'Open', value: 'OPEN' },
          { name: 'Completed', value: 'COMPLETED' },
          { name: 'Canceled', value: 'CANCELED' },
          { name: 'Draft', value: 'DRAFT' },
        ],
        default: [],
        description: 'Order states to filter by',
      },
    ],
  },

  // ----------------------------------
  //         order: pay
  // ----------------------------------
  {
    displayName: 'Payment IDs',
    name: 'paymentIds',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['order'],
        operation: ['pay'],
      },
    },
    description: 'Comma-separated list of payment IDs to apply to the order',
  },

  // ----------------------------------
  //         order: update
  // ----------------------------------
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['order'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'State',
        name: 'state',
        type: 'options',
        options: [
          { name: 'Open', value: 'OPEN' },
          { name: 'Completed', value: 'COMPLETED' },
          { name: 'Canceled', value: 'CANCELED' },
        ],
        default: 'OPEN',
        description: 'The new state of the order',
      },
      {
        displayName: 'Ticket Name',
        name: 'ticketName',
        type: 'string',
        default: '',
        description: 'The ticket name to update',
      },
      {
        displayName: 'Version',
        name: 'version',
        type: 'number',
        default: 0,
        description: 'The version for optimistic concurrency',
      },
    ],
  },

  // ----------------------------------
  //         order: clone
  // ----------------------------------
  {
    displayName: 'Clone Options',
    name: 'cloneOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['order'],
        operation: ['clone'],
      },
    },
    options: [
      {
        displayName: 'Version',
        name: 'version',
        type: 'number',
        default: 0,
        description: 'Version of the source order',
      },
    ],
  },
];
