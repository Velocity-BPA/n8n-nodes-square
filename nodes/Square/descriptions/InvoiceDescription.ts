/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties } from 'n8n-workflow';

export const invoiceOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['invoice'] } },
    options: [
      { name: 'Cancel', value: 'cancel', description: 'Cancel an invoice', action: 'Cancel an invoice' },
      { name: 'Create', value: 'create', description: 'Create an invoice', action: 'Create an invoice' },
      { name: 'Delete', value: 'delete', description: 'Delete a draft invoice', action: 'Delete an invoice' },
      { name: 'Get', value: 'get', description: 'Get an invoice by ID', action: 'Get an invoice' },
      { name: 'Get Many', value: 'getMany', description: 'Get many invoices', action: 'Get many invoices' },
      { name: 'Publish', value: 'publish', description: 'Publish a draft invoice', action: 'Publish an invoice' },
      { name: 'Search', value: 'search', description: 'Search for invoices', action: 'Search invoices' },
      { name: 'Update', value: 'update', description: 'Update an invoice', action: 'Update an invoice' },
    ],
    default: 'create',
  },
];

export const invoiceFields: INodeProperties[] = [
  { displayName: 'Location ID', name: 'locationId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['invoice'], operation: ['create', 'getMany'] } }, description: 'The ID of the location' },
  { displayName: 'Order ID', name: 'orderId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['invoice'], operation: ['create'] } }, description: 'The ID of the order to invoice' },
  { displayName: 'Invoice ID', name: 'invoiceId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['invoice'], operation: ['get', 'delete', 'update', 'cancel', 'publish'] } }, description: 'The ID of the invoice' },
  { displayName: 'Location IDs', name: 'locationIds', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['invoice'], operation: ['search'] } }, description: 'Comma-separated location IDs' },
  { displayName: 'Return All', name: 'returnAll', type: 'boolean', default: false, displayOptions: { show: { resource: ['invoice'], operation: ['getMany', 'search'] } }, description: 'Return all results' },
  { displayName: 'Limit', name: 'limit', type: 'number', default: 50, displayOptions: { show: { resource: ['invoice'], operation: ['getMany', 'search'], returnAll: [false] } }, typeOptions: { minValue: 1, maxValue: 200 }, description: 'Max results' },
  { displayName: 'Version', name: 'version', type: 'number', required: true, default: 0, displayOptions: { show: { resource: ['invoice'], operation: ['publish', 'cancel'] } }, description: 'The current version' },
  {
    displayName: 'Primary Recipient',
    name: 'primaryRecipient',
    type: 'collection',
    placeholder: 'Add Recipient',
    default: {},
    displayOptions: { show: { resource: ['invoice'], operation: ['create'] } },
    options: [
      { displayName: 'Customer ID', name: 'customerId', type: 'string', default: '', description: 'Customer ID' },
      { displayName: 'Email Address', name: 'emailAddress', type: 'string', default: '', description: 'Email address' },
      { displayName: 'Phone Number', name: 'phoneNumber', type: 'string', default: '', description: 'Phone number' },
    ],
  },
  {
    displayName: 'Payment Requests',
    name: 'paymentRequests',
    type: 'fixedCollection',
    typeOptions: { multipleValues: true },
    default: {},
    displayOptions: { show: { resource: ['invoice'], operation: ['create'] } },
    options: [
      {
        name: 'request',
        displayName: 'Payment Request',
        values: [
          { displayName: 'Request Type', name: 'requestType', type: 'options', options: [{ name: 'Balance', value: 'BALANCE' }, { name: 'Deposit', value: 'DEPOSIT' }, { name: 'Installment', value: 'INSTALLMENT' }], default: 'BALANCE', description: 'Type' },
          { displayName: 'Due Date', name: 'dueDate', type: 'string', default: '', description: 'Due date (YYYY-MM-DD)' },
          { displayName: 'Automatic Payment Source', name: 'automaticPaymentSource', type: 'options', options: [{ name: 'None', value: 'NONE' }, { name: 'Card On File', value: 'CARD_ON_FILE' }, { name: 'Bank On File', value: 'BANK_ON_FILE' }], default: 'NONE', description: 'Payment source' },
          { displayName: 'Tipping Enabled', name: 'tippingEnabled', type: 'boolean', default: false, description: 'Enable tipping' },
        ],
      },
    ],
    description: 'Payment requests',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: { show: { resource: ['invoice'], operation: ['create'] } },
    options: [
      { displayName: 'Description', name: 'description', type: 'string', default: '', description: 'Description' },
      { displayName: 'Delivery Method', name: 'deliveryMethod', type: 'options', options: [{ name: 'Email', value: 'EMAIL' }, { name: 'Share Manually', value: 'SHARE_MANUALLY' }, { name: 'SMS', value: 'SMS' }], default: 'EMAIL', description: 'Delivery method' },
      { displayName: 'Invoice Number', name: 'invoiceNumber', type: 'string', default: '', description: 'Invoice number' },
      { displayName: 'Title', name: 'title', type: 'string', default: '', description: 'Title' },
      { displayName: 'Terms', name: 'terms', type: 'string', default: '', description: 'Terms and conditions' },
      { displayName: 'Scheduled At', name: 'scheduledAt', type: 'dateTime', default: '', description: 'When to send' },
    ],
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: { show: { resource: ['invoice'], operation: ['update'] } },
    options: [
      { displayName: 'Description', name: 'description', type: 'string', default: '', description: 'Description' },
      { displayName: 'Invoice Number', name: 'invoiceNumber', type: 'string', default: '', description: 'Invoice number' },
      { displayName: 'Title', name: 'title', type: 'string', default: '', description: 'Title' },
      { displayName: 'Terms', name: 'terms', type: 'string', default: '', description: 'Terms' },
      { displayName: 'Version', name: 'version', type: 'number', default: 0, description: 'Version' },
    ],
  },
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: { show: { resource: ['invoice'], operation: ['search'] } },
    options: [
      { displayName: 'Customer IDs', name: 'customerIds', type: 'string', default: '', description: 'Comma-separated customer IDs' },
    ],
  },
];
