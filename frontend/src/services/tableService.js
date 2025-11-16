/**
 * Servicio para gestión de mesas y códigos QR
 * @module services/tableService
 *
 * Maneja operaciones relacionadas con mesas del café
 * y generación de códigos QR.
 */

import { get, post, put, patch, del } from './api';

/**
 * Obtiene todas las mesas
 * @param {Object} params - Parámetros de filtrado
 * @param {boolean} params.activeOnly - Solo mesas activas
 * @returns {Promise<Array>} Array de mesas
 */
export const getTables = async (params = {}) => {
  const queryParams = new URLSearchParams();

  if (params.activeOnly !== undefined) {
    queryParams.append('activeOnly', params.activeOnly);
  }

  return get(`/tables?${queryParams.toString()}`);
};

/**
 * Obtiene una mesa por ID
 * @param {string} tableId - ID de la mesa
 * @returns {Promise<Object>} Mesa
 */
export const getTableById = async (tableId) => {
  return get(`/tables/${tableId}`);
};

/**
 * Obtiene una mesa por su número
 * @param {string} tableNumber - Número de la mesa
 * @returns {Promise<Object>} Mesa
 */
export const getTableByNumber = async (tableNumber) => {
  return get(`/tables/number/${tableNumber}`);
};

/**
 * Verifica si una mesa existe y está activa
 * @param {string} tableId - ID de la mesa
 * @returns {Promise<Object>} { exists: boolean, active: boolean }
 */
export const verifyTable = async (tableId) => {
  return get(`/tables/${tableId}/verify`);
};

/**
 * Crea una nueva mesa (requiere autenticación ADMIN)
 * @param {Object} tableData - Datos de la mesa
 * @param {string} tableData.number - Número de mesa
 * @param {number} tableData.capacity - Capacidad de personas
 * @param {string} tableData.location - Ubicación (opcional)
 * @returns {Promise<Object>} Mesa creada con QR generado
 */
export const createTable = async (tableData) => {
  return post('/tables', tableData);
};

/**
 * Actualiza una mesa (requiere autenticación ADMIN)
 * @param {string} tableId - ID de la mesa
 * @param {Object} tableData - Datos a actualizar
 * @returns {Promise<Object>} Mesa actualizada
 */
export const updateTable = async (tableId, tableData) => {
  return put(`/tables/${tableId}`, tableData);
};

/**
 * Activa o desactiva una mesa (requiere autenticación ADMIN)
 * @param {string} tableId - ID de la mesa
 * @param {boolean} active - Estado activo
 * @returns {Promise<Object>} Mesa actualizada
 */
export const updateTableStatus = async (tableId, active) => {
  return patch(`/tables/${tableId}/status`, { active });
};

/**
 * Elimina una mesa (requiere autenticación ADMIN)
 * @param {string} tableId - ID de la mesa
 * @returns {Promise<void>}
 */
export const deleteTable = async (tableId) => {
  return del(`/tables/${tableId}`);
};

/**
 * Genera un nuevo código QR para una mesa
 * @param {string} tableId - ID de la mesa
 * @returns {Promise<Object>} { qrCode: string (base64 o URL) }
 */
export const generateQRCode = async (tableId) => {
  return post(`/tables/${tableId}/generate-qr`);
};

/**
 * Descarga el código QR de una mesa en alta resolución
 * @param {string} tableId - ID de la mesa
 * @param {string} format - Formato de descarga (png, svg)
 * @returns {Promise<Blob>} Archivo QR
 */
export const downloadQRCode = async (tableId, format = 'png') => {
  const response = await get(`/tables/${tableId}/qr/download?format=${format}`, {
    responseType: 'blob',
  });

  return response;
};

/**
 * Obtiene estadísticas de uso de una mesa
 * @param {string} tableId - ID de la mesa
 * @param {Object} params - Parámetros de fecha
 * @returns {Promise<Object>} Estadísticas de uso
 */
export const getTableStats = async (tableId, params = {}) => {
  const queryParams = new URLSearchParams();

  if (params.startDate) queryParams.append('startDate', params.startDate);
  if (params.endDate) queryParams.append('endDate', params.endDate);

  return get(`/tables/${tableId}/stats?${queryParams.toString()}`);
};

/**
 * Obtiene el estado actual de una mesa
 * @param {string} tableId - ID de la mesa
 * @returns {Promise<Object>} { occupied: boolean, currentOrders: Array }
 */
export const getTableStatus = async (tableId) => {
  return get(`/tables/${tableId}/status`);
};

export default {
  getTables,
  getTableById,
  getTableByNumber,
  verifyTable,
  createTable,
  updateTable,
  updateTableStatus,
  deleteTable,
  generateQRCode,
  downloadQRCode,
  getTableStats,
  getTableStatus,
};
