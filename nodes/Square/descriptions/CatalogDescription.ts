/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties } from 'n8n-workflow';

export const catalogOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['catalog'] } },
    options: [
      { name: 'Batch Delete', value: 'batchDelete', description: 'Delete multiple catalog objects', action: 'Batch delete catalog objects' },
      { name: 'Batch Retrieve', value: 'batchRetrieve', description: 'Retrieve multiple catalog objects', action: 'Batch retrieve catalog objects' },
      { name: 'Batch Upsert', value: 'batchUpsert', description: 'Create or update multiple catalog objects', action: 'Batch upsert catalog objects' },
      { name: 'Delete', value: 'delete', description: 'Delete a catalog object', action: 'Delete a catalog object' },
      { name: 'Get', value: 'get', description: 'Get a catalog object by ID', action: 'Get a catalog object' },
      { name: 'List', value: 'list', description: 'List catalog objects', action: 'List catalog objects' },
      { name: 'Search', value: 'search', description: 'Search for catalog objects', action: 'Search catalog objects' },
      { name: 'Upsert', value: 'upsert', description: 'Create or update a catalog object', action: 'Upsert a catalog object' },
    ],
    default: 'list',
  },
];

export const catalogFields: INodeProperties[] = [
  { displayName: 'Return All', name: 'returnAll', type: 'boolean', default: false, displayOptions: { show: { resource: ['catalog'], operation: ['list', 'search'] } }, description: 'Whether to return all results' },
  { displayName: 'Limit', name: 'limit', type: 'number', default: 50, displayOptions: { show: { resource: ['catalog'], operation: ['list', 'search'], returnAll: [false] } }, typeOptions: { minValue: 1, maxValue: 200 }, description: 'Max number of results' },
  { displayName: 'Object ID', name: 'objectId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['catalog'], operation: ['get', 'delete'] } }, description: 'The ID of the catalog object' },
  { displayName: 'Object IDs', name: 'objectIds', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['catalog'], operation: ['batchRetrieve', 'batchDelete'] } }, description: 'Comma-separated list of catalog object IDs' },
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: { show: { resource: ['catalog'], operation: ['list'] } },
    options: [
      { displayName: 'Catalog Version', name: 'catalogVersion', type: 'number', default: 0, description: 'The specific catalog version' },
      {
        displayName: 'Types',
        name: 'types',
        type: 'multiOptions',
        options: [
          { name: 'Category', value: 'CATEGORY' },
          { name: 'Discount', value: 'DISCOUNT' },
          { name: 'Image', value: 'IMAGE' },
          { name: 'Item', value: 'ITEM' },
          { name: 'Item Option', value: 'ITEM_OPTION' },
          { name: 'Item Variation', value: 'ITEM_VARIATION' },
          { name: 'Modifier', value: 'MODIFIER' },
          { name: 'Modifier List', value: 'MODIFIER_LIST' },
          { name: 'Tax', value: 'TAX' },
        ],
        default: [],
        description: 'Types of catalog objects to list',
      },
    ],
  },
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: { show: { resource: ['catalog'], operation: ['search'] } },
    options: [
      { displayName: 'Text Query', name: 'textQuery', type: 'string', default: '', description: 'Text to search for' },
      { displayName: 'Category IDs', name: 'categoryIds', type: 'string', default: '', description: 'Comma-separated category IDs' },
      { displayName: 'Include Deleted Objects', name: 'includeDeletedObjects', type: 'boolean', default: false, description: 'Include deleted objects' },
      { displayName: 'Include Related Objects', name: 'includeRelatedObjects', type: 'boolean', default: false, description: 'Include related objects' },
      {
        displayName: 'Object Types',
        name: 'objectTypes',
        type: 'multiOptions',
        options: [
          { name: 'Category', value: 'CATEGORY' },
          { name: 'Discount', value: 'DISCOUNT' },
          { name: 'Item', value: 'ITEM' },
          { name: 'Item Variation', value: 'ITEM_VARIATION' },
          { name: 'Modifier List', value: 'MODIFIER_LIST' },
          { name: 'Tax', value: 'TAX' },
        ],
        default: [],
        description: 'Object types to filter',
      },
    ],
  },
  {
    displayName: 'Object Type',
    name: 'objectType',
    type: 'options',
    required: true,
    default: 'ITEM',
    displayOptions: { show: { resource: ['catalog'], operation: ['upsert'] } },
    options: [
      { name: 'Category', value: 'CATEGORY' },
      { name: 'Discount', value: 'DISCOUNT' },
      { name: 'Item', value: 'ITEM' },
      { name: 'Item Variation', value: 'ITEM_VARIATION' },
      { name: 'Modifier', value: 'MODIFIER' },
      { name: 'Modifier List', value: 'MODIFIER_LIST' },
      { name: 'Tax', value: 'TAX' },
    ],
    description: 'The type of catalog object',
  },
  { displayName: 'Object ID', name: 'upsertObjectId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['catalog'], operation: ['upsert'] } }, description: 'The ID for the catalog object (use #prefix for temporary IDs)' },
  { displayName: 'Object Data (JSON)', name: 'objectData', type: 'json', required: true, default: '{}', displayOptions: { show: { resource: ['catalog'], operation: ['upsert'] } }, description: 'The data for the catalog object' },
  { displayName: 'Batches (JSON)', name: 'batches', type: 'json', required: true, default: '[]', displayOptions: { show: { resource: ['catalog'], operation: ['batchUpsert'] } }, description: 'Array of batch objects to upsert' },
];
