import { expect, afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock console methods to reduce noise
global.console = {
  ...console,
  error: vi.fn(),
  warn: vi.fn(),
};

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Clear localStorage before each test
beforeEach(() => {
  localStorage.clear();
});
