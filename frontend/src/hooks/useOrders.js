/**
 * Hook personalizado para gestión de pedidos
 * @module hooks/useOrders
 *
 * Proporciona funciones y estado para manejar pedidos.
 */

import { useState, useCallback } from 'react';
import * as orderService from '../services/orderService';
import toast from 'react-hot-toast';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../constants';

/**
 * Hook para gestionar pedidos
 */
export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Crea un nuevo pedido
   */
  const createOrder = useCallback(async (orderData) => {
    setLoading(true);
    setError(null);

    try {
      const order = await orderService.createOrder(orderData);
      setCurrentOrder(order);
      toast.success(SUCCESS_MESSAGES.ORDER_CREATED);
      return order;
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
   * Obtiene un pedido por ID
   */
  const getOrder = useCallback(async (orderId) => {
    setLoading(true);
    setError(null);

    try {
      const order = await orderService.getOrderById(orderId);
      setCurrentOrder(order);
      return order;
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
   * Obtiene pedidos activos (cocina)
   */
  const getActiveOrders = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const activeOrders = await orderService.getActiveOrders(params);
      setOrders(activeOrders);
      return activeOrders;
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
   * Obtiene todos los pedidos con paginación (admin)
   */
  const getAllOrders = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const result = await orderService.getOrders(params);
      setOrders(result.orders || result);
      return result;
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
   * Actualiza el estado de un pedido
   */
  const updateOrderStatus = useCallback(async (orderId, newStatus) => {
    setLoading(true);
    setError(null);

    try {
      const updatedOrder = await orderService.updateOrderStatus(orderId, newStatus);

      // Actualizar en la lista local
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? updatedOrder : order))
      );

      // Actualizar el pedido actual si es el mismo
      if (currentOrder?.id === orderId) {
        setCurrentOrder(updatedOrder);
      }

      toast.success(SUCCESS_MESSAGES.ORDER_UPDATED);
      return updatedOrder;
    } catch (err) {
      const errorMessage = err.message || ERROR_MESSAGES.SERVER_ERROR;
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentOrder]);

  /**
   * Marca un pedido como "En Preparación"
   */
  const startPreparing = useCallback(async (orderId) => {
    return updateOrderStatus(orderId, 'EN_PREPARACION');
  }, [updateOrderStatus]);

  /**
   * Marca un pedido como "Listo"
   */
  const markReady = useCallback(async (orderId) => {
    return updateOrderStatus(orderId, 'LISTO');
  }, [updateOrderStatus]);

  /**
   * Marca un pedido como "Entregado"
   */
  const markDelivered = useCallback(async (orderId) => {
    return updateOrderStatus(orderId, 'ENTREGADO');
  }, [updateOrderStatus]);

  /**
   * Cancela un pedido
   */
  const cancelOrder = useCallback(async (orderId, reason = '') => {
    setLoading(true);
    setError(null);

    try {
      const cancelledOrder = await orderService.cancelOrder(orderId, reason);

      // Actualizar en la lista local
      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? cancelledOrder : order))
      );

      toast.success('Pedido cancelado');
      return cancelledOrder;
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
   * Limpia el pedido actual
   */
  const clearCurrentOrder = useCallback(() => {
    setCurrentOrder(null);
  }, []);

  return {
    // Estado
    orders,
    currentOrder,
    loading,
    error,

    // Acciones
    createOrder,
    getOrder,
    getActiveOrders,
    getAllOrders,
    updateOrderStatus,
    startPreparing,
    markReady,
    markDelivered,
    cancelOrder,
    clearCurrentOrder,
  };
};

export default useOrders;
