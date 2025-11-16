/**
 * Utilidades para formateo de datos
 * @module utils/formatters
 */

import { CURRENCY } from '../constants';

/**
 * Formatea un número como precio en pesos colombianos
 * @param {number} amount - Cantidad a formatear
 * @returns {string} Precio formateado (ej: "$25.000")
 */
export const formatPrice = (amount) => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return `${CURRENCY.SYMBOL}0`;
  }

  return new Intl.NumberFormat(CURRENCY.LOCALE, {
    style: 'currency',
    currency: CURRENCY.CODE,
    minimumFractionDigits: CURRENCY.DECIMALS,
    maximumFractionDigits: CURRENCY.DECIMALS,
  }).format(amount);
};

/**
 * Formatea un número agregando separadores de miles
 * @param {number} num - Número a formatear
 * @returns {string} Número formateado (ej: "1.234")
 */
export const formatNumber = (num) => {
  if (typeof num !== 'number' || isNaN(num)) {
    return '0';
  }

  return new Intl.NumberFormat(CURRENCY.LOCALE).format(num);
};

/**
 * Formatea una fecha a formato legible
 * @param {Date|string|number} date - Fecha a formatear
 * @param {boolean} includeTime - Si incluir la hora
 * @returns {string} Fecha formateada
 */
export const formatDate = (date, includeTime = false) => {
  if (!date) return '';

  const d = new Date(date);

  if (isNaN(d.getTime())) {
    return '';
  }

  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(includeTime && {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };

  return new Intl.DateTimeFormat(CURRENCY.LOCALE, options).format(d);
};

/**
 * Formatea una fecha a formato de hora (HH:MM AM/PM)
 * @param {Date|string|number} date - Fecha a formatear
 * @returns {string} Hora formateada
 */
export const formatTime = (date) => {
  if (!date) return '';

  const d = new Date(date);

  if (isNaN(d.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat(CURRENCY.LOCALE, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
};

/**
 * Formatea una fecha a formato relativo (hace X minutos)
 * @param {Date|string|number} date - Fecha a formatear
 * @returns {string} Tiempo relativo
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';

  const d = new Date(date);

  if (isNaN(d.getTime())) {
    return '';
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now - d) / 1000);

  if (diffInSeconds < 60) {
    return 'ahora mismo';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `hace ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `hace ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `hace ${diffInDays} ${diffInDays === 1 ? 'día' : 'días'}`;
  }

  return formatDate(date);
};

/**
 * Trunca un texto a una longitud máxima
 * @param {string} text - Texto a truncar
 * @param {number} maxLength - Longitud máxima
 * @param {string} suffix - Sufijo a agregar (default: "...")
 * @returns {string} Texto truncado
 */
export const truncate = (text, maxLength = 50, suffix = '...') => {
  if (!text || typeof text !== 'string') return '';

  if (text.length <= maxLength) {
    return text;
  }

  return text.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * Capitaliza la primera letra de cada palabra
 * @param {string} text - Texto a capitalizar
 * @returns {string} Texto capitalizado
 */
export const capitalize = (text) => {
  if (!text || typeof text !== 'string') return '';

  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Formatea un número de teléfono
 * @param {string} phone - Número de teléfono
 * @returns {string} Teléfono formateado (ej: "300 123 4567")
 */
export const formatPhone = (phone) => {
  if (!phone) return '';

  const cleaned = phone.toString().replace(/\D/g, '');

  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }

  return phone;
};

/**
 * Formatea un ID de pedido
 * @param {string} orderId - ID del pedido
 * @returns {string} ID formateado
 */
export const formatOrderId = (orderId) => {
  if (!orderId) return '';

  // Si ya tiene el formato ORD-YYYYMMDD-NNN, retornarlo tal cual
  if (orderId.startsWith('ORD-')) {
    return orderId;
  }

  // Si es un UUID u otro formato, mostrar solo los primeros 8 caracteres
  return orderId.substring(0, 8).toUpperCase();
};

/**
 * Pluraliza una palabra basado en una cantidad
 * @param {number} count - Cantidad
 * @param {string} singular - Forma singular
 * @param {string} plural - Forma plural (opcional, agrega 's' por defecto)
 * @returns {string} Palabra pluralizada con la cantidad
 */
export const pluralize = (count, singular, plural = null) => {
  const word = count === 1 ? singular : (plural || `${singular}s`);
  return `${count} ${word}`;
};

/**
 * Calcula el tiempo de preparación estimado
 * @param {number} minutes - Minutos de preparación
 * @returns {string} Tiempo formateado
 */
export const formatPreparationTime = (minutes) => {
  if (!minutes || minutes <= 0) {
    return 'Preparación inmediata';
  }

  if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  }

  return `${hours}h ${remainingMinutes}min`;
};

export default {
  formatPrice,
  formatNumber,
  formatDate,
  formatTime,
  formatRelativeTime,
  truncate,
  capitalize,
  formatPhone,
  formatOrderId,
  pluralize,
  formatPreparationTime,
};
