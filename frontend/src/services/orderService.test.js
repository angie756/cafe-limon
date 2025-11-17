import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
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
} from './orderService';
import * as api from './api';

// Mock API functions
vi.mock('./api', () => ({
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
}));

// Mock constants
vi.mock('../constants', () => ({
  ORDER_STATUS: {
    PENDING: 'PENDING',
    EN_PREPARACION: 'EN_PREPARACION',
    LISTO: 'LISTO',
    ENTREGADO: 'ENTREGADO',
    CANCELADO: 'CANCELADO',
  },
}));

describe('orderService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should create a new order', async () => {
      const orderData = {
        tableId: 'table-1',
        items: [{ productId: 'prod-1', quantity: 2 }],
        customerName: 'Juan',
      };

      const createdOrder = { id: 'order-1', ...orderData };

      api.post.mockResolvedValue(createdOrder);

      const result = await createOrder(orderData);

      expect(api.post).toHaveBeenCalledWith('/orders', orderData);
      expect(result).toEqual(createdOrder);
    });
  });

  describe('getOrderById', () => {
    it('should fetch order by ID', async () => {
      const order = { id: 'order-1', status: 'PENDING' };

      api.get.mockResolvedValue(order);

      const result = await getOrderById('order-1');

      expect(api.get).toHaveBeenCalledWith('/orders/order-1');
      expect(result).toEqual(order);
    });
  });

  describe('getActiveOrders', () => {
    it('should fetch active orders with default params', async () => {
      const orders = [
        { id: 'order-1', status: 'PENDING' },
        { id: 'order-2', status: 'EN_PREPARACION' },
      ];

      api.get.mockResolvedValue(orders);

      const result = await getActiveOrders();

      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('/orders/active')
      );
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('status=PENDING')
      );
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('status=EN_PREPARACION')
      );
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('status=LISTO')
      );
      expect(result).toEqual(orders);
    });

    it('should fetch active orders with custom status', async () => {
      const orders = [{ id: 'order-1', status: 'PENDING' }];

      api.get.mockResolvedValue(orders);

      const result = await getActiveOrders({ status: 'PENDING' });

      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('status=PENDING')
      );
      expect(result).toEqual(orders);
    });
  });

  describe('getOrders', () => {
    it('should fetch orders with no params', async () => {
      const orders = { orders: [], total: 0, page: 1 };

      api.get.mockResolvedValue(orders);

      const result = await getOrders();

      expect(api.get).toHaveBeenCalledWith('/orders?');
      expect(result).toEqual(orders);
    });

    it('should fetch orders with all params', async () => {
      const orders = { orders: [], total: 0, page: 1 };

      api.get.mockResolvedValue(orders);

      const result = await getOrders({
        status: 'ENTREGADO',
        tableId: 'table-1',
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        page: 2,
        pageSize: 20,
      });

      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('status=ENTREGADO')
      );
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('tableId=table-1')
      );
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('startDate=2024-01-01')
      );
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('endDate=2024-01-31')
      );
      expect(api.get).toHaveBeenCalledWith(expect.stringContaining('page=2'));
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('pageSize=20')
      );
      expect(result).toEqual(orders);
    });
  });

  describe('getOrdersByTable', () => {
    it('should fetch orders by table with activeOnly=true', async () => {
      const orders = [{ id: 'order-1', tableId: 'table-1' }];

      api.get.mockResolvedValue(orders);

      const result = await getOrdersByTable('table-1');

      expect(api.get).toHaveBeenCalledWith('/tables/table-1/orders?activeOnly=true');
      expect(result).toEqual(orders);
    });

    it('should fetch orders by table with activeOnly=false', async () => {
      const orders = [{ id: 'order-1', tableId: 'table-1' }];

      api.get.mockResolvedValue(orders);

      const result = await getOrdersByTable('table-1', false);

      expect(api.get).toHaveBeenCalledWith('/tables/table-1/orders');
      expect(result).toEqual(orders);
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status', async () => {
      const updatedOrder = { id: 'order-1', status: 'LISTO' };

      api.patch.mockResolvedValue(updatedOrder);

      const result = await updateOrderStatus('order-1', 'LISTO');

      expect(api.patch).toHaveBeenCalledWith('/orders/order-1/status', {
        status: 'LISTO',
      });
      expect(result).toEqual(updatedOrder);
    });
  });

  describe('startPreparingOrder', () => {
    it('should mark order as en preparacion', async () => {
      const updatedOrder = { id: 'order-1', status: 'EN_PREPARACION' };

      api.patch.mockResolvedValue(updatedOrder);

      const result = await startPreparingOrder('order-1');

      expect(api.patch).toHaveBeenCalledWith('/orders/order-1/status', {
        status: 'EN_PREPARACION',
      });
      expect(result).toEqual(updatedOrder);
    });
  });

  describe('markOrderReady', () => {
    it('should mark order as ready', async () => {
      const updatedOrder = { id: 'order-1', status: 'LISTO' };

      api.patch.mockResolvedValue(updatedOrder);

      const result = await markOrderReady('order-1');

      expect(api.patch).toHaveBeenCalledWith('/orders/order-1/status', {
        status: 'LISTO',
      });
      expect(result).toEqual(updatedOrder);
    });
  });

  describe('markOrderDelivered', () => {
    it('should mark order as delivered', async () => {
      const updatedOrder = { id: 'order-1', status: 'ENTREGADO' };

      api.patch.mockResolvedValue(updatedOrder);

      const result = await markOrderDelivered('order-1');

      expect(api.patch).toHaveBeenCalledWith('/orders/order-1/status', {
        status: 'ENTREGADO',
      });
      expect(result).toEqual(updatedOrder);
    });
  });

  describe('cancelOrder', () => {
    it('should cancel order with reason', async () => {
      const canceledOrder = { id: 'order-1', status: 'CANCELADO' };

      api.patch.mockResolvedValue(canceledOrder);

      const result = await cancelOrder('order-1', 'Customer request');

      expect(api.patch).toHaveBeenCalledWith('/orders/order-1/cancel', {
        reason: 'Customer request',
      });
      expect(result).toEqual(canceledOrder);
    });

    it('should cancel order without reason', async () => {
      const canceledOrder = { id: 'order-1', status: 'CANCELADO' };

      api.patch.mockResolvedValue(canceledOrder);

      const result = await cancelOrder('order-1');

      expect(api.patch).toHaveBeenCalledWith('/orders/order-1/cancel', {
        reason: '',
      });
      expect(result).toEqual(canceledOrder);
    });
  });

  describe('getOrderStats', () => {
    it('should fetch order stats with no params', async () => {
      const stats = { totalOrders: 100, totalRevenue: 500000 };

      api.get.mockResolvedValue(stats);

      const result = await getOrderStats();

      expect(api.get).toHaveBeenCalledWith('/orders/stats?');
      expect(result).toEqual(stats);
    });

    it('should fetch order stats with date range', async () => {
      const stats = { totalOrders: 50, totalRevenue: 250000 };

      api.get.mockResolvedValue(stats);

      const result = await getOrderStats({
        startDate: '2024-01-01',
        endDate: '2024-01-31',
      });

      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('startDate=2024-01-01')
      );
      expect(api.get).toHaveBeenCalledWith(
        expect.stringContaining('endDate=2024-01-31')
      );
      expect(result).toEqual(stats);
    });
  });

  describe('getAveragePreparationTime', () => {
    it('should fetch average preparation time', async () => {
      const stats = { averageTime: 15, byCategory: {} };

      api.get.mockResolvedValue(stats);

      const result = await getAveragePreparationTime();

      expect(api.get).toHaveBeenCalledWith('/orders/stats/preparation-time');
      expect(result).toEqual(stats);
    });
  });

  describe('getTopProducts', () => {
    it('should fetch top products with default limit', async () => {
      const products = [
        { productId: 'prod-1', name: 'Cafe', totalSold: 100 },
      ];

      api.get.mockResolvedValue(products);

      const result = await getTopProducts();

      expect(api.get).toHaveBeenCalledWith('/orders/stats/top-products?limit=10');
      expect(result).toEqual(products);
    });

    it('should fetch top products with custom limit', async () => {
      const products = [
        { productId: 'prod-1', name: 'Cafe', totalSold: 100 },
      ];

      api.get.mockResolvedValue(products);

      const result = await getTopProducts(5);

      expect(api.get).toHaveBeenCalledWith('/orders/stats/top-products?limit=5');
      expect(result).toEqual(products);
    });
  });
});
