/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties } from 'n8n-workflow';

export const refundOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['refund'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a refund',
        action: 'Create a refund',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a refund by ID',
        action: 'Get a refund',
      },
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Get many refunds',
        action: 'Get many refunds',
      },
    ],
    default: 'create',
  },
];

export const refundFields: INodeProperties[] = [
  // ----------------------------------
  //         refund: create
  // ----------------------------------
  {
    displayName: 'Payment ID',
    name: 'paymentId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['refund'],
        operation: ['create'],
      },
    },
    description: 'The ID of the payment to refund',
  },
  {
    displayName: 'Amount',
    name: 'amount',
    type: 'number',
    required: true,
    default: 0,
    displayOptions: {
      show: {
        resource: ['refund'],
        operation: ['create'],
      },
    },
    description: 'The refund amount in base currency unit (e.g., dollars)',
  },
  {
    displayName: 'Currency',
    name: 'currency',
    type: 'string',
    required: true,
    default: 'USD',
    displayOptions: {
      show: {
        resource: ['refund'],
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
        resource: ['refund'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'App Fee Amount',
        name: 'appFeeAmount',
        type: 'number',
        default: 0,
        description: 'The amount to refund from the application fee (in base currency)',
      },
      {
        displayName: 'Destination ID',
        name: 'destinationId',
        type: 'string',
        default: '',
        description: 'The ID of the payment method to refund to (for external refunds)',
      },
      {
        displayName: 'Location ID',
        name: 'locationId',
        type: 'string',
        default: '',
        description: 'The ID of the location to associate with the refund',
      },
      {
        displayName: 'Reason',
        name: 'reason',
        type: 'string',
        default: '',
        description: 'The reason for the refund',
      },
      {
        displayName: 'Team Member ID',
        name: 'teamMemberId',
        type: 'string',
        default: '',
        description: 'The ID of the team member initiating the refund',
      },
    ],
  },

  // ----------------------------------
  //         refund: get
  // ----------------------------------
  {
    displayName: 'Refund ID',
    name: 'refundId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['refund'],
        operation: ['get'],
      },
    },
    description: 'The ID of the refund to retrieve',
  },

  // ----------------------------------
  //         refund: getMany
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['refund'],
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
        resource: ['refund'],
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
        resource: ['refund'],
        operation: ['getMany'],
      },
    },
    options: [
      {
        displayName: 'Begin Time',
        name: 'beginTime',
        type: 'dateTime',
        default: '',
        description: 'The beginning of the time range for refunds',
      },
      {
        displayName: 'End Time',
        name: 'endTime',
        type: 'dateTime',
        default: '',
        description: 'The end of the time range for refunds',
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
      {
        displayName: 'Source Type',
        name: 'sourceType',
        type: 'options',
        options: [
          { name: 'Card', value: 'CARD' },
          { name: 'Cash', value: 'CASH' },
          { name: 'External', value: 'EXTERNAL' },
          { name: 'Wallet', value: 'WALLET' },
        ],
        default: 'CARD',
        description: 'Filter by source type',
      },
      {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        options: [
          { name: 'Pending', value: 'PENDING' },
          { name: 'Approved', value: 'APPROVED' },
          { name: 'Rejected', value: 'REJECTED' },
          { name: 'Failed', value: 'FAILED' },
        ],
        default: 'PENDING',
        description: 'Filter by refund status',
      },
    ],
  },
];
