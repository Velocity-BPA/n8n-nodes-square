/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties } from 'n8n-workflow';

export const teamOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['team'] } },
    options: [
      { name: 'Create Member', value: 'createMember', description: 'Create a team member', action: 'Create a team member' },
      { name: 'Get Member', value: 'getMember', description: 'Get a team member', action: 'Get a team member' },
      { name: 'Get Wage Setting', value: 'getWageSetting', description: 'Get wage setting for a team member', action: 'Get wage setting' },
      { name: 'Search Members', value: 'searchMembers', description: 'Search for team members', action: 'Search team members' },
      { name: 'Update Member', value: 'updateMember', description: 'Update a team member', action: 'Update a team member' },
      { name: 'Update Wage Setting', value: 'updateWageSetting', description: 'Update wage setting', action: 'Update wage setting' },
    ],
    default: 'searchMembers',
  },
];

export const teamFields: INodeProperties[] = [
  { displayName: 'Team Member ID', name: 'teamMemberId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['team'], operation: ['getMember', 'updateMember', 'getWageSetting', 'updateWageSetting'] } }, description: 'Team member ID' },
  { displayName: 'Return All', name: 'returnAll', type: 'boolean', default: false, displayOptions: { show: { resource: ['team'], operation: ['searchMembers'] } }, description: 'Return all results' },
  { displayName: 'Limit', name: 'limit', type: 'number', default: 50, displayOptions: { show: { resource: ['team'], operation: ['searchMembers'], returnAll: [false] } }, typeOptions: { minValue: 1, maxValue: 200 }, description: 'Max results' },
  {
    displayName: 'Member Fields',
    name: 'memberFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: { show: { resource: ['team'], operation: ['createMember'] } },
    options: [
      { displayName: 'Given Name', name: 'givenName', type: 'string', default: '', description: 'First name' },
      { displayName: 'Family Name', name: 'familyName', type: 'string', default: '', description: 'Last name' },
      { displayName: 'Email Address', name: 'emailAddress', type: 'string', default: '', description: 'Email address' },
      { displayName: 'Phone Number', name: 'phoneNumber', type: 'string', default: '', description: 'Phone number' },
      { displayName: 'Status', name: 'status', type: 'options', options: [{ name: 'Active', value: 'ACTIVE' }, { name: 'Inactive', value: 'INACTIVE' }], default: 'ACTIVE', description: 'Status' },
      { displayName: 'Reference ID', name: 'referenceId', type: 'string', default: '', description: 'Reference ID' },
    ],
  },
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: { show: { resource: ['team'], operation: ['searchMembers'] } },
    options: [
      { displayName: 'Location IDs', name: 'locationIds', type: 'string', default: '', description: 'Comma-separated location IDs' },
      { displayName: 'Status', name: 'status', type: 'options', options: [{ name: 'Active', value: 'ACTIVE' }, { name: 'Inactive', value: 'INACTIVE' }], default: 'ACTIVE', description: 'Status filter' },
      { displayName: 'Is Owner', name: 'isOwner', type: 'boolean', default: false, description: 'Filter by owner status' },
    ],
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: { show: { resource: ['team'], operation: ['updateMember'] } },
    options: [
      { displayName: 'Given Name', name: 'givenName', type: 'string', default: '', description: 'First name' },
      { displayName: 'Family Name', name: 'familyName', type: 'string', default: '', description: 'Last name' },
      { displayName: 'Email Address', name: 'emailAddress', type: 'string', default: '', description: 'Email address' },
      { displayName: 'Phone Number', name: 'phoneNumber', type: 'string', default: '', description: 'Phone number' },
      { displayName: 'Status', name: 'status', type: 'options', options: [{ name: 'Active', value: 'ACTIVE' }, { name: 'Inactive', value: 'INACTIVE' }], default: 'ACTIVE', description: 'Status' },
      { displayName: 'Reference ID', name: 'referenceId', type: 'string', default: '', description: 'Reference ID' },
    ],
  },
  {
    displayName: 'Wage Settings',
    name: 'wageSettings',
    type: 'collection',
    placeholder: 'Add Setting',
    default: {},
    displayOptions: { show: { resource: ['team'], operation: ['updateWageSetting'] } },
    options: [
      { displayName: 'Is Overtime Exempt', name: 'isOvertimeExempt', type: 'boolean', default: false, description: 'Overtime exempt status' },
      { displayName: 'Version', name: 'version', type: 'number', default: 0, description: 'Version for concurrency' },
    ],
  },
];
