/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  toMoney,
  fromMoney,
  generateIdempotencyKey,
  parseStringList,
  removeEmptyFields,
} from '../../nodes/Square/utils/helpers';

describe('Square Helpers', () => {
  describe('toMoney', () => {
    it('should convert dollar amount to cents', () => {
      const result = toMoney(10.50, 'USD');
      expect(result).toEqual({
        amount: 1050,
        currency: 'USD',
      });
    });

    it('should handle zero amount', () => {
      const result = toMoney(0, 'USD');
      expect(result).toEqual({
        amount: 0,
        currency: 'USD',
      });
    });

    it('should uppercase currency code', () => {
      const result = toMoney(5, 'usd');
      expect(result).toEqual({
        amount: 500,
        currency: 'USD',
      });
    });

    it('should round to nearest cent', () => {
      const result = toMoney(10.555, 'USD');
      expect(result).toEqual({
        amount: 1056,
        currency: 'USD',
      });
    });
  });

  describe('fromMoney', () => {
    it('should convert cents to dollars', () => {
      const result = fromMoney({ amount: 1050, currency: 'USD' });
      expect(result).toBe(10.50);
    });

    it('should handle undefined', () => {
      const result = fromMoney(undefined);
      expect(result).toBe(0);
    });

    it('should handle missing amount', () => {
      const result = fromMoney({ currency: 'USD' });
      expect(result).toBe(0);
    });
  });

  describe('generateIdempotencyKey', () => {
    it('should generate unique keys', () => {
      const key1 = generateIdempotencyKey();
      const key2 = generateIdempotencyKey();
      expect(key1).not.toBe(key2);
    });

    it('should include timestamp', () => {
      const key = generateIdempotencyKey();
      const parts = key.split('-');
      const timestamp = parseInt(parts[0], 10);
      expect(timestamp).toBeGreaterThan(0);
    });
  });

  describe('parseStringList', () => {
    it('should parse comma-separated string', () => {
      const result = parseStringList('a, b, c');
      expect(result).toEqual(['a', 'b', 'c']);
    });

    it('should handle empty string', () => {
      const result = parseStringList('');
      expect(result).toEqual([]);
    });

    it('should trim whitespace', () => {
      const result = parseStringList('  item1  ,  item2  ');
      expect(result).toEqual(['item1', 'item2']);
    });

    it('should filter out empty items', () => {
      const result = parseStringList('a,,b,');
      expect(result).toEqual(['a', 'b']);
    });
  });

  describe('removeEmptyFields', () => {
    it('should remove null and undefined fields', () => {
      const result = removeEmptyFields({
        name: 'test',
        value: null,
        other: undefined,
      });
      expect(result).toEqual({ name: 'test' });
    });

    it('should remove empty strings', () => {
      const result = removeEmptyFields({
        name: 'test',
        empty: '',
      });
      expect(result).toEqual({ name: 'test' });
    });

    it('should preserve zero values', () => {
      const result = removeEmptyFields({
        name: 'test',
        count: 0,
      });
      expect(result).toEqual({ name: 'test', count: 0 });
    });

    it('should handle nested objects', () => {
      const result = removeEmptyFields({
        name: 'test',
        nested: {
          value: 'nested',
          empty: '',
        },
      });
      expect(result).toEqual({
        name: 'test',
        nested: { value: 'nested' },
      });
    });
  });
});
