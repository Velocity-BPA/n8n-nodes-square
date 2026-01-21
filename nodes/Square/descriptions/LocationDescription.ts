/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties } from 'n8n-workflow';

export const locationOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['location'] } },
    options: [
      { name: 'Create', value: 'create', description: 'Create a location', action: 'Create a location' },
      { name: 'Get', value: 'get', description: 'Get a location by ID', action: 'Get a location' },
      { name: 'Get Many', value: 'getMany', description: 'Get many locations', action: 'Get many locations' },
      { name: 'Update', value: 'update', description: 'Update a location', action: 'Update a location' },
    ],
    default: 'getMany',
  },
];

export const locationFields: INodeProperties[] = [
  { displayName: 'Name', name: 'name', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['location'], operation: ['create'] } }, description: 'Location name' },
  { displayName: 'Location ID', name: 'locationId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['location'], operation: ['get', 'update'] } }, description: 'Location ID' },
  { displayName: 'Return All', name: 'returnAll', type: 'boolean', default: false, displayOptions: { show: { resource: ['location'], operation: ['getMany'] } }, description: 'Return all results' },
  { displayName: 'Limit', name: 'limit', type: 'number', default: 50, displayOptions: { show: { resource: ['location'], operation: ['getMany'], returnAll: [false] } }, typeOptions: { minValue: 1, maxValue: 100 }, description: 'Max results' },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: { show: { resource: ['location'], operation: ['create'] } },
    options: [
      { displayName: 'Address - City', name: 'addressCity', type: 'string', default: '', description: 'City' },
      { displayName: 'Address - Country', name: 'addressCountry', type: 'string', default: '', description: 'Country code' },
      { displayName: 'Address - Line 1', name: 'addressLine1', type: 'string', default: '', description: 'Address line 1' },
      { displayName: 'Address - Postal Code', name: 'addressPostalCode', type: 'string', default: '', description: 'Postal code' },
      { displayName: 'Address - State', name: 'addressState', type: 'string', default: '', description: 'State' },
      { displayName: 'Business Email', name: 'businessEmail', type: 'string', default: '', description: 'Business email' },
      { displayName: 'Business Name', name: 'businessName', type: 'string', default: '', description: 'Business name' },
      { displayName: 'Description', name: 'description', type: 'string', default: '', description: 'Description' },
      { displayName: 'Phone Number', name: 'phoneNumber', type: 'string', default: '', description: 'Phone number' },
      { displayName: 'Timezone', name: 'timezone', type: 'string', default: '', description: 'Timezone' },
      { displayName: 'Type', name: 'type', type: 'options', options: [{ name: 'Physical', value: 'PHYSICAL' }, { name: 'Mobile', value: 'MOBILE' }], default: 'PHYSICAL', description: 'Location type' },
      { displayName: 'Website URL', name: 'websiteUrl', type: 'string', default: '', description: 'Website URL' },
    ],
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: { show: { resource: ['location'], operation: ['update'] } },
    options: [
      { displayName: 'Name', name: 'name', type: 'string', default: '', description: 'Name' },
      { displayName: 'Address - City', name: 'addressCity', type: 'string', default: '', description: 'City' },
      { displayName: 'Address - Country', name: 'addressCountry', type: 'string', default: '', description: 'Country code' },
      { displayName: 'Address - Line 1', name: 'addressLine1', type: 'string', default: '', description: 'Address line 1' },
      { displayName: 'Address - Postal Code', name: 'addressPostalCode', type: 'string', default: '', description: 'Postal code' },
      { displayName: 'Address - State', name: 'addressState', type: 'string', default: '', description: 'State' },
      { displayName: 'Business Email', name: 'businessEmail', type: 'string', default: '', description: 'Business email' },
      { displayName: 'Description', name: 'description', type: 'string', default: '', description: 'Description' },
      { displayName: 'Phone Number', name: 'phoneNumber', type: 'string', default: '', description: 'Phone number' },
      { displayName: 'Status', name: 'status', type: 'options', options: [{ name: 'Active', value: 'ACTIVE' }, { name: 'Inactive', value: 'INACTIVE' }], default: 'ACTIVE', description: 'Status' },
      { displayName: 'Timezone', name: 'timezone', type: 'string', default: '', description: 'Timezone' },
      { displayName: 'Website URL', name: 'websiteUrl', type: 'string', default: '', description: 'Website URL' },
    ],
  },
];
