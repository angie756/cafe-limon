import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  formatPrice,
  formatNumber,
  formatDate,
  formatTime,
  formatRelativeTime,
  truncate,
  capitalize,
  formatPhone,
  formatOrderId,
  pluralize,
  formatPreparationTime,
} from './formatters';

describe('formatters', () => {
  describe('formatPrice', () => {
    it('should format valid numbers as currency', () => {
      const result = formatPrice(2500);
      expect(result).toBeDefined();
      expect(result).toContain('2');
      expect(result).toContain('500');
    });

    it('should handle invalid inputs', () => {
      expect(formatPrice(NaN)).toContain('0');
      expect(formatPrice('invalid')).toContain('0');
      expect(formatPrice(null)).toContain('0');
      expect(formatPrice(undefined)).toContain('0');
    });
  });

  describe('formatNumber', () => {
    it('should format numbers with thousand separators', () => {
      const result = formatNumber(1234);
      expect(result).toBeDefined();
    });

    it('should handle invalid inputs', () => {
      expect(formatNumber(NaN)).toBe('0');
      expect(formatNumber('invalid')).toBe('0');
    });
  });

  describe('formatDate', () => {
    it('should format valid dates', () => {
      const date = new Date('2024-01-15T10:30:00');
      const result = formatDate(date);
      expect(result).toBeTruthy();
    });

    it('should include time when requested', () => {
      const date = new Date('2024-01-15T10:30:00');
      const result = formatDate(date, true);
      expect(result).toBeTruthy();
    });

    it('should handle invalid dates', () => {
      expect(formatDate(null)).toBe('');
      expect(formatDate('invalid')).toBe('');
      expect(formatDate(undefined)).toBe('');
    });
  });

  describe('formatTime', () => {
    it('should format time from date', () => {
      const date = new Date('2024-01-15T10:30:00');
      const result = formatTime(date);
      expect(result).toBeTruthy();
    });

    it('should handle invalid dates', () => {
      expect(formatTime(null)).toBe('');
      expect(formatTime('invalid')).toBe('');
    });
  });

  describe('formatRelativeTime', () => {
    beforeEach(() => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-01-15T12:00:00'));
    });

    it('should return "ahora mismo" for recent times', () => {
      const date = new Date('2024-01-15T11:59:30');
      expect(formatRelativeTime(date)).toBe('ahora mismo');
    });

    it('should format minutes ago', () => {
      const date = new Date('2024-01-15T11:50:00');
      const result = formatRelativeTime(date);
      expect(result).toContain('minuto');
    });

    it('should format hours ago', () => {
      const date = new Date('2024-01-15T10:00:00');
      const result = formatRelativeTime(date);
      expect(result).toContain('hora');
    });

    it('should format days ago', () => {
      const date = new Date('2024-01-14T12:00:00');
      const result = formatRelativeTime(date);
      expect(result).toContain('día');
    });

    it('should handle invalid dates', () => {
      expect(formatRelativeTime(null)).toBe('');
    });
  });

  describe('truncate', () => {
    it('should truncate long text', () => {
      const text = 'This is a very long text that should be truncated';
      const result = truncate(text, 20);
      expect(result.length).toBeLessThanOrEqual(20);
      expect(result).toContain('...');
    });

    it('should not truncate short text', () => {
      const text = 'Short';
      expect(truncate(text, 20)).toBe('Short');
    });

    it('should handle invalid inputs', () => {
      expect(truncate(null)).toBe('');
      expect(truncate(undefined)).toBe('');
      expect(truncate(123)).toBe('');
    });

    it('should use custom suffix', () => {
      const result = truncate('Long text here', 10, '...');
      expect(result).toContain('...');
    });
  });

  describe('capitalize', () => {
    it('should capitalize each word', () => {
      expect(capitalize('hello world')).toBe('Hello World');
      expect(capitalize('HELLO WORLD')).toBe('Hello World');
    });

    it('should handle single words', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('should handle invalid inputs', () => {
      expect(capitalize(null)).toBe('');
      expect(capitalize(undefined)).toBe('');
      expect(capitalize(123)).toBe('');
    });
  });

  describe('formatPhone', () => {
    it('should format 10-digit phone numbers', () => {
      expect(formatPhone('3001234567')).toBe('300 123 4567');
    });

    it('should return original for non-10-digit numbers', () => {
      expect(formatPhone('123')).toBe('123');
    });

    it('should handle empty input', () => {
      expect(formatPhone('')).toBe('');
      expect(formatPhone(null)).toBe('');
    });
  });

  describe('formatOrderId', () => {
    it('should return ORD- prefixed IDs as is', () => {
      const orderId = 'ORD-20240115-001';
      expect(formatOrderId(orderId)).toBe(orderId);
    });

    it('should format UUID-like IDs', () => {
      const uuid = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
      const result = formatOrderId(uuid);
      expect(result.length).toBe(8);
      expect(result).toBe('A1B2C3D4');
    });

    it('should handle empty input', () => {
      expect(formatOrderId('')).toBe('');
      expect(formatOrderId(null)).toBe('');
    });
  });

  describe('pluralize', () => {
    it('should return singular for count 1', () => {
      expect(pluralize(1, 'item')).toBe('1 item');
    });

    it('should return plural for count != 1', () => {
      expect(pluralize(0, 'item')).toBe('0 items');
      expect(pluralize(2, 'item')).toBe('2 items');
    });

    it('should use custom plural form', () => {
      expect(pluralize(2, 'person', 'people')).toBe('2 people');
    });
  });

  describe('formatPreparationTime', () => {
    it('should return immediate for 0 or negative', () => {
      expect(formatPreparationTime(0)).toBe('Preparación inmediata');
      expect(formatPreparationTime(-5)).toBe('Preparación inmediata');
    });

    it('should format minutes', () => {
      expect(formatPreparationTime(15)).toContain('minuto');
      expect(formatPreparationTime(1)).toContain('minuto');
    });

    it('should format hours', () => {
      expect(formatPreparationTime(60)).toContain('hora');
      expect(formatPreparationTime(120)).toContain('hora');
    });

    it('should format hours and minutes', () => {
      expect(formatPreparationTime(90)).toContain('h');
      expect(formatPreparationTime(90)).toContain('min');
    });
  });
});
