/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties } from 'n8n-workflow';

export const inventoryOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['inventory'] } },
    options: [
      { name: 'Batch Change', value: 'batchChange', description: 'Apply inventory changes in batch', action: 'Batch change inventory' },
      { name: 'Batch Retrieve Changes', value: 'batchRetrieveChanges', description: 'Retrieve inventory changes', action: 'Batch retrieve changes' },
      { name: 'Batch Retrieve Counts', value: 'batchRetrieveCounts', description: 'Retrieve inventory counts', action: 'Batch retrieve counts' },
      { name: 'Get Count', value: 'getCount', description: 'Get inventory count', action: 'Get inventory count' },
    ],
    default: 'getCount',
  },
];

export const inventoryFields: INodeProperties[] = [
  { displayName: 'Catalog Object ID', name: 'catalogObjectId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['inventory'], operation: ['getCount'] } }, description: 'The ID of the catalog object' },
  { displayName: 'Catalog Object IDs', name: 'catalogObjectIds', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['inventory'], operation: ['batchRetrieveCounts'] } }, description: 'Comma-separated catalog object IDs' },
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: { show: { resource: ['inventory'], operation: ['getCount', 'batchRetrieveCounts', 'batchRetrieveChanges'] } },
    options: [
      { displayName: 'Location IDs', name: 'locationIds', type: 'string', default: '', description: 'Comma-separated location IDs' },
      { displayName: 'Updated After', name: 'updatedAfter', type: 'dateTime', default: '', description: 'Return counts updated after this time' },
      {
        displayName: 'States',
        name: 'states',
        type: 'multiOptions',
        options: [
          { name: 'In Stock', value: 'IN_STOCK' },
          { name: 'Sold', value: 'SOLD' },
          { name: 'Waste', value: 'WASTE' },
          { name: 'None', value: 'NONE' },
        ],
        default: [],
        description: 'Inventory states to filter',
      },
    ],
  },
  {
    displayName: 'Changes',
    name: 'changes',
    type: 'fixedCollection',
    typeOptions: { multipleValues: true },
    default: {},
    displayOptions: { show: { resource: ['inventory'], operation: ['batchChange'] } },
    options: [
      {
        name: 'change',
        displayName: 'Change',
        values: [
          { displayName: 'Type', name: 'type', type: 'options', options: [{ name: 'Adjustment', value: 'ADJUSTMENT' }, { name: 'Physical Count', value: 'PHYSICAL_COUNT' }, { name: 'Transfer', value: 'TRANSFER' }], default: 'ADJUSTMENT', description: 'Type of change' },
          { displayName: 'Catalog Object ID', name: 'catalogObjectId', type: 'string', default: '', description: 'Catalog object ID' },
          { displayName: 'Location ID', name: 'locationId', type: 'string', default: '', description: 'Location ID' },
          { displayName: 'Quantity', name: 'quantity', type: 'string', default: '0', description: 'Quantity change' },
          { displayName: 'From State', name: 'fromState', type: 'options', options: [{ name: 'In Stock', value: 'IN_STOCK' }, { name: 'None', value: 'NONE' }, { name: 'Sold', value: 'SOLD' }, { name: 'Waste', value: 'WASTE' }], default: 'NONE', description: 'Source state' },
          { displayName: 'To State', name: 'toState', type: 'options', options: [{ name: 'In Stock', value: 'IN_STOCK' }, { name: 'None', value: 'NONE' }, { name: 'Sold', value: 'SOLD' }, { name: 'Waste', value: 'WASTE' }], default: 'IN_STOCK', description: 'Destination state' },
          { displayName: 'Occurred At', name: 'occurredAt', type: 'dateTime', default: '', description: 'When the change occurred' },
        ],
      },
    ],
    description: 'The inventory changes to apply',
  },
  { displayName: 'Ignore Unchanged Counts', name: 'ignoreUnchangedCounts', type: 'boolean', default: true, displayOptions: { show: { resource: ['inventory'], operation: ['batchChange'] } }, description: 'Ignore unchanged counts' },
];
