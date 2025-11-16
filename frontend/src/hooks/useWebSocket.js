/**
 * Hook personalizado para WebSocket
 * @module hooks/useWebSocket
 *
 * Proporciona conexión y suscripción a eventos WebSocket.
 */

import { useEffect, useRef, useCallback } from 'react';
import * as wsService from '../services/websocketService';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

/**
 * Hook para gestionar la conexión WebSocket
 */
export const useWebSocket = (autoConnect = true) => {
  const { isAuthenticated } = useAuth();
  const socketRef = useRef(null);

  // Conectar automáticamente
  useEffect(() => {
    if (autoConnect && isAuthenticated) {
      socketRef.current = wsService.connect();

      return () => {
        wsService.disconnect();
        socketRef.current = null;
      };
    }
  }, [autoConnect, isAuthenticated]);

  /**
   * Conecta manualmente al WebSocket
   */
  const connect = useCallback(() => {
    if (!socketRef.current || !wsService.isConnected()) {
      socketRef.current = wsService.connect();
    }
  }, []);

  /**
   * Desconecta del WebSocket
   */
  const disconnect = useCallback(() => {
    wsService.disconnect();
    socketRef.current = null;
  }, []);

  /**
   * Verifica si está conectado
   */
  const isConnected = useCallback(() => {
    return wsService.isConnected();
  }, []);

  /**
   * Emite un evento
   */
  const emit = useCallback((eventName, data) => {
    wsService.emit(eventName, data);
  }, []);

  /**
   * Se une a una room
   */
  const joinRoom = useCallback((room) => {
    wsService.joinRoom(room);
  }, []);

  /**
   * Sale de una room
   */
  const leaveRoom = useCallback((room) => {
    wsService.leaveRoom(room);
  }, []);

  return {
    connect,
    disconnect,
    isConnected,
    emit,
    joinRoom,
    leaveRoom,
    socket: socketRef.current,
  };
};

/**
 * Hook para suscribirse a nuevos pedidos (cocina)
 */
export const useNewOrderListener = (callback, enabled = true) => {
  useEffect(() => {
    if (!enabled || !callback) return;

    const unsubscribe = wsService.onNewOrder((order) => {
      // Mostrar notificación
      toast.success(`Nuevo pedido #${order.id?.substring(0, 8)}`, {
        icon: '🔔',
        duration: 5000,
      });

      // Ejecutar callback
      callback(order);
    });

    return unsubscribe;
  }, [callback, enabled]);
};

/**
 * Hook para suscribirse a cambios de estado de pedidos
 */
export const useOrderStatusListener = (callback, enabled = true) => {
  useEffect(() => {
    if (!enabled || !callback) return;

    const unsubscribe = wsService.onOrderStatusChange((data) => {
      callback(data);
    });

    return unsubscribe;
  }, [callback, enabled]);
};

/**
 * Hook para suscribirse a un pedido específico
 */
export const useOrderUpdateListener = (orderId, callback, enabled = true) => {
  useEffect(() => {
    if (!enabled || !callback || !orderId) return;

    const unsubscribe = wsService.onOrderUpdate(orderId, (order) => {
      callback(order);
    });

    return unsubscribe;
  }, [orderId, callback, enabled]);
};

/**
 * Hook para suscribirse a actualizaciones del menú
 */
export const useMenuUpdateListener = (callback, enabled = true) => {
  useEffect(() => {
    if (!enabled || !callback) return;

    const unsubscribe = wsService.onMenuUpdate((data) => {
      toast.success('Menú actualizado', {
        icon: '📋',
      });

      callback(data);
    });

    return unsubscribe;
  }, [callback, enabled]);
};

export default useWebSocket;
