/**
 * Servicio de WebSocket para notificaciones en tiempo real
 * @module services/websocketService
 *
 * Maneja la conexión WebSocket con el servidor para
 * actualizaciones en tiempo real de pedidos y menú.
 */

import { io } from 'socket.io-client';
import { WS_URL, WS_EVENTS } from '../constants';
import { getToken } from '../utils/localStorage';

/**
 * Cliente Socket.io (singleton)
 */
let socket = null;

/**
 * Conecta al servidor WebSocket
 * @param {Object} options - Opciones de conexión
 * @returns {Object} Instancia de socket
 */
export const connect = (options = {}) => {
  if (socket && socket.connected) {
    console.log('🔌 WebSocket ya conectado');
    return socket;
  }

  const token = getToken();

  socket = io(WS_URL, {
    auth: {
      token,
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    ...options,
  });

  // Event listeners de conexión
  socket.on(WS_EVENTS.CONNECT, () => {
    console.log('✅ WebSocket conectado:', socket.id);
  });

  socket.on(WS_EVENTS.DISCONNECT, (reason) => {
    console.log('❌ WebSocket desconectado:', reason);
  });

  socket.on(WS_EVENTS.ERROR, (error) => {
    console.error('⚠️ WebSocket error:', error);
  });

  socket.on('connect_error', (error) => {
    console.error('⚠️ Error de conexión WebSocket:', error.message);
  });

  return socket;
};

/**
 * Desconecta del servidor WebSocket
 */
export const disconnect = () => {
  if (socket) {
    console.log('🔌 Desconectando WebSocket...');
    socket.disconnect();
    socket = null;
  }
};

/**
 * Obtiene la instancia actual de socket
 * @returns {Object|null} Socket o null si no está conectado
 */
export const getSocket = () => {
  return socket;
};

/**
 * Verifica si está conectado
 * @returns {boolean} true si está conectado
 */
export const isConnected = () => {
  return socket && socket.connected;
};

/**
 * Suscribe a notificaciones de nuevos pedidos (cocina)
 * @param {Function} callback - Función a ejecutar cuando llega un pedido
 * @returns {Function} Función para desuscribirse
 */
export const onNewOrder = (callback) => {
  if (!socket) {
    console.warn('Socket no inicializado');
    return () => {};
  }

  socket.on(WS_EVENTS.NEW_ORDER, callback);

  // Retornar función para limpiar el listener
  return () => {
    socket.off(WS_EVENTS.NEW_ORDER, callback);
  };
};

/**
 * Suscribe a actualizaciones de estado de pedidos
 * @param {Function} callback - Función a ejecutar cuando cambia el estado
 * @returns {Function} Función para desuscribirse
 */
export const onOrderStatusChange = (callback) => {
  if (!socket) {
    console.warn('Socket no inicializado');
    return () => {};
  }

  socket.on(WS_EVENTS.ORDER_STATUS_CHANGE, callback);

  return () => {
    socket.off(WS_EVENTS.ORDER_STATUS_CHANGE, callback);
  };
};

/**
 * Suscribe a actualizaciones de un pedido específico
 * @param {string} orderId - ID del pedido
 * @param {Function} callback - Función a ejecutar cuando se actualiza
 * @returns {Function} Función para desuscribirse
 */
export const onOrderUpdate = (orderId, callback) => {
  if (!socket) {
    console.warn('Socket no inicializado');
    return () => {};
  }

  const eventName = `${WS_EVENTS.ORDER_UPDATE}:${orderId}`;

  // Unirse a la room del pedido
  socket.emit('join_order', orderId);

  socket.on(eventName, callback);

  return () => {
    socket.emit('leave_order', orderId);
    socket.off(eventName, callback);
  };
};

/**
 * Suscribe a actualizaciones del menú
 * @param {Function} callback - Función a ejecutar cuando cambia el menú
 * @returns {Function} Función para desuscribirse
 */
export const onMenuUpdate = (callback) => {
  if (!socket) {
    console.warn('Socket no inicializado');
    return () => {};
  }

  socket.on(WS_EVENTS.MENU_UPDATE, callback);

  return () => {
    socket.off(WS_EVENTS.MENU_UPDATE, callback);
  };
};

/**
 * Suscribe a actualizaciones de productos
 * @param {Function} callback - Función a ejecutar cuando cambia un producto
 * @returns {Function} Función para desuscribirse
 */
export const onProductUpdate = (callback) => {
  if (!socket) {
    console.warn('Socket no inicializado');
    return () => {};
  }

  socket.on(WS_EVENTS.PRODUCT_UPDATE, callback);

  return () => {
    socket.off(WS_EVENTS.PRODUCT_UPDATE, callback);
  };
};

/**
 * Emite un evento al servidor
 * @param {string} eventName - Nombre del evento
 * @param {any} data - Datos a enviar
 */
export const emit = (eventName, data) => {
  if (!socket) {
    console.warn('Socket no inicializado');
    return;
  }

  socket.emit(eventName, data);
};

/**
 * Se une a una room específica
 * @param {string} room - Nombre de la room
 */
export const joinRoom = (room) => {
  if (!socket) {
    console.warn('Socket no inicializado');
    return;
  }

  socket.emit('join_room', room);
  console.log(`📡 Unido a room: ${room}`);
};

/**
 * Sale de una room específica
 * @param {string} room - Nombre de la room
 */
export const leaveRoom = (room) => {
  if (!socket) {
    console.warn('Socket no inicializado');
    return;
  }

  socket.emit('leave_room', room);
  console.log(`📡 Salió de room: ${room}`);
};

export default {
  connect,
  disconnect,
  getSocket,
  isConnected,
  onNewOrder,
  onOrderStatusChange,
  onOrderUpdate,
  onMenuUpdate,
  onProductUpdate,
  emit,
  joinRoom,
  leaveRoom,
};
