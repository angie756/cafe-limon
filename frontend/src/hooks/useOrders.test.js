import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useOrders } from './useOrders';
import * as orderService from '../services/orderService';
import toast from 'react-hot-toast';

// Mock orderService
vi.mock('../services/orderService');

// Mock toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock constants
vi.mock('../constants', () => ({
  API_URL: 'http://localhost:8080/api',
  WS_URL: 'http://localhost:8080',
  SUCCESS_MESSAGES: {
    ORDER_CREATED: 'Pedido creado exitosamente',
    ORDER_UPDATED: 'Pedido actualizado',
  },
  ERROR_MESSAGES: {
    SERVER_ERROR: 'Error del servidor',
    NOT_FOUND: 'No encontrado',
    UNAUTHORIZED: 'No autorizado',
    VALIDATION_ERROR: 'Error de validación',
    NETWORK_ERROR: 'Error de red',
  },
  ORDER_STATUS: {
    PENDING: 'PENDING',
    EN_PREPARACION: 'EN_PREPARACION',
    LISTO: 'LISTO',
    ENTREGADO: 'ENTREGADO',
    CANCELADO: 'CANCELADO',
  },
  CACHE_KEYS: {
    CART: 'cart',
    TOKEN: 'token',
    USER: 'user',
  },
  WS_EVENTS: {},
}));

describe('useOrders', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useOrders());

    expect(result.current.orders).toEqual([]);
    expect(result.current.currentOrder).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  describe('createOrder', () => {
    it('should create order successfully', async () => {
      const orderData = {
        tableId: 'table-1',
        items: [{ productId: 'prod-1', quantity: 2 }],
      };
      const createdOrder = { id: 'order-1', ...orderData };

      orderService.createOrder.mockResolvedValue(createdOrder);

      const { result } = renderHook(() => useOrders());

      await act(async () => {
        await result.current.createOrder(orderData);
      });

      expect(result.current.currentOrder).toEqual(createdOrder);
      expect(toast.success).toHaveBeenCalledWith('Pedido creado exitosamente');
    });

    it('should handle errors when creating order', async () => {
      const error = new Error('Failed');
      orderService.createOrder.mockRejectedValue(error);

      const { result } = renderHook(() => useOrders());

      await act(async () => {
        try {
          await result.current.createOrder({});
        } catch (e) {
          // Expected
        }
      });

      expect(result.current.error).toBe('Failed');
      expect(toast.error).toHaveBeenCalled();
    });
  });

  describe('getOrder', () => {
    it('should get order by ID', async () => {
      const order = { id: 'order-1', status: 'PENDING' };

      orderService.getOrderById.mockResolvedValue(order);

      const { result } = renderHook(() => useOrders());

      await act(async () => {
        await result.current.getOrder('order-1');
      });

      expect(result.current.currentOrder).toEqual(order);
    });
  });

  describe('getActiveOrders', () => {
    it('should get active orders', async () => {
      const orders = [
        { id: 'order-1', status: 'PENDING' },
        { id: 'order-2', status: 'EN_PREPARACION' },
      ];

      orderService.getActiveOrders.mockResolvedValue(orders);

      const { result } = renderHook(() => useOrders());

      await act(async () => {
        await result.current.getActiveOrders();
      });

      expect(result.current.orders).toEqual(orders);
    });
  });

  describe('getAllOrders', () => {
    it('should get all orders with pagination', async () => {
      const result_data = {
        orders: [{ id: 'order-1' }],
        total: 1,
        page: 1,
      };

      orderService.getOrders.mockResolvedValue(result_data);

      const { result } = renderHook(() => useOrders());

      await act(async () => {
        await result.current.getAllOrders();
      });

      expect(result.current.orders).toEqual(result_data.orders);
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status and update list', async () => {
      const updatedOrder = { id: 'order-1', status: 'LISTO' };

      orderService.updateOrderStatus.mockResolvedValue(updatedOrder);

      const { result } = renderHook(() => useOrders());

      // Set initial orders
      act(() => {
        result.current.orders.push({ id: 'order-1', status: 'PENDING' });
      });

      await act(async () => {
        await result.current.updateOrderStatus('order-1', 'LISTO');
      });

      expect(toast.success).toHaveBeenCalledWith('Pedido actualizado');
    });

    it('should update currentOrder if same ID', async () => {
      const updatedOrder = { id: 'order-1', status: 'LISTO' };

      orderService.updateOrderStatus.mockResolvedValue(updatedOrder);

      const { result } = renderHook(() => useOrders());

      // Set current order
      act(() => {
        result.current.currentOrder = { id: 'order-1', status: 'PENDING' };
      });

      await act(async () => {
        await result.current.updateOrderStatus('order-1', 'LISTO');
      });

      expect(result.current.currentOrder).toEqual(updatedOrder);
    });
  });

  describe('status change helpers', () => {
    it('should mark order as preparing', async () => {
      const updatedOrder = { id: 'order-1', status: 'EN_PREPARACION' };

      orderService.updateOrderStatus.mockResolvedValue(updatedOrder);

      const { result } = renderHook(() => useOrders());

      await act(async () => {
        await result.current.startPreparing('order-1');
      });

      expect(orderService.updateOrderStatus).toHaveBeenCalledWith('order-1', 'EN_PREPARACION');
    });

    it('should mark order as ready', async () => {
      const updatedOrder = { id: 'order-1', status: 'LISTO' };

      orderService.updateOrderStatus.mockResolvedValue(updatedOrder);

      const { result } = renderHook(() => useOrders());

      await act(async () => {
        await result.current.markReady('order-1');
      });

      expect(orderService.updateOrderStatus).toHaveBeenCalledWith('order-1', 'LISTO');
    });

    it('should mark order as delivered', async () => {
      const updatedOrder = { id: 'order-1', status: 'ENTREGADO' };

      orderService.updateOrderStatus.mockResolvedValue(updatedOrder);

      const { result } = renderHook(() => useOrders());

      await act(async () => {
        await result.current.markDelivered('order-1');
      });

      expect(orderService.updateOrderStatus).toHaveBeenCalledWith('order-1', 'ENTREGADO');
    });
  });

  describe('cancelOrder', () => {
    it('should cancel order with reason', async () => {
      const cancelledOrder = { id: 'order-1', status: 'CANCELADO' };

      orderService.cancelOrder.mockResolvedValue(cancelledOrder);

      const { result } = renderHook(() => useOrders());

      await act(async () => {
        await result.current.cancelOrder('order-1', 'Customer request');
      });

      expect(toast.success).toHaveBeenCalledWith('Pedido cancelado');
    });
  });

  describe('clearCurrentOrder', () => {
    it('should clear current order', () => {
      const { result } = renderHook(() => useOrders());

      act(() => {
        result.current.currentOrder = { id: 'order-1' };
      });

      act(() => {
        result.current.clearCurrentOrder();
      });

      expect(result.current.currentOrder).toBeNull();
    });
  });
});
