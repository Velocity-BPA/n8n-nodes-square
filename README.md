# n8n-nodes-square

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

An n8n community node for Square that enables seamless automation of payment processing, customer management, and inventory operations. This node provides access to 7 core Square resources including Payments, Customers, Orders, Catalog Items, Inventory, Invoices, and Locations with comprehensive CRUD operations and Square-specific functionality.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Square API](https://img.shields.io/badge/Square-API%20Compatible-green)
![Payment Processing](https://img.shields.io/badge/Payment-Processing-orange)
![E-commerce](https://img.shields.io/badge/E--commerce-Ready-purple)

## Features

- **Payment Processing** - Create, retrieve, and manage Square payments with full transaction support
- **Customer Management** - Complete customer lifecycle management with profiles, preferences, and history
- **Order Operations** - Handle order creation, updates, fulfillment, and tracking across all Square channels
- **Catalog Management** - Manage product catalogs, pricing, variations, and item configurations
- **Inventory Control** - Real-time inventory tracking, adjustments, and stock level monitoring
- **Invoice Automation** - Create, send, and manage invoices with automated payment collection
- **Location Services** - Multi-location support for businesses with multiple Square locations
- **Webhook Support** - Handle Square webhooks for real-time event processing and automation

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-square`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-square
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-square.git
cd n8n-nodes-square
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-square
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Square application's API access token from Square Developer Dashboard | Yes |
| Environment | Select 'Sandbox' for testing or 'Production' for live transactions | Yes |
| Application ID | Your Square application ID for certain operations | No |

## Resources & Operations

### 1. Payment

| Operation | Description |
|-----------|-------------|
| Create | Process a new payment transaction |
| Get | Retrieve payment details by payment ID |
| List | Get all payments with optional filtering |
| Update | Modify payment information or add tips |
| Cancel | Cancel a pending payment |
| Complete | Complete a delayed capture payment |

### 2. Customer

| Operation | Description |
|-----------|-------------|
| Create | Add a new customer to your Square database |
| Get | Retrieve customer details by customer ID |
| List | Get all customers with search and filtering options |
| Update | Modify customer information and preferences |
| Delete | Remove a customer from your database |
| Search | Find customers by name, email, or phone number |

### 3. Order

| Operation | Description |
|-----------|-------------|
| Create | Create a new order with line items and modifiers |
| Get | Retrieve order details by order ID |
| List | Get all orders with date range and status filtering |
| Update | Modify order items, quantities, or fulfillment details |
| Cancel | Cancel an existing order |
| Pay | Process payment for an order |
| Calculate | Calculate order totals including taxes and discounts |

### 4. CatalogItem

| Operation | Description |
|-----------|-------------|
| Create | Add new items to your catalog |
| Get | Retrieve catalog item details by item ID |
| List | Get all catalog items with category filtering |
| Update | Modify item details, pricing, or availability |
| Delete | Remove items from your catalog |
| Search | Find catalog items by name or category |
| Batch | Perform bulk operations on multiple catalog items |

### 5. Inventory

| Operation | Description |
|-----------|-------------|
| Get | Retrieve current inventory counts for items |
| List | Get inventory levels across all locations |
| Adjust | Make inventory adjustments for stock corrections |
| Track | Enable or disable inventory tracking for items |
| Count | Perform inventory counts and reconciliation |
| Transfer | Transfer inventory between locations |

### 6. Invoice

| Operation | Description |
|-----------|-------------|
| Create | Generate a new invoice for customers |
| Get | Retrieve invoice details by invoice ID |
| List | Get all invoices with status and date filtering |
| Update | Modify invoice details before sending |
| Send | Send invoice to customer via email |
| Cancel | Cancel a pending invoice |
| Publish | Publish a draft invoice |

### 7. Location

| Operation | Description |
|-----------|-------------|
| Get | Retrieve location details by location ID |
| List | Get all business locations |
| Update | Modify location information and settings |

## Usage Examples

```javascript
// Process a payment
{
  "amount_money": {
    "amount": 1000,
    "currency": "USD"
  },
  "source_id": "card_token_from_square_js",
  "autocomplete": true,
  "location_id": "LOCATION_ID",
  "reference_id": "order_123"
}
```

```javascript
// Create a customer
{
  "given_name": "John",
  "family_name": "Doe",
  "email_address": "john.doe@example.com",
  "phone_number": "+1-555-123-4567",
  "company_name": "Acme Corp",
  "note": "VIP customer"
}
```

```javascript
// Create an order
{
  "location_id": "LOCATION_ID",
  "line_items": [
    {
      "quantity": "2",
      "catalog_object_id": "CATALOG_ITEM_ID",
      "modifiers": [
        {
          "catalog_object_id": "MODIFIER_ID"
        }
      ]
    }
  ],
  "taxes": [
    {
      "catalog_object_id": "TAX_ID"
    }
  ]
}
```

```javascript
// Adjust inventory
{
  "location_id": "LOCATION_ID",
  "catalog_object_id": "CATALOG_ITEM_ID",
  "from_state": "IN_STOCK",
  "to_state": "IN_STOCK",
  "quantity": "10",
  "occurred_at": "2023-12-01T10:00:00Z"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| UNAUTHORIZED | Invalid or expired API key | Verify API credentials and token permissions |
| NOT_FOUND | Resource ID doesn't exist | Check that the payment/customer/order ID is correct |
| VALIDATION_ERROR | Required fields missing or invalid | Review request body for missing or malformed data |
| RATE_LIMITED | Too many API requests | Implement retry logic with exponential backoff |
| PAYMENT_DECLINED | Credit card transaction failed | Handle decline reasons and prompt for different payment method |
| INSUFFICIENT_PERMISSIONS | API key lacks required permissions | Ensure API key has necessary scopes in Square Developer Dashboard |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-square/issues)
- **Square API Documentation**: [Square Developer Docs](https://developer.squareup.com/docs)
- **Square Developer Community**: [Square Developer Community](https://developer.squareup.com/community)