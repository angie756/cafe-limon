/**
 * Servicio para gestión del menú y productos
 * @module services/menuService
 *
 * Este servicio utiliza el cliente HTTP configurado en api.js
 * para todas las operaciones relacionadas con el menú.
 */

import { get, post, put, patch, del } from './api';

/**
 * Obtiene todas las categorías activas
 * @returns {Promise<Array>} Array de categorías
 */
export const getCategories = async () => {
  return get('/categories');
};

/**
 * Obtiene una categoría por ID
 * @param {string} categoryId - ID de la categoría
 * @returns {Promise<Object>} Categoría
 */
export const getCategoryById = async (categoryId) => {
  return get(`/categories/${categoryId}`);
};

/**
 * Obtiene el menú completo (categorías con productos)
 * @param {Object} params - Parámetros de filtrado
 * @param {boolean} params.availableOnly - Solo productos disponibles
 * @returns {Promise<Object>} Menú completo
 */
export const getMenu = async (params = {}) => {
  const queryParams = new URLSearchParams({
    availableOnly: params.availableOnly ?? true,
  }).toString();

  return get(`/menu?${queryParams}`);
};

/**
 * Obtiene el menú de una mesa específica
 * @param {string} tableId - ID de la mesa
 * @returns {Promise<Object>} Menú con info de la mesa
 */
export const getMenuByTable = async (tableId) => {
  return get(`/menu/table/${tableId}`);
};

/**
 * Obtiene todos los productos
 * @param {Object} params - Parámetros de filtrado y paginación
 * @param {string} params.categoryId - Filtrar por categoría
 * @param {boolean} params.availableOnly - Solo disponibles
 * @param {number} params.page - Número de página
 * @param {number} params.pageSize - Tamaño de página
 * @returns {Promise<Object>} { products: Array, total: number, page: number }
 */
export const getProducts = async (params = {}) => {
  const queryParams = new URLSearchParams();

  if (params.categoryId) queryParams.append('categoryId', params.categoryId);
  if (params.availableOnly !== undefined) queryParams.append('availableOnly', params.availableOnly);
  if (params.page) queryParams.append('page', params.page);
  if (params.pageSize) queryParams.append('pageSize', params.pageSize);

  return get(`/products?${queryParams.toString()}`);
};

/**
 * Obtiene un producto por ID
 * @param {string} productId - ID del producto
 * @returns {Promise<Object>} Producto
 */
export const getProductById = async (productId) => {
  return get(`/products/${productId}`);
};

/**
 * Busca productos por nombre
 * @param {string} query - Término de búsqueda
 * @returns {Promise<Array>} Array de productos
 */
export const searchProducts = async (query) => {
  return get(`/products/search?q=${encodeURIComponent(query)}`);
};

/**
 * Crea un nuevo producto (requiere autenticación ADMIN)
 * @param {Object} productData - Datos del producto
 * @param {string} productData.name - Nombre del producto
 * @param {string} productData.description - Descripción
 * @param {number} productData.price - Precio
 * @param {string} productData.categoryId - ID de categoría
 * @param {string} productData.imageUrl - URL de la imagen
 * @param {number} productData.preparationTime - Tiempo de preparación (minutos)
 * @param {boolean} productData.available - Disponibilidad
 * @returns {Promise<Object>} Producto creado
 */
export const createProduct = async (productData) => {
  return post('/products', productData);
};

/**
 * Actualiza un producto existente (requiere autenticación ADMIN)
 * @param {string} productId - ID del producto
 * @param {Object} productData - Datos a actualizar
 * @returns {Promise<Object>} Producto actualizado
 */
export const updateProduct = async (productId, productData) => {
  return put(`/products/${productId}`, productData);
};

/**
 * Actualiza la disponibilidad de un producto (requiere autenticación ADMIN)
 * @param {string} productId - ID del producto
 * @param {boolean} available - Nueva disponibilidad
 * @returns {Promise<Object>} Producto actualizado
 */
export const updateProductAvailability = async (productId, available) => {
  return patch(`/products/${productId}/availability`, { available });
};

/**
 * Elimina un producto (soft delete) (requiere autenticación ADMIN)
 * @param {string} productId - ID del producto
 * @returns {Promise<void>}
 */
export const deleteProduct = async (productId) => {
  return del(`/products/${productId}`);
};

/**
 * Sube una imagen de producto (requiere autenticación ADMIN)
 * @param {File} file - Archivo de imagen
 * @param {Function} onProgress - Callback de progreso
 * @returns {Promise<Object>} { imageUrl: string }
 */
export const uploadProductImage = async (file, onProgress = null) => {
  const formData = new FormData();
  formData.append('image', file);

  return post('/products/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: onProgress ? (e) => {
      const percent = Math.round((e.loaded * 100) / e.total);
      onProgress(percent);
    } : undefined,
  });
};

/**
 * Crea una nueva categoría (requiere autenticación ADMIN)
 * @param {Object} categoryData - Datos de la categoría
 * @returns {Promise<Object>} Categoría creada
 */
export const createCategory = async (categoryData) => {
  return post('/categories', categoryData);
};

/**
 * Actualiza una categoría (requiere autenticación ADMIN)
 * @param {string} categoryId - ID de la categoría
 * @param {Object} categoryData - Datos a actualizar
 * @returns {Promise<Object>} Categoría actualizada
 */
export const updateCategory = async (categoryId, categoryData) => {
  return put(`/categories/${categoryId}`, categoryData);
};

/**
 * Elimina una categoría (requiere autenticación ADMIN)
 * Solo se puede eliminar si no tiene productos asociados
 * @param {string} categoryId - ID de la categoría
 * @returns {Promise<void>}
 */
export const deleteCategory = async (categoryId) => {
  return del(`/categories/${categoryId}`);
};

export default {
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
};
