import { describe, it, expect } from 'vitest';
import {
  isValidEmail,
  isValidPhone,
  isValidQuantity,
  isValidPrice,
  isNotEmpty,
  hasMinLength,
  hasMaxLength,
  validateProduct,
  validateOrder,
  validateLogin,
  sanitizeString,
  isNonEmptyArray,
} from './validators';

describe('validators', () => {
  describe('isValidEmail', () => {
    it('should validate correct emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co')).toBe(true);
    });

    it('should reject invalid emails', () => {
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail(null)).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('should validate 10-digit Colombian phones', () => {
      expect(isValidPhone('3001234567')).toBe(true);
      expect(isValidPhone('300-123-4567')).toBe(true);
    });

    it('should reject invalid phones', () => {
      expect(isValidPhone('123')).toBe(false);
      expect(isValidPhone('abc')).toBe(false);
      expect(isValidPhone('')).toBe(false);
      expect(isValidPhone(null)).toBe(false);
    });
  });

  describe('isValidQuantity', () => {
    it('should validate positive integers', () => {
      expect(isValidQuantity(1)).toBe(true);
      expect(isValidQuantity(5)).toBe(true);
    });

    it('should reject invalid quantities', () => {
      expect(isValidQuantity(0)).toBe(false);
      expect(isValidQuantity(-1)).toBe(false);
      expect(isValidQuantity(1.5)).toBe(false);
      expect(isValidQuantity(NaN)).toBe(false);
      expect(isValidQuantity('5')).toBe(false);
    });

    it('should reject quantities over limit', () => {
      expect(isValidQuantity(1000)).toBe(false);
    });
  });

  describe('isValidPrice', () => {
    it('should validate non-negative numbers', () => {
      expect(isValidPrice(0)).toBe(true);
      expect(isValidPrice(100)).toBe(true);
      expect(isValidPrice(99.99)).toBe(true);
    });

    it('should reject invalid prices', () => {
      expect(isValidPrice(-1)).toBe(false);
      expect(isValidPrice(NaN)).toBe(false);
      expect(isValidPrice('100')).toBe(false);
    });
  });

  describe('isNotEmpty', () => {
    it('should validate non-empty strings', () => {
      expect(isNotEmpty('text')).toBe(true);
      expect(isNotEmpty('  text  ')).toBe(true);
    });

    it('should reject empty strings', () => {
      expect(isNotEmpty('')).toBe(false);
      expect(isNotEmpty('   ')).toBe(false);
      expect(isNotEmpty(null)).toBe(false);
    });
  });

  describe('hasMinLength', () => {
    it('should validate minimum length', () => {
      expect(hasMinLength('test', 3)).toBe(true);
      expect(hasMinLength('test', 4)).toBe(true);
    });

    it('should reject strings too short', () => {
      expect(hasMinLength('ab', 3)).toBe(false);
      expect(hasMinLength('   ', 3)).toBe(false);
    });
  });

  describe('hasMaxLength', () => {
    it('should validate maximum length', () => {
      expect(hasMaxLength('test', 10)).toBe(true);
      expect(hasMaxLength('test', 4)).toBe(true);
    });

    it('should reject strings too long', () => {
      expect(hasMaxLength('very long text', 5)).toBe(false);
    });
  });

  describe('validateProduct', () => {
    it('should validate correct product', () => {
      const product = {
        name: 'Cafe Americano',
        price: 2500,
        categoryId: 'cat-1',
      };
      const result = validateProduct(product);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject product without name', () => {
      const product = { price: 2500, categoryId: 'cat-1' };
      const result = validateProduct(product);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('El nombre del producto es requerido');
    });

    it('should reject product with invalid price', () => {
      const product = { name: 'Test', price: -1, categoryId: 'cat-1' };
      const result = validateProduct(product);
      expect(result.valid).toBe(false);
    });

    it('should reject product without category', () => {
      const product = { name: 'Test', price: 100 };
      const result = validateProduct(product);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('La categoría es requerida');
    });

    it('should reject null product', () => {
      const result = validateProduct(null);
      expect(result.valid).toBe(false);
    });
  });

  describe('validateOrder', () => {
    it('should validate correct order', () => {
      const order = {
        tableId: 'table-1',
        items: [{ productId: 'p1', quantity: 2 }],
        totalAmount: 5000,
      };
      const result = validateOrder(order);
      expect(result.valid).toBe(true);
    });

    it('should reject order without items', () => {
      const order = { tableId: 'table-1', items: [] };
      const result = validateOrder(order);
      expect(result.valid).toBe(false);
    });

    it('should reject order without tableId', () => {
      const order = { items: [{ productId: 'p1', quantity: 2 }] };
      const result = validateOrder(order);
      expect(result.valid).toBe(false);
    });

    it('should reject order below minimum amount', () => {
      const order = {
        tableId: 'table-1',
        items: [{ productId: 'p1', quantity: 1 }],
        totalAmount: 100,
      };
      const result = validateOrder(order);
      expect(result.valid).toBe(false);
    });

    it('should reject null order', () => {
      const result = validateOrder(null);
      expect(result.valid).toBe(false);
    });
  });

  describe('validateLogin', () => {
    it('should validate correct credentials', () => {
      const result = validateLogin('admin', 'password123');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject empty username', () => {
      const result = validateLogin('', 'password');
      expect(result.valid).toBe(false);
    });

    it('should reject empty password', () => {
      const result = validateLogin('admin', '');
      expect(result.valid).toBe(false);
    });

    it('should reject short password', () => {
      const result = validateLogin('admin', '123');
      expect(result.valid).toBe(false);
    });
  });

  describe('sanitizeString', () => {
    it('should remove dangerous characters', () => {
      expect(sanitizeString('<script>alert("xss")</script>')).not.toContain('<');
      expect(sanitizeString('<script>alert("xss")</script>')).not.toContain('>');
    });

    it('should trim whitespace', () => {
      expect(sanitizeString('  text  ')).toBe('text');
    });

    it('should limit length', () => {
      const longText = 'a'.repeat(2000);
      expect(sanitizeString(longText).length).toBe(1000);
    });

    it('should handle invalid inputs', () => {
      expect(sanitizeString(null)).toBe('');
      expect(sanitizeString(undefined)).toBe('');
    });
  });

  describe('isNonEmptyArray', () => {
    it('should validate non-empty arrays', () => {
      expect(isNonEmptyArray([1])).toBe(true);
      expect(isNonEmptyArray(['a', 'b'])).toBe(true);
    });

    it('should reject empty or invalid arrays', () => {
      expect(isNonEmptyArray([])).toBe(false);
      expect(isNonEmptyArray(null)).toBe(false);
      expect(isNonEmptyArray('not array')).toBe(false);
    });
  });
});
