/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties } from 'n8n-workflow';

export const subscriptionOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['subscription'] } },
    options: [
      { name: 'Cancel', value: 'cancel', description: 'Cancel a subscription', action: 'Cancel a subscription' },
      { name: 'Create', value: 'create', description: 'Create a subscription', action: 'Create a subscription' },
      { name: 'Get', value: 'get', description: 'Get a subscription by ID', action: 'Get a subscription' },
      { name: 'Pause', value: 'pause', description: 'Pause a subscription', action: 'Pause a subscription' },
      { name: 'Resume', value: 'resume', description: 'Resume a subscription', action: 'Resume a subscription' },
      { name: 'Search', value: 'search', description: 'Search for subscriptions', action: 'Search subscriptions' },
      { name: 'Update', value: 'update', description: 'Update a subscription', action: 'Update a subscription' },
    ],
    default: 'create',
  },
];

export const subscriptionFields: INodeProperties[] = [
  { displayName: 'Location ID', name: 'locationId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['subscription'], operation: ['create'] } }, description: 'Location ID' },
  { displayName: 'Plan Variation ID', name: 'planVariationId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['subscription'], operation: ['create'] } }, description: 'Plan variation ID' },
  { displayName: 'Customer ID', name: 'customerId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['subscription'], operation: ['create'] } }, description: 'Customer ID' },
  { displayName: 'Subscription ID', name: 'subscriptionId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['subscription'], operation: ['get', 'update', 'cancel', 'pause', 'resume'] } }, description: 'Subscription ID' },
  { displayName: 'Return All', name: 'returnAll', type: 'boolean', default: false, displayOptions: { show: { resource: ['subscription'], operation: ['search'] } }, description: 'Return all results' },
  { displayName: 'Limit', name: 'limit', type: 'number', default: 50, displayOptions: { show: { resource: ['subscription'], operation: ['search'], returnAll: [false] } }, typeOptions: { minValue: 1, maxValue: 200 }, description: 'Max results' },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: { show: { resource: ['subscription'], operation: ['create'] } },
    options: [
      { displayName: 'Card ID', name: 'cardId', type: 'string', default: '', description: 'Card on file ID' },
      { displayName: 'Source ID', name: 'sourceId', type: 'string', default: '', description: 'Payment source ID' },
      { displayName: 'Start Date', name: 'startDate', type: 'string', default: '', description: 'Start date (YYYY-MM-DD)' },
      { displayName: 'Tax Percentage', name: 'taxPercentage', type: 'string', default: '', description: 'Tax percentage' },
      { displayName: 'Timezone', name: 'timezone', type: 'string', default: '', description: 'Timezone' },
    ],
  },
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: { show: { resource: ['subscription'], operation: ['search'] } },
    options: [
      { displayName: 'Customer IDs', name: 'customerIds', type: 'string', default: '', description: 'Comma-separated customer IDs' },
      { displayName: 'Location IDs', name: 'locationIds', type: 'string', default: '', description: 'Comma-separated location IDs' },
      { displayName: 'Source Names', name: 'sourceNames', type: 'string', default: '', description: 'Comma-separated source names' },
    ],
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: { show: { resource: ['subscription'], operation: ['update'] } },
    options: [
      { displayName: 'Card ID', name: 'cardId', type: 'string', default: '', description: 'Card to use' },
      { displayName: 'Canceled Date', name: 'canceledDate', type: 'string', default: '', description: 'Cancellation date' },
      { displayName: 'Plan Variation ID', name: 'planVariationId', type: 'string', default: '', description: 'New plan variation' },
      { displayName: 'Tax Percentage', name: 'taxPercentage', type: 'string', default: '', description: 'Tax percentage' },
      { displayName: 'Version', name: 'version', type: 'number', default: 0, description: 'Version' },
    ],
  },
  {
    displayName: 'Pause Options',
    name: 'pauseOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: { show: { resource: ['subscription'], operation: ['pause'] } },
    options: [
      { displayName: 'Pause Cycle Count', name: 'pauseCycleCount', type: 'number', default: 0, description: 'Billing cycles to pause' },
      { displayName: 'Pause Effective Date', name: 'pauseEffectiveDate', type: 'string', default: '', description: 'Pause date (YYYY-MM-DD)' },
      { displayName: 'Pause Reason', name: 'pauseReason', type: 'string', default: '', description: 'Reason' },
    ],
  },
  {
    displayName: 'Resume Options',
    name: 'resumeOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: { show: { resource: ['subscription'], operation: ['resume'] } },
    options: [
      { displayName: 'Resume Change Timing', name: 'resumeChangeTiming', type: 'options', options: [{ name: 'Immediate', value: 'IMMEDIATE' }, { name: 'End Of Billing Cycle', value: 'END_OF_BILLING_CYCLE' }], default: 'IMMEDIATE', description: 'When to resume' },
      { displayName: 'Resume Effective Date', name: 'resumeEffectiveDate', type: 'string', default: '', description: 'Resume date' },
    ],
  },
];
