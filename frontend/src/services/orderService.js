/**
 * Servicio para gestión de pedidos
 * @module services/orderService
 *
 * Este servicio maneja todas las operaciones de pedidos,
 * conectándose con el backend a través del cliente HTTP configurado.
 */

import { get, post, patch } from './api';
import { ORDER_STATUS } from '../constants';

/**
 * Crea un nuevo pedido
 * @param {Object} orderData - Datos del pedido
 * @param {string} orderData.tableId - ID de la mesa
 * @param {Array} orderData.items - Items del pedido
 * @param {string} orderData.customerName - Nombre del cliente (opcional)
 * @param {string} orderData.notes - Notas generales (opcional)
 * @returns {Promise<Object>} Pedido creado con ID único
 */
export const createOrder = async (orderData) => {
  return post('/orders', orderData);
};

/**
 * Obtiene un pedido por su ID
 * @param {string} orderId - ID del pedido
 * @returns {Promise<Object>} Pedido con todos sus detalles
 */
export const getOrderById = async (orderId) => {
  return get(`/orders/${orderId}`);
};

/**
 * Obtiene todos los pedidos activos (cocina)
 * @param {Object} params - Parámetros de filtrado
 * @param {string} params.status - Filtrar por estado
 * @returns {Promise<Array>} Array de pedidos activos
 */
export const getActiveOrders = async (params = {}) => {
  const queryParams = new URLSearchParams();

  if (params.status) {
    queryParams.append('status', params.status);
  } else {
    // Por defecto, pedidos activos (no entregados ni cancelados)
    queryParams.append('status', ORDER_STATUS.PENDING);
    queryParams.append('status', ORDER_STATUS.EN_PREPARACION);
    queryParams.append('status', ORDER_STATUS.LISTO);
  }

  return get(`/orders/active?${queryParams.toString()}`);
};

/**
 * Obtiene todos los pedidos (admin) con paginación
 * @param {Object} params - Parámetros de filtrado y paginación
 * @param {string} params.status - Filtrar por estado
 * @param {string} params.tableId - Filtrar por mesa
 * @param {string} params.startDate - Fecha inicio (ISO string)
 * @param {string} params.endDate - Fecha fin (ISO string)
 * @param {number} params.page - Número de página
 * @param {number} params.pageSize - Tamaño de página
 * @returns {Promise<Object>} { orders: Array, total: number, page: number }
 */
export const getOrders = async (params = {}) => {
  const queryParams = new URLSearchParams();

  if (params.status) queryParams.append('status', params.status);
  if (params.tableId) queryParams.append('tableId', params.tableId);
  if (params.startDate) queryParams.append('startDate', params.startDate);
  if (params.endDate) queryParams.append('endDate', params.endDate);
  if (params.page) queryParams.append('page', params.page);
  if (params.pageSize) queryParams.append('pageSize', params.pageSize);

  return get(`/orders?${queryParams.toString()}`);
};

/**
 * Obtiene pedidos de una mesa específica
 * @param {string} tableId - ID de la mesa
 * @param {boolean} activeOnly - Solo pedidos activos
 * @returns {Promise<Array>} Array de pedidos de la mesa
 */
export const getOrdersByTable = async (tableId, activeOnly = true) => {
  const queryParams = activeOnly ? '?activeOnly=true' : '';
  return get(`/tables/${tableId}/orders${queryParams}`);
};

/**
 * Actualiza el estado de un pedido
 * @param {string} orderId - ID del pedido
 * @param {string} newStatus - Nuevo estado (usar ORDER_STATUS constants)
 * @returns {Promise<Object>} Pedido actualizado
 */
export const updateOrderStatus = async (orderId, newStatus) => {
  return patch(`/orders/${orderId}/status`, { status: newStatus });
};

/**
 * Marca un pedido como "En Preparación"
 * @param {string} orderId - ID del pedido
 * @returns {Promise<Object>} Pedido actualizado
 */
export const startPreparingOrder = async (orderId) => {
  return updateOrderStatus(orderId, ORDER_STATUS.EN_PREPARACION);
};

/**
 * Marca un pedido como "Listo"
 * @param {string} orderId - ID del pedido
 * @returns {Promise<Object>} Pedido actualizado
 */
export const markOrderReady = async (orderId) => {
  return updateOrderStatus(orderId, ORDER_STATUS.LISTO);
};

/**
 * Marca un pedido como "Entregado"
 * @param {string} orderId - ID del pedido
 * @returns {Promise<Object>} Pedido actualizado
 */
export const markOrderDelivered = async (orderId) => {
  return updateOrderStatus(orderId, ORDER_STATUS.ENTREGADO);
};

/**
 * Cancela un pedido
 * @param {string} orderId - ID del pedido
 * @param {string} reason - Razón de cancelación (opcional)
 * @returns {Promise<Object>} Pedido cancelado
 */
export const cancelOrder = async (orderId, reason = '') => {
  return patch(`/orders/${orderId}/cancel`, { reason });
};

/**
 * Obtiene estadísticas de pedidos (admin)
 * @param {Object} params - Parámetros de fecha
 * @param {string} params.startDate - Fecha inicio
 * @param {string} params.endDate - Fecha fin
 * @returns {Promise<Object>} Estadísticas
 */
export const getOrderStats = async (params = {}) => {
  const queryParams = new URLSearchParams();

  if (params.startDate) queryParams.append('startDate', params.startDate);
  if (params.endDate) queryParams.append('endDate', params.endDate);

  return get(`/orders/stats?${queryParams.toString()}`);
};

/**
 * Obtiene el tiempo promedio de preparación
 * @returns {Promise<Object>} { averageTime: number, byCategory: Object }
 */
export const getAveragePreparationTime = async () => {
  return get('/orders/stats/preparation-time');
};

/**
 * Obtiene los productos más vendidos
 * @param {number} limit - Cantidad de productos a retornar
 * @returns {Promise<Array>} Array de productos con cantidad vendida
 */
export const getTopProducts = async (limit = 10) => {
  return get(`/orders/stats/top-products?limit=${limit}`);
};

export default {
  createOrder,
  getOrderById,
  getActiveOrders,
  getOrders,
  getOrdersByTable,
  updateOrderStatus,
  startPreparingOrder,
  markOrderReady,
  markOrderDelivered,
  cancelOrder,
  getOrderStats,
  getAveragePreparationTime,
  getTopProducts,
};
