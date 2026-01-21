/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { INodeProperties } from 'n8n-workflow';

export const bookingOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['booking'],
      },
    },
    options: [
      {
        name: 'Cancel',
        value: 'cancel',
        description: 'Cancel a booking',
        action: 'Cancel a booking',
      },
      {
        name: 'Create',
        value: 'create',
        description: 'Create a booking',
        action: 'Create a booking',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a booking by ID',
        action: 'Get a booking',
      },
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Get many bookings',
        action: 'Get many bookings',
      },
      {
        name: 'Search Availability',
        value: 'searchAvailability',
        description: 'Search for available appointment slots',
        action: 'Search availability',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a booking',
        action: 'Update a booking',
      },
    ],
    default: 'getMany',
  },
];

export const bookingFields: INodeProperties[] = [
  // ----------------------------------
  //         booking: create
  // ----------------------------------
  {
    displayName: 'Location ID',
    name: 'locationId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['booking'],
        operation: ['create'],
      },
    },
    description: 'The ID of the location for the booking',
  },
  {
    displayName: 'Start At',
    name: 'startAt',
    type: 'dateTime',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['booking'],
        operation: ['create'],
      },
    },
    description: 'The start time of the booking',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['booking'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Customer ID',
        name: 'customerId',
        type: 'string',
        default: '',
        description: 'The ID of the customer',
      },
      {
        displayName: 'Customer Note',
        name: 'customerNote',
        type: 'string',
        default: '',
        description: 'A note from the customer',
      },
      {
        displayName: 'Duration Minutes',
        name: 'durationMinutes',
        type: 'number',
        default: 60,
        description: 'Duration of the appointment in minutes',
      },
      {
        displayName: 'Seller Note',
        name: 'sellerNote',
        type: 'string',
        default: '',
        description: 'A note from the seller',
      },
      {
        displayName: 'Service Variation ID',
        name: 'serviceVariationId',
        type: 'string',
        default: '',
        description: 'The ID of the service variation',
      },
      {
        displayName: 'Team Member ID',
        name: 'teamMemberId',
        type: 'string',
        default: '',
        description: 'The ID of the team member',
      },
    ],
  },

  // ----------------------------------
  //         booking: get/update/cancel
  // ----------------------------------
  {
    displayName: 'Booking ID',
    name: 'bookingId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['booking'],
        operation: ['get', 'update', 'cancel'],
      },
    },
    description: 'The ID of the booking',
  },

  // ----------------------------------
  //         booking: getMany
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['booking'],
        operation: ['getMany'],
      },
    },
    description: 'Whether to return all results',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    default: 50,
    displayOptions: {
      show: {
        resource: ['booking'],
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
        resource: ['booking'],
        operation: ['getMany', 'searchAvailability'],
      },
    },
    options: [
      {
        displayName: 'Location ID',
        name: 'locationId',
        type: 'string',
        default: '',
        description: 'Filter by location ID',
      },
      {
        displayName: 'Segment Filters (JSON)',
        name: 'segmentFilters',
        type: 'json',
        default: '[]',
        description: 'Segment filters for availability search',
      },
      {
        displayName: 'Start At Max',
        name: 'startAtMax',
        type: 'dateTime',
        default: '',
        description: 'Maximum start time',
      },
      {
        displayName: 'Start At Min',
        name: 'startAtMin',
        type: 'dateTime',
        default: '',
        description: 'Minimum start time',
      },
      {
        displayName: 'Team Member ID',
        name: 'teamMemberId',
        type: 'string',
        default: '',
        description: 'Filter by team member ID',
      },
    ],
  },

  // ----------------------------------
  //         booking: searchAvailability
  // ----------------------------------
  {
    displayName: 'Start At Min',
    name: 'startAtMin',
    type: 'dateTime',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['booking'],
        operation: ['searchAvailability'],
      },
    },
    description: 'The start of the availability window',
  },
  {
    displayName: 'Start At Max',
    name: 'startAtMax',
    type: 'dateTime',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['booking'],
        operation: ['searchAvailability'],
      },
    },
    description: 'The end of the availability window',
  },

  // ----------------------------------
  //         booking: update
  // ----------------------------------
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['booking'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Customer Note',
        name: 'customerNote',
        type: 'string',
        default: '',
        description: 'A note from the customer',
      },
      {
        displayName: 'Seller Note',
        name: 'sellerNote',
        type: 'string',
        default: '',
        description: 'A note from the seller',
      },
      {
        displayName: 'Start At',
        name: 'startAt',
        type: 'dateTime',
        default: '',
        description: 'New start time',
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
  //         booking: cancel
  // ----------------------------------
  {
    displayName: 'Cancel Options',
    name: 'cancelOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['booking'],
        operation: ['cancel'],
      },
    },
    options: [
      {
        displayName: 'Booking Version',
        name: 'bookingVersion',
        type: 'number',
        default: 0,
        description: 'The version of the booking',
      },
    ],
  },
];
