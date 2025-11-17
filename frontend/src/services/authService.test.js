import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  login,
  logout,
  isAuthenticated,
  getCurrentUser,
  hasRole,
  isAdmin,
  isKitchen,
  getProfile,
  updateProfile,
  changePassword,
  refreshToken,
  verifyToken,
} from './authService';
import * as api from './api';
import * as localStorage from '../utils/localStorage';

// Mock API functions
vi.mock('./api', () => ({
  post: vi.fn(),
  get: vi.fn(),
}));

// Mock localStorage utils
vi.mock('../utils/localStorage', () => ({
  getToken: vi.fn(),
  saveToken: vi.fn(),
  removeToken: vi.fn(),
  getUser: vi.fn(),
  saveUser: vi.fn(),
  removeUser: vi.fn(),
}));

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully and save token and user', async () => {
      const loginData = {
        token: 'jwt-token-123',
        id: 'user-1',
        username: 'admin',
        email: 'admin@cafe.com',
        role: 'ADMIN',
      };

      api.post.mockResolvedValue(loginData);

      const result = await login({ username: 'admin', password: 'password' });

      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        username: 'admin',
        password: 'password',
      });
      expect(localStorage.saveToken).toHaveBeenCalledWith('jwt-token-123');
      expect(localStorage.saveUser).toHaveBeenCalledWith({
        id: 'user-1',
        username: 'admin',
        email: 'admin@cafe.com',
        role: 'ADMIN',
      });
      expect(result).toEqual({
        token: 'jwt-token-123',
        user: {
          id: 'user-1',
          username: 'admin',
          email: 'admin@cafe.com',
          role: 'ADMIN',
        },
      });
    });

    it('should handle login without token', async () => {
      const loginData = {
        id: 'user-1',
        username: 'admin',
        email: 'admin@cafe.com',
        role: 'ADMIN',
      };

      api.post.mockResolvedValue(loginData);

      await login({ username: 'admin', password: 'password' });

      expect(localStorage.saveToken).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      api.post.mockResolvedValue({});

      await logout();

      expect(api.post).toHaveBeenCalledWith('/auth/logout');
      expect(localStorage.removeToken).toHaveBeenCalled();
      expect(localStorage.removeUser).toHaveBeenCalled();
    });

    it('should clear local data even if server call fails', async () => {
      api.post.mockRejectedValue(new Error('Server error'));

      await logout();

      expect(localStorage.removeToken).toHaveBeenCalled();
      expect(localStorage.removeUser).toHaveBeenCalled();
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token exists', () => {
      localStorage.getToken.mockReturnValue('token-123');

      expect(isAuthenticated()).toBe(true);
    });

    it('should return false when no token', () => {
      localStorage.getToken.mockReturnValue(null);

      expect(isAuthenticated()).toBe(false);
    });
  });

  describe('getCurrentUser', () => {
    it('should return user from localStorage', () => {
      const user = { id: '1', username: 'admin', role: 'ADMIN' };
      localStorage.getUser.mockReturnValue(user);

      expect(getCurrentUser()).toEqual(user);
    });

    it('should return null when no user', () => {
      localStorage.getUser.mockReturnValue(null);

      expect(getCurrentUser()).toBeNull();
    });
  });

  describe('hasRole', () => {
    it('should return true when user has the role', () => {
      localStorage.getUser.mockReturnValue({ role: 'ADMIN' });

      expect(hasRole('ADMIN')).toBe(true);
    });

    it('should return false when user has different role', () => {
      localStorage.getUser.mockReturnValue({ role: 'KITCHEN' });

      expect(hasRole('ADMIN')).toBe(false);
    });

    it('should return false when no user', () => {
      localStorage.getUser.mockReturnValue(null);

      expect(hasRole('ADMIN')).toBeFalsy();
    });
  });

  describe('isAdmin', () => {
    it('should return true for admin user', () => {
      localStorage.getUser.mockReturnValue({ role: 'ADMIN' });

      expect(isAdmin()).toBe(true);
    });

    it('should return false for non-admin user', () => {
      localStorage.getUser.mockReturnValue({ role: 'KITCHEN' });

      expect(isAdmin()).toBe(false);
    });
  });

  describe('isKitchen', () => {
    it('should return true for kitchen user', () => {
      localStorage.getUser.mockReturnValue({ role: 'KITCHEN' });

      expect(isKitchen()).toBe(true);
    });

    it('should return false for non-kitchen user', () => {
      localStorage.getUser.mockReturnValue({ role: 'ADMIN' });

      expect(isKitchen()).toBe(false);
    });
  });

  describe('getProfile', () => {
    it('should fetch and save user profile', async () => {
      const user = {
        id: 'user-1',
        username: 'admin',
        email: 'admin@cafe.com',
        role: 'ADMIN',
      };

      api.get.mockResolvedValue(user);

      const result = await getProfile();

      expect(api.get).toHaveBeenCalledWith('/auth/profile');
      expect(localStorage.saveUser).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });
  });

  describe('updateProfile', () => {
    it('should update and save user profile', async () => {
      const updatedUser = {
        id: 'user-1',
        username: 'admin',
        email: 'newemail@cafe.com',
        role: 'ADMIN',
      };

      api.post.mockResolvedValue(updatedUser);

      const result = await updateProfile({ email: 'newemail@cafe.com' });

      expect(api.post).toHaveBeenCalledWith('/auth/profile', {
        email: 'newemail@cafe.com',
      });
      expect(localStorage.saveUser).toHaveBeenCalledWith(updatedUser);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      api.post.mockResolvedValue({});

      const passwordData = {
        currentPassword: 'old123',
        newPassword: 'new456',
      };

      await changePassword(passwordData);

      expect(api.post).toHaveBeenCalledWith('/auth/change-password', passwordData);
    });
  });

  describe('refreshToken', () => {
    it('should refresh token and save it', async () => {
      const tokenData = { token: 'new-token-123' };

      api.post.mockResolvedValue(tokenData);

      const result = await refreshToken();

      expect(api.post).toHaveBeenCalledWith('/auth/refresh');
      expect(localStorage.saveToken).toHaveBeenCalledWith('new-token-123');
      expect(result).toEqual(tokenData);
    });

    it('should handle refresh without token', async () => {
      api.post.mockResolvedValue({});

      await refreshToken();

      expect(localStorage.saveToken).not.toHaveBeenCalled();
    });
  });

  describe('verifyToken', () => {
    it('should return true for valid token', async () => {
      api.get.mockResolvedValue({});

      const result = await verifyToken();

      expect(api.get).toHaveBeenCalledWith('/auth/verify');
      expect(result).toBe(true);
    });

    it('should return false and clear data for invalid token', async () => {
      api.get.mockRejectedValue(new Error('Invalid token'));

      const result = await verifyToken();

      expect(localStorage.removeToken).toHaveBeenCalled();
      expect(localStorage.removeUser).toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });
});
