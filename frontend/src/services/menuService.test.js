import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getCategories,
  getCategoryById,
  getMenu,
  getMenuByTable,
  getProducts,
  getProductById,
  searchProducts,
  createProduct,
  updateProduct,
  updateProductAvailability,
  deleteProduct,
  uploadProductImage,
  createCategory,
  updateCategory,
  deleteCategory,
} from './menuService';
import * as api from './api';

// Mock API functions
vi.mock('./api', () => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  patch: vi.fn(),
  del: vi.fn(),
}));

describe('menuService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCategories', () => {
    it('should fetch all categories', async () => {
      const categories = [
        { id: 'cat-1', name: 'Bebidas' },
        { id: 'cat-2', name: 'Comidas' },
      ];

      api.get.mockResolvedValue(categories);

      const result = await getCategories();

      expect(api.get).toHaveBeenCalledWith('/categories');
      expect(result).toEqual(categories);
    });
  });

  describe('getCategoryById', () => {
    it('should fetch category by ID', async () => {
      const category = { id: 'cat-1', name: 'Bebidas' };

      api.get.mockResolvedValue(category);

      const result = await getCategoryById('cat-1');

      expect(api.get).toHaveBeenCalledWith('/categories/cat-1');
      expect(result).toEqual(category);
    });
  });

  describe('getMenu', () => {
    it('should fetch menu with default params', async () => {
      const menu = { categories: [], products: [] };

      api.get.mockResolvedValue(menu);

      const result = await getMenu();

      expect(api.get).toHaveBeenCalledWith('/menu?availableOnly=true');
      expect(result).toEqual(menu);
    });

    it('should fetch menu with custom params', async () => {
      const menu = { categories: [], products: [] };

      api.get.mockResolvedValue(menu);

      const result = await getMenu({ availableOnly: false });

      expect(api.get).toHaveBeenCalledWith('/menu?availableOnly=false');
      expect(result).toEqual(menu);
    });
  });

  describe('getMenuByTable', () => {
    it('should fetch menu for specific table', async () => {
      const menu = { table: { id: 'table-1' }, categories: [] };

      api.get.mockResolvedValue(menu);

      const result = await getMenuByTable('table-1');

      expect(api.get).toHaveBeenCalledWith('/menu/table/table-1');
      expect(result).toEqual(menu);
    });
  });

  describe('getProducts', () => {
    it('should fetch products with no params', async () => {
      const products = { products: [], total: 0, page: 1 };

      api.get.mockResolvedValue(products);

      const result = await getProducts();

      expect(api.get).toHaveBeenCalledWith('/products?');
      expect(result).toEqual(products);
    });

    it('should fetch products with all params', async () => {
      const products = { products: [], total: 0, page: 1 };

      api.get.mockResolvedValue(products);

      const result = await getProducts({
        categoryId: 'cat-1',
        availableOnly: true,
        page: 2,
        pageSize: 20,
      });

      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('categoryId=cat-1')
      );
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('availableOnly=true')
      );
      expect(api.get).toHaveBeenCalledWith(expect.stringContaining('page=2'));
      expect(api.get).toHaveBeenCalledWith(expect.stringContaining('pageSize=20'));
      expect(result).toEqual(products);
    });
  });

  describe('getProductById', () => {
    it('should fetch product by ID', async () => {
      const product = { id: 'prod-1', name: 'Cafe Americano' };

      api.get.mockResolvedValue(product);

      const result = await getProductById('prod-1');

      expect(api.get).toHaveBeenCalledWith('/products/prod-1');
      expect(result).toEqual(product);
    });
  });

  describe('searchProducts', () => {
    it('should search products with encoded query', async () => {
      const products = [{ id: 'prod-1', name: 'Cafe Americano' }];

      api.get.mockResolvedValue(products);

      const result = await searchProducts('cafe');

      expect(api.get).toHaveBeenCalledWith('/products/search?q=cafe');
      expect(result).toEqual(products);
    });

    it('should handle special characters in query', async () => {
      const products = [];

      api.get.mockResolvedValue(products);

      await searchProducts('café & té');

      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('caf%C3%A9%20%26%20t%C3%A9')
      );
    });
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const productData = {
        name: 'Cafe Latte',
        price: 3500,
        categoryId: 'cat-1',
      };

      const createdProduct = { id: 'prod-2', ...productData };

      api.post.mockResolvedValue(createdProduct);

      const result = await createProduct(productData);

      expect(api.post).toHaveBeenCalledWith('/products', productData);
      expect(result).toEqual(createdProduct);
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      const productData = { name: 'Updated Name', price: 4000 };

      const updatedProduct = { id: 'prod-1', ...productData };

      api.put.mockResolvedValue(updatedProduct);

      const result = await updateProduct('prod-1', productData);

      expect(api.put).toHaveBeenCalledWith('/products/prod-1', productData);
      expect(result).toEqual(updatedProduct);
    });
  });

  describe('updateProductAvailability', () => {
    it('should update product availability to true', async () => {
      const updatedProduct = { id: 'prod-1', available: true };

      api.patch.mockResolvedValue(updatedProduct);

      const result = await updateProductAvailability('prod-1', true);

      expect(api.patch).toHaveBeenCalledWith('/products/prod-1/availability', {
        available: true,
      });
      expect(result).toEqual(updatedProduct);
    });

    it('should update product availability to false', async () => {
      const updatedProduct = { id: 'prod-1', available: false };

      api.patch.mockResolvedValue(updatedProduct);

      const result = await updateProductAvailability('prod-1', false);

      expect(api.patch).toHaveBeenCalledWith('/products/prod-1/availability', {
        available: false,
      });
      expect(result).toEqual(updatedProduct);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      api.del.mockResolvedValue({});

      await deleteProduct('prod-1');

      expect(api.del).toHaveBeenCalledWith('/products/prod-1');
    });
  });

  describe('uploadProductImage', () => {
    it('should upload image without progress callback', async () => {
      const file = new File(['image'], 'test.png', { type: 'image/png' });
      const response = { imageUrl: 'http://example.com/image.png' };

      api.post.mockResolvedValue(response);

      const result = await uploadProductImage(file);

      expect(api.post).toHaveBeenCalledWith(
        '/products/upload-image',
        expect.any(FormData),
        expect.objectContaining({
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      );
      expect(result).toEqual(response);
    });

    it('should upload image with progress callback', async () => {
      const file = new File(['image'], 'test.png', { type: 'image/png' });
      const onProgress = vi.fn();
      const response = { imageUrl: 'http://example.com/image.png' };

      api.post.mockResolvedValue(response);

      await uploadProductImage(file, onProgress);

      expect(api.post).toHaveBeenCalledWith(
        '/products/upload-image',
        expect.any(FormData),
        expect.objectContaining({
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: expect.any(Function),
        })
      );
    });
  });

  describe('createCategory', () => {
    it('should create a new category', async () => {
      const categoryData = { name: 'Postres', description: 'Dulces' };

      const createdCategory = { id: 'cat-3', ...categoryData };

      api.post.mockResolvedValue(createdCategory);

      const result = await createCategory(categoryData);

      expect(api.post).toHaveBeenCalledWith('/categories', categoryData);
      expect(result).toEqual(createdCategory);
    });
  });

  describe('updateCategory', () => {
    it('should update a category', async () => {
      const categoryData = { name: 'Updated Category' };

      const updatedCategory = { id: 'cat-1', ...categoryData };

      api.put.mockResolvedValue(updatedCategory);

      const result = await updateCategory('cat-1', categoryData);

      expect(api.put).toHaveBeenCalledWith('/categories/cat-1', categoryData);
      expect(result).toEqual(updatedCategory);
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category', async () => {
      api.del.mockResolvedValue({});

      await deleteCategory('cat-1');

      expect(api.del).toHaveBeenCalledWith('/categories/cat-1');
    });
  });
});
