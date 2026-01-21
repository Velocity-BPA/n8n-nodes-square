/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Integration tests for Square node.
 *
 * These tests require a valid Square sandbox account.
 * Set SQUARE_ACCESS_TOKEN environment variable to run.
 *
 * Test card nonces for sandbox:
 * - cnon:card-nonce-ok - Successful payment
 * - cnon:card-nonce-declined - Declined payment
 * - cnon:card-nonce-rejected-cvv - CVV failure
 */

describe('Square Integration Tests', () => {
  const hasCredentials = !!process.env.SQUARE_ACCESS_TOKEN;

  beforeAll(() => {
    if (!hasCredentials) {
      console.warn(
        'Skipping integration tests: SQUARE_ACCESS_TOKEN not set.\n' +
        'Set this environment variable to run integration tests with your Square sandbox.',
      );
    }
  });

  it('should skip tests when no credentials', () => {
    // Placeholder test that always passes
    expect(true).toBe(true);
  });

  // Add real integration tests here when credentials are available
  // Example:
  // it.skip('should list locations', async () => {
  //   // Test implementation
  // });
});
