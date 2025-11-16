/**
 * Utilidades para validación de datos
 * @module utils/validators
 */

import { REGEX, LIMITS } from '../constants';

/**
 * Valida un email
 * @param {string} email - Email a validar
 * @returns {boolean} true si es válido
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  return REGEX.EMAIL.test(email.trim());
};

/**
 * Valida un teléfono colombiano (10 dígitos)
 * @param {string} phone - Teléfono a validar
 * @returns {boolean} true si es válido
 */
export const isValidPhone = (phone) => {
  if (!phone) return false;
  const cleaned = phone.toString().replace(/\D/g, '');
  return REGEX.PHONE.test(cleaned);
};

/**
 * Valida que una cantidad sea válida para un producto
 * @param {number} quantity - Cantidad a validar
 * @returns {boolean} true si es válida
 */
export const isValidQuantity = (quantity) => {
  return (
    typeof quantity === 'number' &&
    !isNaN(quantity) &&
    quantity > 0 &&
    quantity <= LIMITS.MAX_PRODUCT_QUANTITY &&
    Number.isInteger(quantity)
  );
};

/**
 * Valida que un precio sea válido
 * @param {number} price - Precio a validar
 * @returns {boolean} true si es válido
 */
export const isValidPrice = (price) => {
  return (
    typeof price === 'number' &&
    !isNaN(price) &&
    price >= 0
  );
};

/**
 * Valida que una cadena no esté vacía
 * @param {string} str - Cadena a validar
 * @returns {boolean} true si no está vacía
 */
export const isNotEmpty = (str) => {
  return typeof str === 'string' && str.trim().length > 0;
};

/**
 * Valida que una cadena tenga una longitud mínima
 * @param {string} str - Cadena a validar
 * @param {number} minLength - Longitud mínima
 * @returns {boolean} true si cumple la longitud
 */
export const hasMinLength = (str, minLength) => {
  return typeof str === 'string' && str.trim().length >= minLength;
};

/**
 * Valida que una cadena tenga una longitud máxima
 * @param {string} str - Cadena a validar
 * @param {number} maxLength - Longitud máxima
 * @returns {boolean} true si cumple la longitud
 */
export const hasMaxLength = (str, maxLength) => {
  return typeof str === 'string' && str.trim().length <= maxLength;
};

/**
 * Valida un objeto de producto
 * @param {Object} product - Producto a validar
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export const validateProduct = (product) => {
  const errors = [];

  if (!product) {
    return { valid: false, errors: ['Producto inválido'] };
  }

  if (!isNotEmpty(product.name)) {
    errors.push('El nombre del producto es requerido');
  } else if (!hasMaxLength(product.name, LIMITS.MAX_PRODUCT_NAME_LENGTH)) {
    errors.push(`El nombre no puede exceder ${LIMITS.MAX_PRODUCT_NAME_LENGTH} caracteres`);
  }

  if (!isValidPrice(product.price)) {
    errors.push('El precio debe ser un número válido mayor o igual a 0');
  }

  if (product.description && !hasMaxLength(product.description, LIMITS.MAX_DESCRIPTION_LENGTH)) {
    errors.push(`La descripción no puede exceder ${LIMITS.MAX_DESCRIPTION_LENGTH} caracteres`);
  }

  if (!product.categoryId) {
    errors.push('La categoría es requerida');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Valida un objeto de pedido
 * @param {Object} order - Pedido a validar
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export const validateOrder = (order) => {
  const errors = [];

  if (!order) {
    return { valid: false, errors: ['Pedido inválido'] };
  }

  if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
    errors.push('El pedido debe tener al menos un producto');
  }

  if (order.items && order.items.length > LIMITS.MAX_CART_ITEMS) {
    errors.push(`El pedido no puede tener más de ${LIMITS.MAX_CART_ITEMS} productos`);
  }

  if (!order.tableId || !isNotEmpty(order.tableId)) {
    errors.push('ID de mesa requerido');
  }

  if (order.items) {
    order.items.forEach((item, index) => {
      if (!isValidQuantity(item.quantity)) {
        errors.push(`Cantidad inválida en el producto ${index + 1}`);
      }

      if (item.notes && !hasMaxLength(item.notes, LIMITS.MAX_NOTES_LENGTH)) {
        errors.push(`Las notas del producto ${index + 1} son muy largas`);
      }
    });
  }

  const totalAmount = order.totalAmount || 0;
  if (totalAmount < LIMITS.MIN_ORDER_AMOUNT) {
    errors.push(`El pedido mínimo es de ${LIMITS.MIN_ORDER_AMOUNT} COP`);
  }

  if (totalAmount > LIMITS.MAX_ORDER_AMOUNT) {
    errors.push(`El pedido no puede exceder ${LIMITS.MAX_ORDER_AMOUNT} COP`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Valida credenciales de login
 * @param {string} username - Nombre de usuario
 * @param {string} password - Contraseña
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export const validateLogin = (username, password) => {
  const errors = [];

  if (!isNotEmpty(username)) {
    errors.push('El nombre de usuario es requerido');
  }

  if (!isNotEmpty(password)) {
    errors.push('La contraseña es requerida');
  } else if (!hasMinLength(password, 4)) {
    errors.push('La contraseña debe tener al menos 4 caracteres');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Sanitiza una cadena removiendo caracteres peligrosos
 * @param {string} str - Cadena a sanitizar
 * @returns {string} Cadena sanitizada
 */
export const sanitizeString = (str) => {
  if (!str || typeof str !== 'string') return '';

  return str
    .trim()
    .replace(/[<>]/g, '') // Remover < y > para prevenir XSS
    .substring(0, 1000); // Límite de seguridad
};

/**
 * Valida si un objeto es un array no vacío
 * @param {any} arr - Array a validar
 * @returns {boolean} true si es un array con elementos
 */
export const isNonEmptyArray = (arr) => {
  return Array.isArray(arr) && arr.length > 0;
};

export default {
  isValidEmail,
  isValidPhone,
  isValidQuantity,
  isValidPrice,
  isNotEmpty,
  hasMinLength,
  hasMaxLength,
  validateProduct,
  validateOrder,
  validateLogin,
  sanitizeString,
  isNonEmptyArray,
};
