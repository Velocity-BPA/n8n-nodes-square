/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  IHookFunctions,
  IWebhookFunctions,
  INodeType,
  INodeTypeDescription,
  IWebhookResponseData,
  IDataObject,
} from 'n8n-workflow';

import {
  squareApiRequest,
  generateIdempotencyKey,
  emitLicenseNotice,
} from './utils/helpers';

export class SquareTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Square Trigger',
    name: 'squareTrigger',
    icon: 'file:square.svg',
    group: ['trigger'],
    version: 1,
    subtitle: '={{$parameter["events"].join(", ")}}',
    description: 'Receive real-time events from Square via webhooks',
    defaults: {
      name: 'Square Trigger',
    },
    inputs: [],
    outputs: ['main'],
    credentials: [
      {
        name: 'squareApi',
        required: true,
      },
    ],
    webhooks: [
      {
        name: 'default',
        httpMethod: 'POST',
        responseMode: 'onReceived',
        path: 'webhook',
      },
    ],
    properties: [
      {
        displayName: 'Events',
        name: 'events',
        type: 'multiOptions',
        required: true,
        default: [],
        options: [
          // Booking Events
          {
            name: 'Booking Created',
            value: 'booking.created',
          },
          {
            name: 'Booking Updated',
            value: 'booking.updated',
          },
          // Card Events
          {
            name: 'Card Automatically Updated',
            value: 'card.automatically_updated',
          },
          {
            name: 'Card Created',
            value: 'card.created',
          },
          {
            name: 'Card Disabled',
            value: 'card.disabled',
          },
          {
            name: 'Card Forgotten',
            value: 'card.forgotten',
          },
          // Catalog Events
          {
            name: 'Catalog Version Updated',
            value: 'catalog.version.updated',
          },
          // Customer Events
          {
            name: 'Customer Created',
            value: 'customer.created',
          },
          {
            name: 'Customer Deleted',
            value: 'customer.deleted',
          },
          {
            name: 'Customer Updated',
            value: 'customer.updated',
          },
          // Gift Card Events
          {
            name: 'Gift Card Activity Created',
            value: 'gift_card.activity.created',
          },
          {
            name: 'Gift Card Activity Updated',
            value: 'gift_card.activity.updated',
          },
          {
            name: 'Gift Card Created',
            value: 'gift_card.created',
          },
          {
            name: 'Gift Card Customer Linked',
            value: 'gift_card.customer_linked',
          },
          {
            name: 'Gift Card Customer Unlinked',
            value: 'gift_card.customer_unlinked',
          },
          {
            name: 'Gift Card Updated',
            value: 'gift_card.updated',
          },
          // Inventory Events
          {
            name: 'Inventory Count Updated',
            value: 'inventory.count.updated',
          },
          // Invoice Events
          {
            name: 'Invoice Canceled',
            value: 'invoice.canceled',
          },
          {
            name: 'Invoice Created',
            value: 'invoice.created',
          },
          {
            name: 'Invoice Deleted',
            value: 'invoice.deleted',
          },
          {
            name: 'Invoice Payment Made',
            value: 'invoice.payment_made',
          },
          {
            name: 'Invoice Published',
            value: 'invoice.published',
          },
          {
            name: 'Invoice Refunded',
            value: 'invoice.refunded',
          },
          {
            name: 'Invoice Scheduled Charge Failed',
            value: 'invoice.scheduled_charge_failed',
          },
          {
            name: 'Invoice Updated',
            value: 'invoice.updated',
          },
          // Location Events
          {
            name: 'Location Created',
            value: 'location.created',
          },
          {
            name: 'Location Updated',
            value: 'location.updated',
          },
          // Loyalty Events
          {
            name: 'Loyalty Account Created',
            value: 'loyalty.account.created',
          },
          {
            name: 'Loyalty Account Deleted',
            value: 'loyalty.account.deleted',
          },
          {
            name: 'Loyalty Account Updated',
            value: 'loyalty.account.updated',
          },
          {
            name: 'Loyalty Event Created',
            value: 'loyalty.event.created',
          },
          {
            name: 'Loyalty Program Created',
            value: 'loyalty.program.created',
          },
          {
            name: 'Loyalty Program Updated',
            value: 'loyalty.program.updated',
          },
          {
            name: 'Loyalty Promotion Created',
            value: 'loyalty.promotion.created',
          },
          {
            name: 'Loyalty Promotion Updated',
            value: 'loyalty.promotion.updated',
          },
          // Order Events
          {
            name: 'Order Created',
            value: 'order.created',
          },
          {
            name: 'Order Fulfillment Updated',
            value: 'order.fulfillment.updated',
          },
          {
            name: 'Order Updated',
            value: 'order.updated',
          },
          // Payment Events
          {
            name: 'Payment Completed',
            value: 'payment.completed',
          },
          {
            name: 'Payment Created',
            value: 'payment.created',
          },
          {
            name: 'Payment Updated',
            value: 'payment.updated',
          },
          // Refund Events
          {
            name: 'Refund Created',
            value: 'refund.created',
          },
          {
            name: 'Refund Updated',
            value: 'refund.updated',
          },
          // Subscription Events
          {
            name: 'Subscription Created',
            value: 'subscription.created',
          },
          {
            name: 'Subscription Updated',
            value: 'subscription.updated',
          },
          // Team Member Events
          {
            name: 'Team Member Created',
            value: 'team_member.created',
          },
          {
            name: 'Team Member Updated',
            value: 'team_member.updated',
          },
          {
            name: 'Team Member Wage Setting Updated',
            value: 'team_member.wage_setting.updated',
          },
        ],
        description: 'The Square events to subscribe to',
      },
      {
        displayName: 'Webhook Name',
        name: 'webhookName',
        type: 'string',
        default: 'n8n Webhook',
        description: 'A name for this webhook subscription in Square',
      },
    ],
  };

  webhookMethods = {
    default: {
      async checkExists(this: IHookFunctions): Promise<boolean> {
        const webhookUrl = this.getNodeWebhookUrl('default');
        const webhookData = this.getWorkflowStaticData('node');

        // Check if we have a stored subscription ID
        if (webhookData.webhookId) {
          try {
            const response = await squareApiRequest.call(
              this,
              'GET',
              `/v2/webhooks/subscriptions/${webhookData.webhookId}`,
            );

            if (response.subscription && response.subscription.notification_url === webhookUrl) {
              return true;
            }
          } catch (error) {
            // Subscription doesn't exist or was deleted
            delete webhookData.webhookId;
          }
        }

        return false;
      },

      async create(this: IHookFunctions): Promise<boolean> {
        emitLicenseNotice(this);

        const webhookUrl = this.getNodeWebhookUrl('default');
        const events = this.getNodeParameter('events') as string[];
        const webhookName = this.getNodeParameter('webhookName') as string;
        const webhookData = this.getWorkflowStaticData('node');

        const body: IDataObject = {
          idempotency_key: generateIdempotencyKey(),
          subscription: {
            name: webhookName,
            enabled: true,
            event_types: events,
            notification_url: webhookUrl,
          },
        };

        const response = await squareApiRequest.call(
          this,
          'POST',
          '/v2/webhooks/subscriptions',
          body,
        );

        if (response.subscription && response.subscription.id) {
          webhookData.webhookId = response.subscription.id;
          webhookData.signatureKey = response.subscription.signature_key;
          return true;
        }

        return false;
      },

      async delete(this: IHookFunctions): Promise<boolean> {
        const webhookData = this.getWorkflowStaticData('node');

        if (webhookData.webhookId) {
          try {
            await squareApiRequest.call(
              this,
              'DELETE',
              `/v2/webhooks/subscriptions/${webhookData.webhookId}`,
            );
          } catch (error) {
            // Ignore errors during deletion
          }

          delete webhookData.webhookId;
          delete webhookData.signatureKey;
        }

        return true;
      },
    },
  };

  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    const bodyData = this.getBodyData() as IDataObject;
    const headerData = this.getHeaderData() as IDataObject;
    const events = this.getNodeParameter('events') as string[];

    // Get the event type from the webhook payload
    const eventType = bodyData.type as string;

    // Check if this event type is one we're subscribed to
    if (!events.includes(eventType)) {
      // Return empty if this event type isn't in our subscription list
      return {
        workflowData: [[]],
      };
    }

    // Add metadata to the response
    const data: IDataObject = {
      ...bodyData,
      _webhookEventType: eventType,
      _webhookTimestamp: headerData['x-square-hmacsha256-signature'] ? new Date().toISOString() : undefined,
    };

    return {
      workflowData: [this.helpers.returnJsonArray([data])],
    };
  }
}
