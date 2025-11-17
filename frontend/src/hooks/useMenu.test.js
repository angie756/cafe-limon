import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useMenu } from './useMenu';
import * as menuService from '../services/menuService';
import toast from 'react-hot-toast';

// Mock menuService
vi.mock('../services/menuService');

// Mock toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('useMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useMenu());

    expect(result.current.menu).toBeNull();
    expect(result.current.categories).toEqual([]);
    expect(result.current.products).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  describe('loadMenu', () => {
    it('should load menu successfully', async () => {
      const mockMenu = {
        categories: [{ id: 'cat-1', name: 'Bebidas' }],
        products: [],
      };

      menuService.getMenu.mockResolvedValue(mockMenu);

      const { result } = renderHook(() => useMenu());

      await act(async () => {
        await result.current.loadMenu();
      });

      expect(result.current.menu).toEqual(mockMenu);
      expect(result.current.categories).toEqual(mockMenu.categories);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should handle errors when loading menu', async () => {
      const error = new Error('Failed to load');
      menuService.getMenu.mockRejectedValue(error);

      const { result } = renderHook(() => useMenu());

      await act(async () => {
        try {
          await result.current.loadMenu();
        } catch (e) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe('Failed to load');
      expect(toast.error).toHaveBeenCalledWith('Failed to load');
    });
  });

  describe('loadProducts', () => {
    it('should load products successfully', async () => {
      const mockProducts = [
        { id: 'prod-1', name: 'Cafe' },
        { id: 'prod-2', name: 'Te' },
      ];

      menuService.getProducts.mockResolvedValue({ products: mockProducts });

      const { result } = renderHook(() => useMenu());

      await act(async () => {
        await result.current.loadProducts();
      });

      expect(result.current.products).toEqual(mockProducts);
    });
  });

  describe('searchProducts', () => {
    it('should search products successfully', async () => {
      const mockResults = [{ id: 'prod-1', name: 'Cafe Americano' }];

      menuService.searchProducts.mockResolvedValue(mockResults);

      const { result } = renderHook(() => useMenu());

      await act(async () => {
        await result.current.searchProducts('cafe');
      });

      expect(result.current.products).toEqual(mockResults);
    });

    it('should clear products when query is empty', async () => {
      const { result } = renderHook(() => useMenu());

      await act(async () => {
        const res = await result.current.searchProducts('');
      });

      expect(result.current.products).toEqual([]);
      expect(menuService.searchProducts).not.toHaveBeenCalled();
    });
  });

  describe('createProduct', () => {
    it('should create product and reload list', async () => {
      const newProduct = { id: 'prod-new', name: 'New Product' };
      const productData = { name: 'New Product', price: 5000 };

      menuService.createProduct.mockResolvedValue(newProduct);
      menuService.getProducts.mockResolvedValue({ products: [newProduct] });

      const { result } = renderHook(() => useMenu());

      await act(async () => {
        await result.current.createProduct(productData);
      });

      expect(toast.success).toHaveBeenCalledWith('Producto creado exitosamente');
      expect(menuService.getProducts).toHaveBeenCalled();
    });
  });

  describe('updateProduct', () => {
    it('should update product in list', async () => {
      const updatedProduct = { id: 'prod-1', name: 'Updated Name' };

      menuService.updateProduct.mockResolvedValue(updatedProduct);

      const { result } = renderHook(() => useMenu());

      // Set initial products
      await act(async () => {
        result.current.products.push({ id: 'prod-1', name: 'Old Name' });
      });

      await act(async () => {
        await result.current.updateProduct('prod-1', { name: 'Updated Name' });
      });

      expect(toast.success).toHaveBeenCalledWith('Producto actualizado');
    });
  });

  describe('updateProductAvailability', () => {
    it('should update product availability', async () => {
      const updatedProduct = { id: 'prod-1', available: false };

      menuService.updateProductAvailability.mockResolvedValue(updatedProduct);

      const { result } = renderHook(() => useMenu());

      await act(async () => {
        await result.current.updateProductAvailability('prod-1', false);
      });

      expect(toast.success).toHaveBeenCalledWith('Producto desactivado');
    });
  });

  describe('deleteProduct', () => {
    it('should delete product from list', async () => {
      menuService.deleteProduct.mockResolvedValue({});

      const { result } = renderHook(() => useMenu());

      await act(async () => {
        await result.current.deleteProduct('prod-1');
      });

      expect(toast.success).toHaveBeenCalledWith('Producto eliminado');
    });
  });
});
