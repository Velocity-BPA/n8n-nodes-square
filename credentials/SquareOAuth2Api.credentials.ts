/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class SquareOAuth2Api implements ICredentialType {
  name = 'squareOAuth2Api';
  extends = ['oAuth2Api'];
  displayName = 'Square OAuth2 API';
  documentationUrl = 'https://developer.squareup.com/docs/oauth-api/overview';
  properties: INodeProperties[] = [
    {
      displayName: 'Environment',
      name: 'environment',
      type: 'options',
      options: [
        {
          name: 'Sandbox',
          value: 'sandbox',
        },
        {
          name: 'Production',
          value: 'production',
        },
      ],
      default: 'sandbox',
      description: 'The Square environment to connect to',
    },
    {
      displayName: 'Grant Type',
      name: 'grantType',
      type: 'hidden',
      default: 'authorizationCode',
    },
    {
      displayName: 'Authorization URL',
      name: 'authUrl',
      type: 'hidden',
      default:
        '={{$self.environment === "sandbox" ? "https://connect.squareupsandbox.com/oauth2/authorize" : "https://connect.squareup.com/oauth2/authorize"}}',
    },
    {
      displayName: 'Access Token URL',
      name: 'accessTokenUrl',
      type: 'hidden',
      default:
        '={{$self.environment === "sandbox" ? "https://connect.squareupsandbox.com/oauth2/token" : "https://connect.squareup.com/oauth2/token"}}',
    },
    {
      displayName: 'Scope',
      name: 'scope',
      type: 'hidden',
      default:
        'CUSTOMERS_READ CUSTOMERS_WRITE ITEMS_READ ITEMS_WRITE INVENTORY_READ INVENTORY_WRITE INVOICES_READ INVOICES_WRITE MERCHANT_PROFILE_READ ORDERS_READ ORDERS_WRITE PAYMENTS_READ PAYMENTS_WRITE SUBSCRIPTIONS_READ SUBSCRIPTIONS_WRITE TIMECARDS_READ TIMECARDS_WRITE APPOINTMENTS_READ APPOINTMENTS_WRITE LOYALTY_READ LOYALTY_WRITE GIFTCARDS_READ GIFTCARDS_WRITE',
    },
    {
      displayName: 'Auth URI Query Parameters',
      name: 'authQueryParameters',
      type: 'hidden',
      default: '',
    },
    {
      displayName: 'Authentication',
      name: 'authentication',
      type: 'hidden',
      default: 'body',
    },
  ];
}
