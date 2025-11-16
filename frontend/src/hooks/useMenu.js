/**
 * Hook personalizado para gestión del menú
 * @module hooks/useMenu
 *
 * Proporciona funciones y estado para manejar el menú y productos.
 */

import { useState, useCallback, useEffect } from 'react';
import * as menuService from '../services/menuService';
import toast from 'react-hot-toast';
import { ERROR_MESSAGES } from '../constants';

/**
 * Hook para gestionar el menú
 */
export const useMenu = (autoLoad = false) => {
  const [menu, setMenu] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Carga el menú completo
   */
  const loadMenu = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const menuData = await menuService.getMenu(params);
      setMenu(menuData);

      if (menuData.categories) {
        setCategories(menuData.categories);
      }

      return menuData;
    } catch (err) {
      const errorMessage = err.message || ERROR_MESSAGES.SERVER_ERROR;
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Carga el menú de una mesa específica
   */
  const loadMenuByTable = useCallback(async (tableId, { suppressToast = false } = {}) => {
    setLoading(true);
    setError(null);

    try {
      const menuData = await menuService.getMenuByTable(tableId);
      setMenu(menuData);

      if (menuData.categories) {
        setCategories(menuData.categories);
      }

      return menuData;
    } catch (err) {
      const errorMessage = err.message || ERROR_MESSAGES.SERVER_ERROR;
      setError(errorMessage);
      if (!suppressToast) {
        toast.error(errorMessage);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Carga todas las categorías
   */
  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const categoriesData = await menuService.getCategories();
      setCategories(categoriesData);
      return categoriesData;
    } catch (err) {
      const errorMessage = err.message || ERROR_MESSAGES.SERVER_ERROR;
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Carga productos (con filtros opcionales)
   */
  const loadProducts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const productsData = await menuService.getProducts(params);
      setProducts(productsData.products || productsData);
      return productsData;
    } catch (err) {
      const errorMessage = err.message || ERROR_MESSAGES.SERVER_ERROR;
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Busca productos por nombre
   */
  const searchProducts = useCallback(async (query) => {
    if (!query || query.trim().length === 0) {
      setProducts([]);
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      const results = await menuService.searchProducts(query);
      setProducts(results);
      return results;
    } catch (err) {
      const errorMessage = err.message || ERROR_MESSAGES.SERVER_ERROR;
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtiene un producto por ID
   */
  const getProduct = useCallback(async (productId) => {
    setLoading(true);
    setError(null);

    try {
      const product = await menuService.getProductById(productId);
      return product;
    } catch (err) {
      const errorMessage = err.message || ERROR_MESSAGES.NOT_FOUND;
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Crea un nuevo producto (admin)
   */
  const createProduct = useCallback(async (productData) => {
    setLoading(true);
    setError(null);

    try {
      const newProduct = await menuService.createProduct(productData);
      toast.success('Producto creado exitosamente');

      // Recargar productos
      await loadProducts();

      return newProduct;
    } catch (err) {
      const errorMessage = err.message || ERROR_MESSAGES.SERVER_ERROR;
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadProducts]);

  /**
   * Actualiza un producto (admin)
   */
  const updateProduct = useCallback(async (productId, productData) => {
    setLoading(true);
    setError(null);

    try {
      const updatedProduct = await menuService.updateProduct(productId, productData);
      toast.success('Producto actualizado');

      // Actualizar en la lista local
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? updatedProduct : p))
      );

      return updatedProduct;
    } catch (err) {
      const errorMessage = err.message || ERROR_MESSAGES.SERVER_ERROR;
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Actualiza disponibilidad de un producto (admin)
   */
  const updateProductAvailability = useCallback(async (productId, available) => {
    setLoading(true);
    setError(null);

    try {
      const updatedProduct = await menuService.updateProductAvailability(productId, available);

      // Actualizar en la lista local
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? updatedProduct : p))
      );

      toast.success(`Producto ${available ? 'activado' : 'desactivado'}`);
      return updatedProduct;
    } catch (err) {
      const errorMessage = err.message || ERROR_MESSAGES.SERVER_ERROR;
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Elimina un producto (admin)
   */
  const deleteProduct = useCallback(async (productId) => {
    setLoading(true);
    setError(null);

    try {
      await menuService.deleteProduct(productId);

      // Remover de la lista local
      setProducts((prev) => prev.filter((p) => p.id !== productId));

      toast.success('Producto eliminado');
    } catch (err) {
      const errorMessage = err.message || ERROR_MESSAGES.SERVER_ERROR;
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar menú automáticamente si se especifica
  useEffect(() => {
    if (autoLoad) {
      loadMenu();
    }
  }, [autoLoad, loadMenu]);

  return {
    // Estado
    menu,
    categories,
    products,
    loading,
    error,

    // Acciones
    loadMenu,
    loadMenuByTable,
    loadCategories,
    loadProducts,
    searchProducts,
    getProduct,
    createProduct,
    updateProduct,
    updateProductAvailability,
    deleteProduct,
  };
};

export default useMenu;
