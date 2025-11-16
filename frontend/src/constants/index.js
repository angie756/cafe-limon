/**
 * Constantes globales de la aplicación Café Limón
 * @module constants
 */

// URLs de la API
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
export const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws';

// Configuración de la aplicación
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Café Limón';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

// Estados de pedidos
export const ORDER_STATUS = {
  PENDING: 'PENDING',
  EN_PREPARACION: 'EN_PREPARACION',
  LISTO: 'LISTO',
  ENTREGADO: 'ENTREGADO',
  CANCELADO: 'CANCELADO',
};

// Etiquetas de estados para mostrar al usuario
export const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'Pendiente',
  [ORDER_STATUS.EN_PREPARACION]: 'En Preparación',
  [ORDER_STATUS.LISTO]: 'Listo',
  [ORDER_STATUS.ENTREGADO]: 'Entregado',
  [ORDER_STATUS.CANCELADO]: 'Cancelado',
};

// Iconos para estados de pedidos
export const ORDER_STATUS_ICONS = {
  [ORDER_STATUS.PENDING]: '🔵',
  [ORDER_STATUS.EN_PREPARACION]: '🟡',
  [ORDER_STATUS.LISTO]: '🟢',
  [ORDER_STATUS.ENTREGADO]: '⚪',
  [ORDER_STATUS.CANCELADO]: '🔴',
};

// Roles de usuario
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  KITCHEN: 'KITCHEN',
  CLIENT: 'CLIENT',
};

// Rutas de la aplicación
export const ROUTES = {
  HOME: '/',
  MENU: '/menu/:tableId',
  CART: '/cart',
  ORDER_STATUS: '/order/:orderId',
  KITCHEN: '/kitchen',
  ADMIN: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_TABLES: '/admin/tables',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_REPORTS: '/admin/reports',
  LOGIN: '/login',
  NOT_FOUND: '*',
};

// Categorías predeterminadas (se pueden gestionar desde el admin)
export const DEFAULT_CATEGORIES = [
  {
    id: 'cafes',
    name: 'Cafés',
    icon: '☕',
    description: 'Cafés artesanales y especiales',
  },
  {
    id: 'bebidas',
    name: 'Bebidas Frías',
    icon: '🥤',
    description: 'Bebidas frías y refrescantes',
  },
  {
    id: 'postres',
    name: 'Postres',
    icon: '🍰',
    description: 'Dulces y postres caseros',
  },
  {
    id: 'alimentos',
    name: 'Alimentos',
    icon: '🥐',
    description: 'Sandwiches, wraps y más',
  },
];

// Límites y validaciones
export const LIMITS = {
  MAX_CART_ITEMS: 50,
  MAX_PRODUCT_QUANTITY: 10,
  MIN_ORDER_AMOUNT: 1000, // COP
  MAX_ORDER_AMOUNT: 500000, // COP
  MAX_PRODUCT_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_NOTES_LENGTH: 200,
};

// Tiempos (en milisegundos)
export const TIMINGS = {
  TOAST_DURATION: 3000,
  TOAST_SUCCESS_DURATION: 2000,
  TOAST_ERROR_DURATION: 4000,
  DEBOUNCE_DELAY: 300,
  AUTO_REFRESH_INTERVAL: 30000, // 30 segundos
  TOKEN_REFRESH_INTERVAL: 3600000, // 1 hora
};

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Por favor, verifica tu internet.',
  SERVER_ERROR: 'Error del servidor. Intenta nuevamente más tarde.',
  UNAUTHORIZED: 'No tienes permisos para realizar esta acción.',
  NOT_FOUND: 'El recurso solicitado no fue encontrado.',
  VALIDATION_ERROR: 'Por favor, verifica los datos ingresados.',
  CART_EMPTY: 'Tu carrito está vacío. Agrega productos antes de continuar.',
  PRODUCT_UNAVAILABLE: 'Este producto no está disponible en este momento.',
};

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
  ORDER_CREATED: 'Pedido creado exitosamente',
  ORDER_UPDATED: 'Pedido actualizado',
  PRODUCT_ADDED: 'Producto agregado al carrito',
  PRODUCT_REMOVED: 'Producto eliminado del carrito',
  LOGIN_SUCCESS: 'Bienvenido de vuelta',
  LOGOUT_SUCCESS: 'Sesión cerrada correctamente',
};

// Configuración de caché local
export const CACHE_KEYS = {
  CART: 'cafe_limon_cart',
  USER: 'cafe_limon_user',
  TOKEN: 'cafe_limon_token',
  PREFERENCES: 'cafe_limon_preferences',
  RECENT_ORDERS: 'cafe_limon_recent_orders',
};

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

// Formato de moneda
export const CURRENCY = {
  CODE: 'COP',
  SYMBOL: '$',
  LOCALE: 'es-CO',
  DECIMALS: 0,
};

// Expresiones regulares para validación
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[0-9]{10}$/,
  NUMBERS_ONLY: /^[0-9]+$/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
};

// WebSocket events
export const WS_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  NEW_ORDER: 'new_order',
  ORDER_UPDATE: 'order_update',
  ORDER_STATUS_CHANGE: 'order_status_change',
  PRODUCT_UPDATE: 'product_update',
  MENU_UPDATE: 'menu_update',
};

// Configuración de accesibilidad
export const A11Y = {
  SKIP_LINK_ID: 'main-content',
  ARIA_LIVE_REGION_ID: 'aria-live-region',
};

export default {
  API_URL,
  WS_URL,
  APP_NAME,
  APP_VERSION,
  ORDER_STATUS,
  ORDER_STATUS_LABELS,
  ORDER_STATUS_ICONS,
  USER_ROLES,
  ROUTES,
  DEFAULT_CATEGORIES,
  LIMITS,
  TIMINGS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  CACHE_KEYS,
  PAGINATION,
  CURRENCY,
  REGEX,
  WS_EVENTS,
  A11Y,
};
