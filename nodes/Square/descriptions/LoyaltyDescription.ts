/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties } from 'n8n-workflow';

export const loyaltyOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: { show: { resource: ['loyalty'] } },
    options: [
      { name: 'Accumulate Points', value: 'accumulatePoints', description: 'Add points to a loyalty account', action: 'Accumulate points' },
      { name: 'Adjust Points', value: 'adjustPoints', description: 'Adjust points on a loyalty account', action: 'Adjust points' },
      { name: 'Create Account', value: 'createAccount', description: 'Create a loyalty account', action: 'Create account' },
      { name: 'Create Reward', value: 'createReward', description: 'Create a loyalty reward', action: 'Create reward' },
      { name: 'Delete Reward', value: 'deleteReward', description: 'Delete a loyalty reward', action: 'Delete reward' },
      { name: 'Get Account', value: 'getAccount', description: 'Get a loyalty account', action: 'Get account' },
      { name: 'Get Program', value: 'getProgram', description: 'Get loyalty program details', action: 'Get program' },
      { name: 'Redeem Reward', value: 'redeemReward', description: 'Redeem a loyalty reward', action: 'Redeem reward' },
      { name: 'Search Accounts', value: 'searchAccounts', description: 'Search loyalty accounts', action: 'Search accounts' },
    ],
    default: 'searchAccounts',
  },
];

export const loyaltyFields: INodeProperties[] = [
  { displayName: 'Program ID', name: 'programId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['loyalty'], operation: ['createAccount', 'getProgram'] } }, description: 'Loyalty program ID' },
  { displayName: 'Account ID', name: 'accountId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['loyalty'], operation: ['getAccount', 'accumulatePoints', 'adjustPoints', 'createReward'] } }, description: 'Loyalty account ID' },
  { displayName: 'Reward ID', name: 'rewardId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['loyalty'], operation: ['deleteReward', 'redeemReward'] } }, description: 'Loyalty reward ID' },
  { displayName: 'Mapping Type', name: 'mappingType', type: 'options', required: true, options: [{ name: 'Customer ID', value: 'CUSTOMER_ID' }, { name: 'Phone Number', value: 'PHONE_NUMBER' }], default: 'CUSTOMER_ID', displayOptions: { show: { resource: ['loyalty'], operation: ['createAccount'] } }, description: 'Mapping type' },
  { displayName: 'Mapping Value', name: 'mappingValue', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['loyalty'], operation: ['createAccount'] } }, description: 'Customer ID or phone number' },
  { displayName: 'Return All', name: 'returnAll', type: 'boolean', default: false, displayOptions: { show: { resource: ['loyalty'], operation: ['searchAccounts'] } }, description: 'Return all results' },
  { displayName: 'Limit', name: 'limit', type: 'number', default: 50, displayOptions: { show: { resource: ['loyalty'], operation: ['searchAccounts'], returnAll: [false] } }, typeOptions: { minValue: 1, maxValue: 200 }, description: 'Max results' },
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: { show: { resource: ['loyalty'], operation: ['searchAccounts'] } },
    options: [
      { displayName: 'Customer IDs', name: 'customerIds', type: 'string', default: '', description: 'Comma-separated customer IDs' },
      { displayName: 'Phone Number', name: 'phoneNumber', type: 'string', default: '', description: 'Phone number' },
      { displayName: 'Program ID', name: 'programId', type: 'string', default: '', description: 'Loyalty program ID' },
    ],
  },
  { displayName: 'Location ID', name: 'locationId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['loyalty'], operation: ['accumulatePoints', 'redeemReward'] } }, description: 'Location ID' },
  { displayName: 'Accumulate Type', name: 'accumulateType', type: 'options', required: true, options: [{ name: 'From Order', value: 'ORDER' }, { name: 'Points Directly', value: 'POINTS' }], default: 'ORDER', displayOptions: { show: { resource: ['loyalty'], operation: ['accumulatePoints'] } }, description: 'How to accumulate' },
  { displayName: 'Order ID', name: 'orderId', type: 'string', default: '', displayOptions: { show: { resource: ['loyalty'], operation: ['accumulatePoints'], accumulateType: ['ORDER'] } }, description: 'Order ID' },
  { displayName: 'Points', name: 'points', type: 'number', default: 0, displayOptions: { show: { resource: ['loyalty'], operation: ['accumulatePoints', 'adjustPoints'], accumulateType: ['POINTS'] } }, description: 'Points to add' },
  { displayName: 'Points', name: 'adjustPoints', type: 'number', required: true, default: 0, displayOptions: { show: { resource: ['loyalty'], operation: ['adjustPoints'] } }, description: 'Points to add (positive) or subtract (negative)' },
  { displayName: 'Reason', name: 'reason', type: 'string', default: '', displayOptions: { show: { resource: ['loyalty'], operation: ['adjustPoints'] } }, description: 'Reason' },
  { displayName: 'Reward Tier ID', name: 'rewardTierId', type: 'string', required: true, default: '', displayOptions: { show: { resource: ['loyalty'], operation: ['createReward'] } }, description: 'Reward tier ID' },
];
