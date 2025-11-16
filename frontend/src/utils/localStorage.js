/**
 * Utilidades para manejo de LocalStorage de forma segura
 * @module utils/localStorage
 */

import { CACHE_KEYS } from '../constants';

/**
 * Guarda un valor en localStorage
 * @param {string} key - Clave
 * @param {any} value - Valor a guardar (será stringify)
 * @returns {boolean} true si se guardó exitosamente
 */
export const setItem = (key, value) => {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error(`Error guardando en localStorage (${key}):`, error);
    return false;
  }
};

/**
 * Obtiene un valor de localStorage
 * @param {string} key - Clave
 * @param {any} defaultValue - Valor por defecto si no existe o hay error
 * @returns {any} Valor parseado o defaultValue
 */
export const getItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);

    if (item === null) {
      return defaultValue;
    }

    return JSON.parse(item);
  } catch (error) {
    console.error(`Error leyendo de localStorage (${key}):`, error);
    return defaultValue;
  }
};

/**
 * Remueve un valor de localStorage
 * @param {string} key - Clave
 * @returns {boolean} true si se removió exitosamente
 */
export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removiendo de localStorage (${key}):`, error);
    return false;
  }
};

/**
 * Limpia todo el localStorage
 * @returns {boolean} true si se limpió exitosamente
 */
export const clear = () => {
  try {
    localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error limpiando localStorage:', error);
    return false;
  }
};

/**
 * Verifica si una clave existe en localStorage
 * @param {string} key - Clave
 * @returns {boolean} true si existe
 */
export const hasItem = (key) => {
  return localStorage.getItem(key) !== null;
};

// Funciones específicas para la app

/**
 * Guarda el carrito en localStorage
 * @param {Array} cart - Array de items del carrito
 */
export const saveCart = (cart) => {
  return setItem(CACHE_KEYS.CART, cart);
};

/**
 * Obtiene el carrito de localStorage
 * @returns {Object} Objeto del carrito con items y tableId
 */
export const getCart = () => {
  return getItem(CACHE_KEYS.CART, { items: [], tableId: null });
};

/**
 * Limpia el carrito de localStorage
 */
export const clearCart = () => {
  return removeItem(CACHE_KEYS.CART);
};

/**
 * Guarda el token de autenticación
 * @param {string} token - JWT token
 */
export const saveToken = (token) => {
  return setItem(CACHE_KEYS.TOKEN, token);
};

/**
 * Obtiene el token de autenticación
 * @returns {string|null} Token o null
 */
export const getToken = () => {
  return getItem(CACHE_KEYS.TOKEN);
};

/**
 * Remueve el token de autenticación
 */
export const removeToken = () => {
  return removeItem(CACHE_KEYS.TOKEN);
};

/**
 * Guarda la información del usuario
 * @param {Object} user - Objeto de usuario
 */
export const saveUser = (user) => {
  return setItem(CACHE_KEYS.USER, user);
};

/**
 * Obtiene la información del usuario
 * @returns {Object|null} Usuario o null
 */
export const getUser = () => {
  return getItem(CACHE_KEYS.USER);
};

/**
 * Remueve la información del usuario
 */
export const removeUser = () => {
  return removeItem(CACHE_KEYS.USER);
};

/**
 * Guarda las preferencias del usuario
 * @param {Object} preferences - Objeto de preferencias
 */
export const savePreferences = (preferences) => {
  return setItem(CACHE_KEYS.PREFERENCES, preferences);
};

/**
 * Obtiene las preferencias del usuario
 * @returns {Object} Preferencias
 */
export const getPreferences = () => {
  return getItem(CACHE_KEYS.PREFERENCES, {
    theme: 'light',
    notifications: true,
    sound: true,
  });
};

/**
 * Guarda los pedidos recientes
 * @param {Array} orders - Array de pedidos
 */
export const saveRecentOrders = (orders) => {
  // Guardar solo los últimos 10
  const limited = orders.slice(0, 10);
  return setItem(CACHE_KEYS.RECENT_ORDERS, limited);
};

/**
 * Obtiene los pedidos recientes
 * @returns {Array} Array de pedidos
 */
export const getRecentOrders = () => {
  return getItem(CACHE_KEYS.RECENT_ORDERS, []);
};

/**
 * Limpia todos los datos de la sesión (logout)
 */
export const clearSession = () => {
  removeToken();
  removeUser();
  clearCart();
};

export default {
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
};
