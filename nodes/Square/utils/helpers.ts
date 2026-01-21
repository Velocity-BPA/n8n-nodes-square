/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  IExecuteFunctions,
  IHookFunctions,
  ILoadOptionsFunctions,
  IHttpRequestMethods,
  IHttpRequestOptions,
  IDataObject,
  NodeApiError,
} from 'n8n-workflow';

/**
 * Licensing notice tracker
 */
let licenseNoticeEmitted = false;

/**
 * Emit licensing notice once per node load
 */
export function emitLicenseNotice(context: IExecuteFunctions | IHookFunctions): void {
  if (!licenseNoticeEmitted) {
    context.logger?.warn(`[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.`);
    licenseNoticeEmitted = true;
  }
}

/**
 * Get the Square API base URL based on environment
 */
export function getBaseUrl(credentials: IDataObject): string {
  const environment = credentials.environment as string;
  return environment === 'production'
    ? 'https://connect.squareup.com'
    : 'https://connect.squareupsandbox.com';
}

/**
 * Make an authenticated request to the Square API
 */
export async function squareApiRequest(
  this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  body: IDataObject = {},
  query: IDataObject = {},
  uri?: string,
): Promise<any> {
  const credentials = await this.getCredentials('squareApi');
  const baseUrl = getBaseUrl(credentials);

  const options: IHttpRequestOptions = {
    method,
    url: uri || `${baseUrl}${endpoint}`,
    headers: {
      Authorization: `Bearer ${credentials.accessToken}`,
      'Square-Version': '2024-11-20',
      'Content-Type': 'application/json',
    },
    body,
    qs: query,
    json: true,
  };

  if (Object.keys(body).length === 0) {
    delete options.body;
  }

  if (Object.keys(query).length === 0) {
    delete options.qs;
  }

  try {
    const response = await this.helpers.httpRequest(options);
    return response;
  } catch (error: any) {
    throw new NodeApiError(this.getNode(), error, {
      message: error.message,
      description: error.description,
    });
  }
}

/**
 * Make a paginated request to the Square API
 */
export async function squareApiRequestAllItems(
  this: IExecuteFunctions | IHookFunctions | ILoadOptionsFunctions,
  method: IHttpRequestMethods,
  endpoint: string,
  propertyName: string,
  body: IDataObject = {},
  query: IDataObject = {},
): Promise<any[]> {
  const returnData: any[] = [];
  let responseData: any;
  let cursor: string | undefined;

  do {
    if (cursor) {
      if (method === 'POST') {
        body.cursor = cursor;
      } else {
        query.cursor = cursor;
      }
    }

    responseData = await squareApiRequest.call(this, method, endpoint, body, query);

    if (responseData[propertyName]) {
      returnData.push(...responseData[propertyName]);
    }

    cursor = responseData.cursor;
  } while (cursor);

  return returnData;
}

/**
 * Convert amount to Money object (cents)
 */
export function toMoney(amount: number, currency: string): IDataObject {
  return {
    amount: Math.round(amount * 100),
    currency: currency.toUpperCase(),
  };
}

/**
 * Convert Money object to decimal amount
 */
export function fromMoney(money: IDataObject | undefined): number {
  if (!money || typeof money.amount !== 'number') {
    return 0;
  }
  return money.amount / 100;
}

/**
 * Generate a unique idempotency key
 */
export function generateIdempotencyKey(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Format date to RFC 3339 format
 */
export function toRfc3339(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString();
}

/**
 * Remove empty fields from an object
 */
export function removeEmptyFields(obj: IDataObject): IDataObject {
  const result: IDataObject = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null && value !== '') {
      if (typeof value === 'object' && !Array.isArray(value)) {
        const nested = removeEmptyFields(value as IDataObject);
        if (Object.keys(nested).length > 0) {
          result[key] = nested;
        }
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}

/**
 * Parse a comma-separated string into an array
 */
export function parseStringList(input: string): string[] {
  if (!input) return [];
  return input
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

/**
 * Build address object from flat fields
 */
export function buildAddress(fields: IDataObject, prefix: string = 'address'): IDataObject | null {
  const address: IDataObject = {};

  if (fields[`${prefix}Line1`]) address.address_line_1 = fields[`${prefix}Line1`];
  if (fields[`${prefix}Line2`]) address.address_line_2 = fields[`${prefix}Line2`];
  if (fields[`${prefix}City`]) address.locality = fields[`${prefix}City`];
  if (fields[`${prefix}State`]) address.administrative_district_level_1 = fields[`${prefix}State`];
  if (fields[`${prefix}PostalCode`]) address.postal_code = fields[`${prefix}PostalCode`];
  if (fields[`${prefix}Country`]) address.country = fields[`${prefix}Country`];

  return Object.keys(address).length > 0 ? address : null;
}
