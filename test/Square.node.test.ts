/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Square } from '../nodes/Square/Square.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('Square Node', () => {
  let node: Square;

  beforeAll(() => {
    node = new Square();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Square');
      expect(node.description.name).toBe('square');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 7 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(7);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(7);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Payment Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        accessToken: 'test-token',
        baseUrl: 'https://connect.squareup.com',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  it('should create payment successfully', async () => {
    const mockResponse = { payment: { id: 'payment123', status: 'COMPLETED' } };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createPayment')
      .mockReturnValueOnce('source123')
      .mockReturnValueOnce(1000)
      .mockReturnValueOnce('USD')
      .mockReturnValueOnce('location123');

    const result = await executePaymentOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://connect.squareup.com/v2/payments',
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json',
        'Square-Version': '2023-10-18',
      },
      json: true,
      body: expect.objectContaining({
        source_id: 'source123',
        amount_money: { amount: 1000, currency: 'USD' },
        location_id: 'location123',
      }),
    });
  });

  it('should handle createPayment error', async () => {
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('createPayment');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executePaymentOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
  });

  it('should get payment successfully', async () => {
    const mockResponse = { payment: { id: 'payment123', status: 'COMPLETED' } };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getPayment')
      .mockReturnValueOnce('payment123');

    const result = await executePaymentOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should list payments successfully', async () => {
    const mockResponse = { payments: [{ id: 'payment123' }] };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('listPayments')
      .mockReturnValueOnce('location123')
      .mockReturnValueOnce('2023-01-01T00:00:00Z')
      .mockReturnValueOnce('2023-12-31T23:59:59Z')
      .mockReturnValueOnce(50);

    const result = await executePaymentOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should create refund successfully', async () => {
    const mockResponse = { refund: { id: 'refund123', status: 'COMPLETED' } };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createRefund')
      .mockReturnValueOnce('payment123')
      .mockReturnValueOnce(500)
      .mockReturnValueOnce('USD')
      .mockReturnValueOnce('Customer request');

    const result = await executePaymentOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should get refund successfully', async () => {
    const mockResponse = { refund: { id: 'refund123', status: 'COMPLETED' } };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getRefund')
      .mockReturnValueOnce('refund123');

    const result = await executePaymentOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });

  it('should list refunds successfully', async () => {
    const mockResponse = { refunds: [{ id: 'refund123' }] };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('listRefunds')
      .mockReturnValueOnce('location123')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce(100);

    const result = await executePaymentOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
  });
});

describe('Customer Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        accessToken: 'test-access-token', 
        baseUrl: 'https://connect.squareup.com/v2' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  it('should create a customer successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createCustomer')
      .mockReturnValueOnce('John')
      .mockReturnValueOnce('Doe')
      .mockReturnValueOnce('john.doe@example.com')
      .mockReturnValueOnce('+1234567890');

    const mockResponse = {
      customer: {
        id: 'CUST123',
        given_name: 'John',
        family_name: 'Doe',
        email_address: 'john.doe@example.com'
      }
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeCustomerOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: mockResponse,
      pairedItem: { item: 0 }
    }]);
  });

  it('should get a customer successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getCustomer')
      .mockReturnValueOnce('CUST123');

    const mockResponse = {
      customer: {
        id: 'CUST123',
        given_name: 'John',
        family_name: 'Doe'
      }
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeCustomerOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: mockResponse,
      pairedItem: { item: 0 }
    }]);
  });

  it('should list customers successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('listCustomers')
      .mockReturnValueOnce('')
      .mockReturnValueOnce(10)
      .mockReturnValueOnce('DEFAULT')
      .mockReturnValueOnce('ASC');

    const mockResponse = {
      customers: [
        { id: 'CUST1', given_name: 'John' },
        { id: 'CUST2', given_name: 'Jane' }
      ]
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeCustomerOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: mockResponse,
      pairedItem: { item: 0 }
    }]);
  });

  it('should update a customer successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('updateCustomer')
      .mockReturnValueOnce('CUST123')
      .mockReturnValueOnce('John')
      .mockReturnValueOnce('Smith')
      .mockReturnValueOnce('john.smith@example.com');

    const mockResponse = {
      customer: {
        id: 'CUST123',
        given_name: 'John',
        family_name: 'Smith',
        email_address: 'john.smith@example.com'
      }
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeCustomerOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: mockResponse,
      pairedItem: { item: 0 }
    }]);
  });

  it('should delete a customer successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('deleteCustomer')
      .mockReturnValueOnce('CUST123');

    const mockResponse = {};

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeCustomerOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: mockResponse,
      pairedItem: { item: 0 }
    }]);
  });

  it('should create a customer card successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createCustomerCard')
      .mockReturnValueOnce('CUST123')
      .mockReturnValueOnce('cnon:card-nonce-ok');

    const mockResponse = {
      card: {
        id: 'CARD123',
        card_brand: 'VISA',
        last_4: '1111'
      }
    };

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeCustomerOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: mockResponse,
      pairedItem: { item: 0 }
    }]);
  });

  it('should delete a customer card successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('deleteCustomerCard')
      .mockReturnValueOnce('CUST123')
      .mockReturnValueOnce('CARD123');

    const mockResponse = {};

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeCustomerOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: mockResponse,
      pairedItem: { item: 0 }
    }]);
  });

  it('should handle API errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getCustomer');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

    const result = await executeCustomerOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: { error: 'API Error' },
      pairedItem: { item: 0 }
    }]);
  });

  it('should throw error for unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('unknownOperation');

    await expect(executeCustomerOperations.call(mockExecuteFunctions, [{ json: {} }]))
      .rejects.toThrow('Unknown operation: unknownOperation');
  });
});

describe('Order Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        accessToken: 'test-token',
        environment: 'sandbox'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  it('should create order successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'createOrder';
        case 'locationId': return 'test-location-id';
        case 'lineItems': return [{ name: 'Test Item', quantity: '1' }];
        case 'taxes': return [];
        case 'discounts': return [];
        default: return undefined;
      }
    });

    const mockResponse = { order: { id: 'order-123', state: 'OPEN' } };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: mockResponse,
      pairedItem: { item: 0 }
    }]);
  });

  it('should get order successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getOrder';
        case 'orderId': return 'order-123';
        default: return undefined;
      }
    });

    const mockResponse = { order: { id: 'order-123', state: 'OPEN' } };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: mockResponse,
      pairedItem: { item: 0 }
    }]);
  });

  it('should handle errors gracefully when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getOrder';
        case 'orderId': return 'invalid-order';
        default: return undefined;
      }
    });

    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Order not found'));

    const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: { error: 'Order not found' },
      pairedItem: { item: 0 }
    }]);
  });

  it('should search orders with filters', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'searchOrders';
        case 'locationIds': return 'loc-1,loc-2';
        case 'query': return { filter: { state_filter: { states: ['OPEN'] } } };
        case 'limit': return 50;
        case 'cursor': return '';
        default: return undefined;
      }
    });

    const mockResponse = { orders: [{ id: 'order-123' }] };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: mockResponse,
      pairedItem: { item: 0 }
    }]);
  });

  it('should update order successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'updateOrder';
        case 'orderId': return 'order-123';
        case 'version': return 2;
        case 'lineItems': return [{ name: 'Updated Item', quantity: '2' }];
        default: return undefined;
      }
    });

    const mockResponse = { order: { id: 'order-123', version: 3 } };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: mockResponse,
      pairedItem: { item: 0 }
    }]);
  });

  it('should pay order successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'payOrder';
        case 'orderId': return 'order-123';
        case 'paymentIds': return 'payment-1,payment-2';
        default: return undefined;
      }
    });

    const mockResponse = { order: { id: 'order-123', state: 'COMPLETED' } };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: mockResponse,
      pairedItem: { item: 0 }
    }]);
  });

  it('should calculate order successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'calculateOrder';
        case 'orderId': return 'order-123';
        case 'proposedRewards': return [];
        default: return undefined;
      }
    });

    const mockResponse = { order: { id: 'order-123', total_money: { amount: 1000 } } };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeOrderOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: mockResponse,
      pairedItem: { item: 0 }
    }]);
  });
});

describe('CatalogItem Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				accessToken: 'test-token',
				environment: 'sandbox',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('createCatalogObject operation', () => {
		it('should create a catalog item successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createCatalogObject')
				.mockReturnValueOnce('ITEM')
				.mockReturnValueOnce('{"name": "Test Item"}');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				object: { id: 'test-id', type: 'ITEM' },
			});

			const result = await executeCatalogItemOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json.object.id).toBe('test-id');
		});

		it('should handle create catalog object errors', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createCatalogObject')
				.mockReturnValueOnce('ITEM')
				.mockReturnValueOnce('{"name": "Test Item"}');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeCatalogItemOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json.error).toBe('API Error');
		});
	});

	describe('getCatalogObject operation', () => {
		it('should get a catalog object successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getCatalogObject')
				.mockReturnValueOnce('test-object-id')
				.mockReturnValueOnce(false);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				object: { id: 'test-object-id', type: 'ITEM' },
			});

			const result = await executeCatalogItemOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json.object.id).toBe('test-object-id');
		});
	});

	describe('listCatalog operation', () => {
		it('should list catalog objects successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('listCatalog')
				.mockReturnValueOnce('')
				.mockReturnValueOnce(['ITEM'])
				.mockReturnValueOnce(0);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				objects: [{ id: 'item-1', type: 'ITEM' }],
			});

			const result = await executeCatalogItemOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json.objects).toHaveLength(1);
		});
	});

	describe('updateCatalogObject operation', () => {
		it('should update a catalog object successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('updateCatalogObject')
				.mockReturnValueOnce('test-object-id')
				.mockReturnValueOnce(1)
				.mockReturnValueOnce('{"name": "Updated Item"}');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				object: { id: 'test-object-id', version: 2 },
			});

			const result = await executeCatalogItemOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json.object.version).toBe(2);
		});
	});

	describe('deleteCatalogObject operation', () => {
		it('should delete a catalog object successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('deleteCatalogObject')
				.mockReturnValueOnce('test-object-id');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				deleted_object_ids: ['test-object-id'],
			});

			const result = await executeCatalogItemOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json.deleted_object_ids).toContain('test-object-id');
		});
	});

	describe('searchCatalogObjects operation', () => {
		it('should search catalog objects successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('searchCatalogObjects')
				.mockReturnValueOnce(['ITEM'])
				.mockReturnValueOnce('test query')
				.mockReturnValueOnce(10);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				objects: [{ id: 'found-item', type: 'ITEM' }],
			});

			const result = await executeCatalogItemOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json.objects).toHaveLength(1);
		});
	});
});

describe('Inventory Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        accessToken: 'test-token', 
        baseUrl: 'https://connect.squareup.com' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('getInventoryChanges operation', () => {
    it('should retrieve inventory changes successfully', async () => {
      const mockResponse = {
        changes: [
          {
            type: 'ADJUSTMENT',
            adjustment: {
              catalog_object_id: 'test-id',
              location_id: 'location-1',
              quantity: '10'
            }
          }
        ]
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getInventoryChanges')
        .mockReturnValueOnce('location-1')
        .mockReturnValueOnce('catalog-1')
        .mockReturnValueOnce('2023-01-01T00:00:00Z');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeInventoryOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: mockResponse,
        pairedItem: { item: 0 }
      }]);
      
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://connect.squareup.com/v2/inventory/changes/batch-retrieve',
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json',
          'Square-Version': '2023-10-18'
        },
        json: true,
        body: {
          location_ids: ['location-1'],
          catalog_object_ids: ['catalog-1'],
          updated_after: '2023-01-01T00:00:00Z'
        }
      });
    });

    it('should handle getInventoryChanges errors', async () => {
      mockExecuteFunctions.getNodeParameter.mockReturnValue('getInventoryChanges');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeInventoryOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{
        json: { error: 'API Error' },
        pairedItem: { item: 0 }
      }]);
    });
  });

  describe('getInventoryCounts operation', () => {
    it('should retrieve inventory counts successfully', async () => {
      const mockResponse = {
        counts: [
          {
            catalog_object_id: 'test-id',
            location_id: 'location-1',
            quantity: '5',
            state: 'IN_STOCK'
          }
        ]
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getInventoryCounts')
        .mockReturnValueOnce('location-1')
        .mockReturnValueOnce('catalog-1')
        .mockReturnValueOnce(['IN_STOCK']);

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeInventoryCounts.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json).toEqual(mockResponse);
    });
  });

  describe('createInventoryAdjustments operation', () => {
    it('should create inventory adjustments successfully', async () => {
      const mockResponse = { changes: [] };
      const adjustmentsJson = JSON.stringify([{
        catalog_object_id: 'test-id',
        from_state: 'IN_STOCK',
        to_state: 'SOLD',
        location_id: 'location-1',
        quantity: '2',
        occurred_at: '2023-01-01T00:00:00Z'
      }]);

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createInventoryAdjustments')
        .mockReturnValueOnce(adjustmentsJson)
        .mockReturnValueOnce(false);

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeInventoryOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json).toEqual(mockResponse);
    });

    it('should handle invalid JSON in adjustments', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createInventoryAdjustments')
        .mockReturnValueOnce('invalid json');

      await expect(executeInventoryOperations.call(mockExecuteFunctions, [{ json: {} }]))
        .rejects.toThrow('Invalid JSON in adjustments');
    });
  });

  describe('createPhysicalCounts operation', () => {
    it('should create physical counts successfully', async () => {
      const mockResponse = { changes: [] };
      const physicalCountsJson = JSON.stringify([{
        catalog_object_id: 'test-id',
        state: 'IN_STOCK',
        location_id: 'location-1',
        quantity: '15',
        occurred_at: '2023-01-01T00:00:00Z'
      }]);

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createPhysicalCounts')
        .mockReturnValueOnce(physicalCountsJson)
        .mockReturnValueOnce(true);

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeInventoryOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result[0].json).toEqual(mockResponse);
    });
  });
});

describe('Invoice Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        accessToken: 'test-access-token',
        baseUrl: 'https://connect.squareup.com/v2',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
      },
    };
  });

  describe('createInvoice operation', () => {
    it('should create an invoice successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createInvoice')
        .mockReturnValueOnce('location-123')
        .mockReturnValueOnce({ recipient: { given_name: 'John' } });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        invoice: { id: 'inv_123', status: 'DRAFT' },
      });

      const result = await executeInvoiceOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual({
        invoice: { id: 'inv_123', status: 'DRAFT' },
      });
    });

    it('should handle createInvoice errors', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createInvoice')
        .mockReturnValueOnce('location-123')
        .mockReturnValueOnce({});

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
        new Error('Invalid request')
      );

      await expect(
        executeInvoiceOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('Invalid request');
    });
  });

  describe('getInvoice operation', () => {
    it('should retrieve an invoice successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getInvoice')
        .mockReturnValueOnce('inv_123');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        invoice: { id: 'inv_123', status: 'SENT' },
      });

      const result = await executeInvoiceOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual({
        invoice: { id: 'inv_123', status: 'SENT' },
      });
    });
  });

  describe('searchInvoices operation', () => {
    it('should search invoices successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('searchInvoices')
        .mockReturnValueOnce({ filter: { location_ids: ['location-123'] } })
        .mockReturnValueOnce(50)
        .mockReturnValueOnce('');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        invoices: [{ id: 'inv_123' }],
      });

      const result = await executeInvoiceOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual({
        invoices: [{ id: 'inv_123' }],
      });
    });
  });

  describe('updateInvoice operation', () => {
    it('should update an invoice successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('updateInvoice')
        .mockReturnValueOnce('inv_123')
        .mockReturnValueOnce(1)
        .mockReturnValueOnce({ description: 'Updated invoice' });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        invoice: { id: 'inv_123', version: 2 },
      });

      const result = await executeInvoiceOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual({
        invoice: { id: 'inv_123', version: 2 },
      });
    });
  });

  describe('sendInvoice operation', () => {
    it('should send an invoice successfully', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('sendInvoice')
        .mockReturnValueOnce('inv_123')
        .mockReturnValueOnce('EMAIL')
        .mockReturnValueOnce(1);

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
        invoice: { id: 'inv_123', status: 'SENT' },
      });

      const result = await executeInvoiceOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual({
        invoice: { id: 'inv_123', status: 'SENT' },
      });
    });
  });
});

describe('Location Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				accessToken: 'test-token',
				baseUrl: 'https://connect.squareup.com/v2',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('listLocations operation', () => {
		it('should list all locations successfully', async () => {
			const mockResponse = {
				locations: [
					{
						id: 'location-1',
						name: 'Main Store',
						status: 'ACTIVE',
					},
				],
			};

			mockExecuteFunctions.getNodeParameter.mockReturnValue('listLocations');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeLocationOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://connect.squareup.com/v2/locations',
				headers: {
					Authorization: 'Bearer test-token',
					'Square-Version': '2024-07-17',
					'Content-Type': 'application/json',
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});

		it('should handle listLocations error', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('listLocations');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeLocationOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('getLocation operation', () => {
		it('should get specific location successfully', async () => {
			const mockResponse = {
				location: {
					id: 'location-1',
					name: 'Main Store',
					status: 'ACTIVE',
				},
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getLocation')
				.mockReturnValueOnce('location-1');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeLocationOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://connect.squareup.com/v2/locations/location-1',
				headers: {
					Authorization: 'Bearer test-token',
					'Square-Version': '2024-07-17',
					'Content-Type': 'application/json',
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});

	describe('updateLocation operation', () => {
		it('should update location successfully', async () => {
			const mockResponse = {
				location: {
					id: 'location-1',
					name: 'Updated Store',
					status: 'ACTIVE',
				},
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('updateLocation')
				.mockReturnValueOnce('location-1')
				.mockReturnValueOnce('Updated Store')
				.mockReturnValueOnce({
					addressDetails: {
						address_line_1: '123 Main St',
						locality: 'New York',
					},
				})
				.mockReturnValueOnce('America/New_York');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeLocationOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'PUT',
				url: 'https://connect.squareup.com/v2/locations/location-1',
				headers: {
					Authorization: 'Bearer test-token',
					'Square-Version': '2024-07-17',
					'Content-Type': 'application/json',
				},
				body: {
					location: {
						name: 'Updated Store',
						address: {
							address_line_1: '123 Main St',
							locality: 'New York',
						},
						timezone: 'America/New_York',
					},
				},
				json: true,
			});
			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
		});
	});
});
});
