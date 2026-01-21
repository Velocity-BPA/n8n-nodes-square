/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties } from 'n8n-workflow';

export const customerOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['customer'],
      },
    },
    options: [
      {
        name: 'Add Card',
        value: 'addCard',
        description: 'Add a card to a customer',
        action: 'Add card to a customer',
      },
      {
        name: 'Create',
        value: 'create',
        description: 'Create a customer',
        action: 'Create a customer',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a customer',
        action: 'Delete a customer',
      },
      {
        name: 'Delete Card',
        value: 'deleteCard',
        description: 'Delete a card from a customer',
        action: 'Delete card from a customer',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a customer by ID',
        action: 'Get a customer',
      },
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Get many customers',
        action: 'Get many customers',
      },
      {
        name: 'Search',
        value: 'search',
        description: 'Search for customers',
        action: 'Search customers',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a customer',
        action: 'Update a customer',
      },
    ],
    default: 'create',
  },
];

export const customerFields: INodeProperties[] = [
  // ----------------------------------
  //         customer: create
  // ----------------------------------
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['customer'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Address - City',
        name: 'addressCity',
        type: 'string',
        default: '',
        description: 'City of the address',
      },
      {
        displayName: 'Address - Country',
        name: 'addressCountry',
        type: 'string',
        default: '',
        description: 'Country of the address (ISO 3166-1 alpha-2)',
      },
      {
        displayName: 'Address - Line 1',
        name: 'addressLine1',
        type: 'string',
        default: '',
        description: 'First line of the address',
      },
      {
        displayName: 'Address - Line 2',
        name: 'addressLine2',
        type: 'string',
        default: '',
        description: 'Second line of the address',
      },
      {
        displayName: 'Address - Postal Code',
        name: 'addressPostalCode',
        type: 'string',
        default: '',
        description: 'Postal code of the address',
      },
      {
        displayName: 'Address - State',
        name: 'addressState',
        type: 'string',
        default: '',
        description: 'State/province of the address',
      },
      {
        displayName: 'Birthday',
        name: 'birthday',
        type: 'string',
        default: '',
        description: 'Birthday (YYYY-MM-DD format)',
      },
      {
        displayName: 'Company Name',
        name: 'companyName',
        type: 'string',
        default: '',
        description: 'The company name associated with the customer',
      },
      {
        displayName: 'Email Address',
        name: 'emailAddress',
        type: 'string',
        default: '',
        description: 'The email address of the customer',
      },
      {
        displayName: 'Family Name',
        name: 'familyName',
        type: 'string',
        default: '',
        description: 'The family (last) name of the customer',
      },
      {
        displayName: 'Given Name',
        name: 'givenName',
        type: 'string',
        default: '',
        description: 'The given (first) name of the customer',
      },
      {
        displayName: 'Nickname',
        name: 'nickname',
        type: 'string',
        default: '',
        description: 'The nickname of the customer',
      },
      {
        displayName: 'Note',
        name: 'note',
        type: 'string',
        default: '',
        description: 'A note about the customer',
      },
      {
        displayName: 'Phone Number',
        name: 'phoneNumber',
        type: 'string',
        default: '',
        description: 'The phone number of the customer',
      },
      {
        displayName: 'Reference ID',
        name: 'referenceId',
        type: 'string',
        default: '',
        description: 'A user-defined reference ID for the customer',
      },
    ],
  },

  // ----------------------------------
  //         customer: get/delete/update/addCard/deleteCard
  // ----------------------------------
  {
    displayName: 'Customer ID',
    name: 'customerId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['customer'],
        operation: ['get', 'delete', 'update', 'addCard', 'deleteCard'],
      },
    },
    description: 'The ID of the customer',
  },

  // ----------------------------------
  //         customer: getMany
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['customer'],
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
        resource: ['customer'],
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
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['customer'],
        operation: ['getMany'],
      },
    },
    options: [
      {
        displayName: 'Sort Field',
        name: 'sortField',
        type: 'options',
        options: [
          { name: 'Created At', value: 'CREATED_AT' },
          { name: 'Default', value: 'DEFAULT' },
        ],
        default: 'DEFAULT',
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
        default: 'ASC',
        description: 'Sort order',
      },
    ],
  },

  // ----------------------------------
  //         customer: search
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['customer'],
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
        resource: ['customer'],
        operation: ['search'],
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
        resource: ['customer'],
        operation: ['search'],
      },
    },
    options: [
      {
        displayName: 'Company Name',
        name: 'companyName',
        type: 'string',
        default: '',
        description: 'Filter by company name (exact match)',
      },
      {
        displayName: 'Creation Source',
        name: 'creationSource',
        type: 'multiOptions',
        options: [
          { name: 'Appointments', value: 'APPOINTMENTS' },
          { name: 'Directory', value: 'DIRECTORY' },
          { name: 'Email Collection', value: 'EMAIL_COLLECTION' },
          { name: 'Import', value: 'IMPORT' },
          { name: 'Invoices', value: 'INVOICES' },
          { name: 'Loyalty', value: 'LOYALTY' },
          { name: 'Online Store', value: 'ONLINE_STORE' },
          { name: 'Other', value: 'OTHER' },
          { name: 'Terminal', value: 'TERMINAL' },
          { name: 'Third Party', value: 'THIRD_PARTY' },
        ],
        default: [],
        description: 'Filter by creation source',
      },
      {
        displayName: 'Created At End',
        name: 'createdAtEnd',
        type: 'dateTime',
        default: '',
        description: 'End of creation time filter',
      },
      {
        displayName: 'Created At Start',
        name: 'createdAtStart',
        type: 'dateTime',
        default: '',
        description: 'Start of creation time filter',
      },
      {
        displayName: 'Email Address',
        name: 'emailAddress',
        type: 'string',
        default: '',
        description: 'Filter by email address (exact or fuzzy match)',
      },
      {
        displayName: 'Group IDs',
        name: 'groupIds',
        type: 'string',
        default: '',
        description: 'Comma-separated list of customer group IDs',
      },
      {
        displayName: 'Phone Number',
        name: 'phoneNumber',
        type: 'string',
        default: '',
        description: 'Filter by phone number (exact or fuzzy match)',
      },
      {
        displayName: 'Reference ID',
        name: 'referenceId',
        type: 'string',
        default: '',
        description: 'Filter by reference ID (exact match)',
      },
      {
        displayName: 'Sort Field',
        name: 'sortField',
        type: 'options',
        options: [
          { name: 'Created At', value: 'CREATED_AT' },
          { name: 'Default', value: 'DEFAULT' },
        ],
        default: 'DEFAULT',
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
        default: 'ASC',
        description: 'Sort order',
      },
    ],
  },

  // ----------------------------------
  //         customer: update
  // ----------------------------------
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['customer'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Address - City',
        name: 'addressCity',
        type: 'string',
        default: '',
        description: 'City of the address',
      },
      {
        displayName: 'Address - Country',
        name: 'addressCountry',
        type: 'string',
        default: '',
        description: 'Country of the address (ISO 3166-1 alpha-2)',
      },
      {
        displayName: 'Address - Line 1',
        name: 'addressLine1',
        type: 'string',
        default: '',
        description: 'First line of the address',
      },
      {
        displayName: 'Address - Postal Code',
        name: 'addressPostalCode',
        type: 'string',
        default: '',
        description: 'Postal code of the address',
      },
      {
        displayName: 'Address - State',
        name: 'addressState',
        type: 'string',
        default: '',
        description: 'State/province of the address',
      },
      {
        displayName: 'Birthday',
        name: 'birthday',
        type: 'string',
        default: '',
        description: 'Birthday (YYYY-MM-DD format)',
      },
      {
        displayName: 'Company Name',
        name: 'companyName',
        type: 'string',
        default: '',
        description: 'The company name associated with the customer',
      },
      {
        displayName: 'Email Address',
        name: 'emailAddress',
        type: 'string',
        default: '',
        description: 'The email address of the customer',
      },
      {
        displayName: 'Family Name',
        name: 'familyName',
        type: 'string',
        default: '',
        description: 'The family (last) name of the customer',
      },
      {
        displayName: 'Given Name',
        name: 'givenName',
        type: 'string',
        default: '',
        description: 'The given (first) name of the customer',
      },
      {
        displayName: 'Nickname',
        name: 'nickname',
        type: 'string',
        default: '',
        description: 'The nickname of the customer',
      },
      {
        displayName: 'Note',
        name: 'note',
        type: 'string',
        default: '',
        description: 'A note about the customer',
      },
      {
        displayName: 'Phone Number',
        name: 'phoneNumber',
        type: 'string',
        default: '',
        description: 'The phone number of the customer',
      },
      {
        displayName: 'Reference ID',
        name: 'referenceId',
        type: 'string',
        default: '',
        description: 'A user-defined reference ID for the customer',
      },
      {
        displayName: 'Version',
        name: 'version',
        type: 'number',
        default: 0,
        description: 'Version for optimistic concurrency',
      },
    ],
  },

  // ----------------------------------
  //         customer: addCard
  // ----------------------------------
  {
    displayName: 'Card Nonce',
    name: 'cardNonce',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['customer'],
        operation: ['addCard'],
      },
    },
    description: 'The card nonce from the Web Payments SDK',
  },
  {
    displayName: 'Card Options',
    name: 'cardOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['customer'],
        operation: ['addCard'],
      },
    },
    options: [
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
        description: 'Country of the billing address',
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
        displayName: 'Cardholder Name',
        name: 'cardholderName',
        type: 'string',
        default: '',
        description: 'Name on the card',
      },
      {
        displayName: 'Verification Token',
        name: 'verificationToken',
        type: 'string',
        default: '',
        description: 'SCA verification token',
      },
    ],
  },

  // ----------------------------------
  //         customer: deleteCard
  // ----------------------------------
  {
    displayName: 'Card ID',
    name: 'cardId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['customer'],
        operation: ['deleteCard'],
      },
    },
    description: 'The ID of the card to delete',
  },
];
