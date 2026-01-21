/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties } from 'n8n-workflow';

export const giftCardOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['giftCard'] } },
    options: [
      { name: 'Create', value: 'create', description: 'Create a gift card', action: 'Create a gift card' },
      { name: 'Get', value: 'get', description: 'Get a gift card by ID', action: 'Get a gift card' },
      { name: 'Get From GAN', value: 'getFromGan', description: 'Get a gift card by GAN', action: 'Get gift card by GAN' },
      { name: 'Get From Nonce', value: 'getFromNonce', description: 'Get a gift card from nonce', action: 'Get gift card by nonce' },
      { name: 'Link Customer', value: 'linkCustomer', description: 'Link a customer to gift card', action: 'Link customer' },
      { name: 'List', value: 'list', description: 'List gift cards', action: 'List gift cards' },
      { name: 'Unlink Customer', value: 'unlinkCustomer', description: 'Unlink a customer', action: 'Unlink customer' },
    ],
    default: 'list',
  },
];

export const giftCardFields: INodeProperties[] = [
  { displayName: 'Gift Card ID', name: 'giftCardId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['giftCard'], operation: ['get', 'linkCustomer', 'unlinkCustomer'] } }, description: 'Gift card ID' },
  { displayName: 'GAN', name: 'gan', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['giftCard'], operation: ['getFromGan'] } }, description: 'Gift card account number' },
  { displayName: 'Nonce', name: 'nonce', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['giftCard'], operation: ['getFromNonce'] } }, description: 'Gift card nonce from Web Payments SDK' },
  { displayName: 'Customer ID', name: 'customerId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['giftCard'], operation: ['linkCustomer', 'unlinkCustomer'] } }, description: 'Customer ID' },
  { displayName: 'Location ID', name: 'locationId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['giftCard'], operation: ['create'] } }, description: 'Location ID' },
  { displayName: 'Type', name: 'type', type: 'options', required: true, options: [{ name: 'Digital', value: 'DIGITAL' }, { name: 'Physical', value: 'PHYSICAL' }], default: 'DIGITAL', displayOptions: { show: { resource: ['giftCard'], operation: ['create'] } }, description: 'Gift card type' },
  { displayName: 'Return All', name: 'returnAll', type: 'boolean', default: false, displayOptions: { show: { resource: ['giftCard'], operation: ['list'] } }, description: 'Return all results' },
  { displayName: 'Limit', name: 'limit', type: 'number', default: 50, displayOptions: { show: { resource: ['giftCard'], operation: ['list'], returnAll: [false] } }, typeOptions: { minValue: 1, maxValue: 200 }, description: 'Max results' },
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: { show: { resource: ['giftCard'], operation: ['list'] } },
    options: [
      { displayName: 'Customer ID', name: 'customerId', type: 'string', default: '', description: 'Customer ID' },
      { displayName: 'State', name: 'state', type: 'options', options: [{ name: 'Active', value: 'ACTIVE' }, { name: 'Deactivated', value: 'DEACTIVATED' }, { name: 'Pending', value: 'PENDING' }], default: 'ACTIVE', description: 'Gift card state' },
      { displayName: 'Type', name: 'type', type: 'options', options: [{ name: 'Digital', value: 'DIGITAL' }, { name: 'Physical', value: 'PHYSICAL' }], default: 'DIGITAL', description: 'Gift card type' },
    ],
  },
];
