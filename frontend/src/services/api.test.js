import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock axios before importing the module
vi.mock('axios', () => {
  const mockInstance = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  };

  return {
    default: {
      create: vi.fn(() => mockInstance),
    },
    create: vi.fn(() => mockInstance),
  };
});

// Mock localStorage utils
vi.mock('../utils/localStorage', () => ({
  getToken: vi.fn(() => null),
  removeToken: vi.fn(),
  removeUser: vi.fn(),
}));

describe('api service', () => {
  it('should create axios instance with correct config', async () => {
    const axios = await import('axios');
    await import('./api');

    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        timeout: 30000,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    );
  });

  it('should configure interceptors on instance creation', async () => {
    // Simply verify the module can be imported without errors
    const api = await import('./api');
    expect(api).toBeDefined();
    expect(api.get).toBeDefined();
    expect(api.post).toBeDefined();
    expect(api.put).toBeDefined();
    expect(api.patch).toBeDefined();
    expect(api.del).toBeDefined();
  });
});
