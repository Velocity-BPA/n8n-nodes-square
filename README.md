# n8n-nodes-square

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for Square SMB payments and point-of-sale platform. Provides complete access to Square's API ecosystem including payments, orders, customers, catalog management, inventory, invoices, subscriptions, loyalty programs, gift cards, team management, and bookings.

![n8n](https://img.shields.io/badge/n8n-community--node-green)
![Square API](https://img.shields.io/badge/Square-API%20v2024--11--20-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3+-blue)

## Features

- **13 Resource Categories** with 75+ operations
- **25+ Webhook Event Types** for real-time triggers
- **Dual Authentication**: Personal Access Token and OAuth 2.0
- **Environment Support**: Sandbox and Production
- **Full Pagination Support** for large result sets
- **Idempotency Support** for safe retries
- **Comprehensive Error Handling**

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install**
4. Enter `n8n-nodes-square`
5. Click **Install**

### Manual Installation

```bash
# In your n8n installation directory
npm install n8n-nodes-square
```

### Development Installation

```bash
# Clone or extract the package
cd n8n-nodes-square

# Install dependencies
npm install

# Build the project
npm run build

# Link to n8n
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-square

# Restart n8n
n8n start
```

## Credentials Setup

### Personal Access Token (Recommended for Development)

| Field | Description |
|-------|-------------|
| Environment | `Sandbox` or `Production` |
| Access Token | Your Square Personal Access Token |

Get your token from the [Square Developer Dashboard](https://developer.squareup.com/apps).

### OAuth 2.0 (Recommended for Production)

| Field | Description |
|-------|-------------|
| Environment | `Sandbox` or `Production` |
| Client ID | Your Square Application ID |
| Client Secret | Your Square Application Secret |

Configure the OAuth callback URL in your Square application settings.

## Resources & Operations

### Payments
- **Create** - Process a new payment
- **Get** - Retrieve payment details
- **Get Many** - List payments with filters
- **Update** - Modify tip amount
- **Cancel** - Cancel a pending payment
- **Complete** - Complete an authorized payment

### Refunds
- **Create** - Issue a refund
- **Get** - Retrieve refund details
- **Get Many** - List refunds with filters

### Orders
- **Create** - Create a new order
- **Get** - Retrieve order details
- **Search** - Search orders with filters
- **Update** - Modify an order
- **Pay** - Pay for an order
- **Calculate** - Preview order pricing
- **Clone** - Duplicate an order

### Customers
- **Create** - Add a new customer
- **Get** - Retrieve customer details
- **Get Many** - List all customers
- **Search** - Search customers
- **Update** - Modify customer info
- **Delete** - Remove a customer
- **Add Card** - Save card on file
- **Delete Card** - Remove saved card

### Catalog
- **List** - List catalog objects
- **Get** - Retrieve catalog object
- **Search** - Search catalog
- **Upsert** - Create or update object
- **Delete** - Remove catalog object
- **Batch Retrieve** - Get multiple objects
- **Batch Delete** - Remove multiple objects
- **Batch Upsert** - Create/update multiple
- **Update Item Modifier Lists** - Manage modifiers
- **Update Item Taxes** - Manage tax assignments

### Inventory
- **Get Count** - Get inventory count
- **Batch Retrieve Counts** - Get multiple counts
- **Batch Retrieve Changes** - Get change history
- **Batch Change** - Apply inventory adjustments

### Invoices
- **Create** - Create an invoice
- **Get** - Retrieve invoice
- **Get Many** - List invoices
- **Search** - Search invoices
- **Update** - Modify invoice
- **Delete** - Remove draft invoice
- **Publish** - Send invoice to customer
- **Cancel** - Cancel published invoice

### Subscriptions
- **Create** - Start a subscription
- **Get** - Retrieve subscription
- **Search** - Search subscriptions
- **Update** - Modify subscription
- **Cancel** - End subscription
- **Pause** - Temporarily pause
- **Resume** - Resume paused subscription

### Locations
- **Create** - Add a location
- **Get** - Retrieve location
- **Get Many** - List all locations
- **Update** - Modify location

### Loyalty
- **Create Account** - Create loyalty account
- **Get Account** - Retrieve account details
- **Get Program** - Get program details
- **Search Accounts** - Search loyalty accounts
- **Accumulate Points** - Add points
- **Adjust Points** - Adjust point balance
- **Redeem Reward** - Use a reward

### Gift Cards
- **Create** - Create a gift card
- **Get** - Retrieve gift card
- **Get From GAN** - Get by account number
- **Get From Nonce** - Get from payment nonce
- **Link Customer** - Associate customer
- **Unlink Customer** - Remove association
- **List Activities** - View card history

### Team
- **Create Member** - Add team member
- **Get Member** - Retrieve member
- **Search Members** - Search team
- **Update Member** - Modify member
- **Get Wage Setting** - View wages
- **Update Wage Setting** - Modify wages

### Bookings
- **Create** - Schedule appointment
- **Get** - Retrieve booking
- **Get Many** - List bookings
- **Update** - Modify booking
- **Cancel** - Cancel appointment
- **Search Availability** - Find open slots

## Trigger Node

The Square Trigger node receives real-time webhook events:

### Event Categories
- **Bookings**: created, updated
- **Cards**: created, disabled, forgotten, auto-updated
- **Catalog**: version updated
- **Customers**: created, updated, deleted
- **Gift Cards**: created, updated, activity events
- **Inventory**: count updated
- **Invoices**: created, published, paid, refunded, canceled
- **Locations**: created, updated
- **Loyalty**: account/program/promotion events
- **Orders**: created, updated, fulfillment updated
- **Payments**: created, completed, updated
- **Refunds**: created, updated
- **Subscriptions**: created, updated
- **Team Members**: created, updated, wage setting updated

## Usage Examples

### Create a Payment

```javascript
// Input
{
  "sourceId": "cnon:card-nonce-ok", // Card nonce from Web Payments SDK
  "amount": 25.00,
  "currency": "USD",
  "additionalFields": {
    "note": "Coffee order",
    "customerId": "CUSTOMER_ID"
  }
}
```

### Search Orders

```javascript
// Input
{
  "locationIds": "LOCATION_ID",
  "filters": {
    "states": ["OPEN", "COMPLETED"],
    "sortField": "CREATED_AT",
    "sortOrder": "DESC"
  }
}
```

### Create a Catalog Item

```javascript
// Object Data (JSON)
{
  "name": "Coffee",
  "description": "Fresh brewed coffee",
  "variations": [
    {
      "type": "ITEM_VARIATION",
      "id": "#small",
      "item_variation_data": {
        "name": "Small",
        "pricing_type": "FIXED_PRICING",
        "price_money": {
          "amount": 350,
          "currency": "USD"
        }
      }
    }
  ]
}
```

## Sandbox Testing

Use these test values in Square Sandbox:

| Card Nonce | Result |
|------------|--------|
| `cnon:card-nonce-ok` | Successful payment |
| `cnon:card-nonce-declined` | Declined |
| `cnon:card-nonce-rejected-cvv` | CVV failure |

## Error Handling

The node provides detailed error messages from the Square API. Common errors:

- **INVALID_REQUEST_ERROR** - Invalid parameters
- **AUTHENTICATION_ERROR** - Invalid/expired credentials
- **NOT_FOUND** - Resource doesn't exist
- **RATE_LIMITED** - Too many requests

## Security Best Practices

1. **Use OAuth 2.0** for production deployments
2. **Store credentials securely** using n8n's credential system
3. **Use Sandbox** for testing before production
4. **Enable webhook signature verification** for trigger nodes
5. **Implement idempotency** for payment operations

## Development

```bash
# Install dependencies
npm install

# Run linting
npm run lint

# Run tests
npm test

# Build
npm run build

# Type check
npm run typecheck
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
Use of this node within any SaaS, PaaS, hosted platform, managed service,
or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Submit a pull request

## Support

- [Square API Documentation](https://developer.squareup.com/docs)
- [n8n Community Forum](https://community.n8n.io)
- [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-square/issues)

## Acknowledgments

- [Square](https://squareup.com) for their comprehensive API
- [n8n](https://n8n.io) for the workflow automation platform
- The n8n community for feedback and contributions
