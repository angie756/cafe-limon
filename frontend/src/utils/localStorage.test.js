import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  setItem,
  getItem,
  removeItem,
  clear,
  hasItem,
  saveCart,
  getCart,
  clearCart,
  saveToken,
  getToken,
  removeToken,
  saveUser,
  getUser,
  removeUser,
  savePreferences,
  getPreferences,
  saveRecentOrders,
  getRecentOrders,
  clearSession,
} from './localStorage';

describe('localStorage utils', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('setItem', () => {
    it('should save value to localStorage', () => {
      const result = setItem('test', { data: 'value' });
      expect(result).toBe(true);
      expect(localStorage.getItem('test')).toBeTruthy();
    });

    it('should handle errors gracefully', () => {
      const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage full');
      });
      const result = setItem('test', 'value');
      expect(result).toBe(false);
      spy.mockRestore();
    });
  });

  describe('getItem', () => {
    it('should retrieve value from localStorage', () => {
      localStorage.setItem('test', JSON.stringify({ data: 'value' }));
      const result = getItem('test');
      expect(result).toEqual({ data: 'value' });
    });

    it('should return default value if key does not exist', () => {
      const result = getItem('nonexistent', 'default');
      expect(result).toBe('default');
    });

    it('should handle parse errors', () => {
      localStorage.setItem('test', 'invalid json');
      const result = getItem('test', 'default');
      expect(result).toBe('default');
    });
  });

  describe('removeItem', () => {
    it('should remove item from localStorage', () => {
      localStorage.setItem('test', 'value');
      const result = removeItem('test');
      expect(result).toBe(true);
      expect(localStorage.getItem('test')).toBeNull();
    });
  });

  describe('clear', () => {
    it('should clear all localStorage', () => {
      localStorage.setItem('test1', 'value1');
      localStorage.setItem('test2', 'value2');
      const result = clear();
      expect(result).toBe(true);
      expect(localStorage.length).toBe(0);
    });
  });

  describe('hasItem', () => {
    it('should return true if item exists', () => {
      localStorage.setItem('test', 'value');
      expect(hasItem('test')).toBe(true);
    });

    it('should return false if item does not exist', () => {
      expect(hasItem('nonexistent')).toBe(false);
    });
  });

  describe('saveCart', () => {
    it('should save cart to localStorage', () => {
      const cart = [{ productId: 'p1', quantity: 2 }];
      saveCart(cart);
      expect(localStorage.getItem('cafe_limon_cart')).toBeTruthy();
    });
  });

  describe('getCart', () => {
    it('should retrieve cart from localStorage', () => {
      const cart = { items: [{ productId: 'p1' }], tableId: 'table-1' };
      localStorage.setItem('cafe_limon_cart', JSON.stringify(cart));
      const result = getCart();
      expect(result).toEqual(cart);
    });

    it('should return default cart if not exists', () => {
      const result = getCart();
      expect(result).toEqual({ items: [], tableId: null });
    });
  });

  describe('clearCart', () => {
    it('should remove cart from localStorage', () => {
      localStorage.setItem('cafe_limon_cart', '{}');
      clearCart();
      expect(localStorage.getItem('cafe_limon_cart')).toBeNull();
    });
  });

  describe('saveToken', () => {
    it('should save token to localStorage', () => {
      saveToken('jwt-token-123');
      expect(localStorage.getItem('cafe_limon_token')).toBeTruthy();
    });
  });

  describe('getToken', () => {
    it('should retrieve token from localStorage', () => {
      localStorage.setItem('cafe_limon_token', JSON.stringify('jwt-token-123'));
      const result = getToken();
      expect(result).toBe('jwt-token-123');
    });
  });

  describe('removeToken', () => {
    it('should remove token from localStorage', () => {
      localStorage.setItem('cafe_limon_token', 'jwt-token');
      removeToken();
      expect(localStorage.getItem('cafe_limon_token')).toBeNull();
    });
  });

  describe('saveUser', () => {
    it('should save user to localStorage', () => {
      const user = { id: '1', username: 'admin' };
      saveUser(user);
      expect(localStorage.getItem('cafe_limon_user')).toBeTruthy();
    });
  });

  describe('getUser', () => {
    it('should retrieve user from localStorage', () => {
      const user = { id: '1', username: 'admin' };
      localStorage.setItem('cafe_limon_user', JSON.stringify(user));
      const result = getUser();
      expect(result).toEqual(user);
    });
  });

  describe('removeUser', () => {
    it('should remove user from localStorage', () => {
      localStorage.setItem('cafe_limon_user', '{}');
      removeUser();
      expect(localStorage.getItem('cafe_limon_user')).toBeNull();
    });
  });

  describe('savePreferences', () => {
    it('should save preferences to localStorage', () => {
      const prefs = { theme: 'dark' };
      savePreferences(prefs);
      expect(localStorage.getItem('cafe_limon_preferences')).toBeTruthy();
    });
  });

  describe('getPreferences', () => {
    it('should retrieve preferences from localStorage', () => {
      const prefs = { theme: 'dark', notifications: false, sound: true };
      localStorage.setItem('cafe_limon_preferences', JSON.stringify(prefs));
      const result = getPreferences();
      expect(result).toEqual(prefs);
    });

    it('should return default preferences if not exists', () => {
      const result = getPreferences();
      expect(result).toHaveProperty('theme');
      expect(result).toHaveProperty('notifications');
    });
  });

  describe('saveRecentOrders', () => {
    it('should save recent orders to localStorage', () => {
      const orders = [{ id: '1' }, { id: '2' }];
      saveRecentOrders(orders);
      expect(localStorage.getItem('cafe_limon_recent_orders')).toBeTruthy();
    });

    it('should limit to 10 orders', () => {
      const orders = Array.from({ length: 15 }, (_, i) => ({ id: i }));
      saveRecentOrders(orders);
      const saved = JSON.parse(localStorage.getItem('cafe_limon_recent_orders'));
      expect(saved.length).toBe(10);
    });
  });

  describe('getRecentOrders', () => {
    it('should retrieve recent orders from localStorage', () => {
      const orders = [{ id: '1' }];
      localStorage.setItem('cafe_limon_recent_orders', JSON.stringify(orders));
      const result = getRecentOrders();
      expect(result).toEqual(orders);
    });

    it('should return empty array if not exists', () => {
      const result = getRecentOrders();
      expect(result).toEqual([]);
    });
  });

  describe('clearSession', () => {
    it('should clear all session data', () => {
      localStorage.setItem('cafe_limon_token', 'jwt');
      localStorage.setItem('cafe_limon_user', '{}');
      localStorage.setItem('cafe_limon_cart', '{}');
      clearSession();
      expect(localStorage.getItem('cafe_limon_token')).toBeNull();
      expect(localStorage.getItem('cafe_limon_user')).toBeNull();
      expect(localStorage.getItem('cafe_limon_cart')).toBeNull();
    });
  });
});
