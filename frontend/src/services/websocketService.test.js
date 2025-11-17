import { describe, it, expect, beforeEach, vi } from 'vitest';
import { io } from 'socket.io-client';

// Mock socket.io-client
vi.mock('socket.io-client', () => ({
  io: vi.fn(),
}));

// Mock localStorage
vi.mock('../utils/localStorage', () => ({
  getToken: vi.fn(() => 'test-token'),
}));

// Mock constants
vi.mock('../constants', () => ({
  WS_URL: 'http://localhost:8080',
  WS_EVENTS: {
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    ERROR: 'error',
    NEW_ORDER: 'newOrder',
    ORDER_STATUS_CHANGE: 'orderStatusChange',
    ORDER_UPDATE: 'orderUpdate',
    MENU_UPDATE: 'menuUpdate',
    PRODUCT_UPDATE: 'productUpdate',
  },
}));

describe('websocketService', () => {
  let mockSocket;
  let websocketService;

  beforeEach(async () => {
    // Clear module cache
    vi.resetModules();

    // Reset mock socket
    mockSocket = {
      id: 'socket-123',
      connected: false,
      on: vi.fn(),
      off: vi.fn(),
      emit: vi.fn(),
      disconnect: vi.fn(),
    };

    io.mockReturnValue(mockSocket);

    // Re-import module after resetting
    websocketService = await import('./websocketService');
  });

  describe('connect', () => {
    it('should connect to WebSocket server with token', () => {
      const socket = websocketService.connect();

      expect(io).toHaveBeenCalledWith('http://localhost:8080', {
        auth: { token: 'test-token' },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      expect(socket).toBe(mockSocket);
      expect(mockSocket.on).toHaveBeenCalledWith('connect', expect.any(Function));
      expect(mockSocket.on).toHaveBeenCalledWith('disconnect', expect.any(Function));
      expect(mockSocket.on).toHaveBeenCalledWith('error', expect.any(Function));
      expect(mockSocket.on).toHaveBeenCalledWith('connect_error', expect.any(Function));
    });

    it('should connect with custom options', () => {
      const customOptions = { reconnectionAttempts: 10 };
      websocketService.connect(customOptions);

      expect(io).toHaveBeenCalledWith(
        'http://localhost:8080',
        expect.objectContaining({
          reconnectionAttempts: 10,
        })
      );
    });

    it('should return existing socket if already connected', () => {
      // First connection
      const socket1 = websocketService.connect();
      mockSocket.connected = true;

      // Second connection should return same socket
      const socket2 = websocketService.connect();

      expect(io).toHaveBeenCalledTimes(1);
      expect(socket2).toBe(socket1);
    });
  });

  describe('disconnect', () => {
    it('should disconnect from WebSocket server', () => {
      websocketService.connect();

      websocketService.disconnect();

      expect(mockSocket.disconnect).toHaveBeenCalled();
    });

    it('should handle disconnect when not connected', () => {
      websocketService.disconnect();
      // Should not throw error
      expect(mockSocket.disconnect).not.toHaveBeenCalled();
    });
  });

  describe('getSocket', () => {
    it('should return socket instance', () => {
      websocketService.connect();

      const socket = websocketService.getSocket();

      expect(socket).toBe(mockSocket);
    });

    it('should return null when not connected', () => {
      const socket = websocketService.getSocket();

      expect(socket).toBeNull();
    });
  });

  describe('isConnected', () => {
    it('should return true when connected', () => {
      websocketService.connect();
      mockSocket.connected = true;

      expect(websocketService.isConnected()).toBe(true);
    });

    it('should return false when not connected', () => {
      websocketService.connect();
      mockSocket.connected = false;

      expect(websocketService.isConnected()).toBe(false);
    });

    it('should return false when socket is null', () => {
      // Don't connect, socket should be null
      const result = websocketService.isConnected();
      expect(result).toBe(false);
    });
  });

  describe('onNewOrder', () => {
    it('should subscribe to new order events', () => {
      websocketService.connect();
      const callback = vi.fn();

      const unsubscribe = websocketService.onNewOrder(callback);

      expect(mockSocket.on).toHaveBeenCalledWith('newOrder', callback);

      unsubscribe();

      expect(mockSocket.off).toHaveBeenCalledWith('newOrder', callback);
    });

    it('should handle subscription when socket not initialized', () => {
      const callback = vi.fn();

      const unsubscribe = websocketService.onNewOrder(callback);

      expect(mockSocket.on).not.toHaveBeenCalled();
      unsubscribe();
    });
  });

  describe('onOrderStatusChange', () => {
    it('should subscribe to order status change events', () => {
      websocketService.connect();
      const callback = vi.fn();

      const unsubscribe = websocketService.onOrderStatusChange(callback);

      expect(mockSocket.on).toHaveBeenCalledWith('orderStatusChange', callback);

      unsubscribe();

      expect(mockSocket.off).toHaveBeenCalledWith('orderStatusChange', callback);
    });

    it('should handle subscription when socket not initialized', () => {
      const callback = vi.fn();

      const unsubscribe = websocketService.onOrderStatusChange(callback);

      expect(mockSocket.on).not.toHaveBeenCalled();
      unsubscribe();
    });
  });

  describe('onOrderUpdate', () => {
    it('should subscribe to specific order updates', () => {
      websocketService.connect();
      const callback = vi.fn();

      const unsubscribe = websocketService.onOrderUpdate('order-1', callback);

      expect(mockSocket.emit).toHaveBeenCalledWith('join_order', 'order-1');
      expect(mockSocket.on).toHaveBeenCalledWith('orderUpdate:order-1', callback);

      unsubscribe();

      expect(mockSocket.emit).toHaveBeenCalledWith('leave_order', 'order-1');
      expect(mockSocket.off).toHaveBeenCalledWith('orderUpdate:order-1', callback);
    });

    it('should handle subscription when socket not initialized', () => {
      const callback = vi.fn();

      const unsubscribe = websocketService.onOrderUpdate('order-1', callback);

      expect(mockSocket.emit).not.toHaveBeenCalled();
      unsubscribe();
    });
  });

  describe('onMenuUpdate', () => {
    it('should subscribe to menu update events', () => {
      websocketService.connect();
      const callback = vi.fn();

      const unsubscribe = websocketService.onMenuUpdate(callback);

      expect(mockSocket.on).toHaveBeenCalledWith('menuUpdate', callback);

      unsubscribe();

      expect(mockSocket.off).toHaveBeenCalledWith('menuUpdate', callback);
    });

    it('should handle subscription when socket not initialized', () => {
      const callback = vi.fn();

      const unsubscribe = websocketService.onMenuUpdate(callback);

      expect(mockSocket.on).not.toHaveBeenCalled();
      unsubscribe();
    });
  });

  describe('onProductUpdate', () => {
    it('should subscribe to product update events', () => {
      websocketService.connect();
      const callback = vi.fn();

      const unsubscribe = websocketService.onProductUpdate(callback);

      expect(mockSocket.on).toHaveBeenCalledWith('productUpdate', callback);

      unsubscribe();

      expect(mockSocket.off).toHaveBeenCalledWith('productUpdate', callback);
    });

    it('should handle subscription when socket not initialized', () => {
      const callback = vi.fn();

      const unsubscribe = websocketService.onProductUpdate(callback);

      expect(mockSocket.on).not.toHaveBeenCalled();
      unsubscribe();
    });
  });

  describe('emit', () => {
    it('should emit event to server', () => {
      websocketService.connect();

      websocketService.emit('customEvent', { data: 'test' });

      expect(mockSocket.emit).toHaveBeenCalledWith('customEvent', { data: 'test' });
    });

    it('should handle emit when socket not initialized', () => {
      websocketService.emit('customEvent', { data: 'test' });

      expect(mockSocket.emit).not.toHaveBeenCalled();
    });
  });

  describe('joinRoom', () => {
    it('should join a room', () => {
      websocketService.connect();

      websocketService.joinRoom('kitchen');

      expect(mockSocket.emit).toHaveBeenCalledWith('join_room', 'kitchen');
    });

    it('should handle join when socket not initialized', () => {
      websocketService.joinRoom('kitchen');

      expect(mockSocket.emit).not.toHaveBeenCalled();
    });
  });

  describe('leaveRoom', () => {
    it('should leave a room', () => {
      websocketService.connect();

      websocketService.leaveRoom('kitchen');

      expect(mockSocket.emit).toHaveBeenCalledWith('leave_room', 'kitchen');
    });

    it('should handle leave when socket not initialized', () => {
      websocketService.leaveRoom('kitchen');

      expect(mockSocket.emit).not.toHaveBeenCalled();
    });
  });
});
