import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  useWebSocket,
  useNewOrderListener,
  useOrderStatusListener,
  useOrderUpdateListener,
  useMenuUpdateListener,
} from './useWebSocket';
import * as wsService from '../services/websocketService';
import toast from 'react-hot-toast';

// Mock websocket service
vi.mock('../services/websocketService', () => ({
  connect: vi.fn(),
  disconnect: vi.fn(),
  isConnected: vi.fn(() => false),
  emit: vi.fn(),
  joinRoom: vi.fn(),
  leaveRoom: vi.fn(),
  onNewOrder: vi.fn(() => vi.fn()),
  onOrderStatusChange: vi.fn(() => vi.fn()),
  onOrderUpdate: vi.fn(() => vi.fn()),
  onMenuUpdate: vi.fn(() => vi.fn()),
}));

// Mock toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
  },
}));

// Mock AuthContext
vi.mock('../context/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    isAuthenticated: true,
  })),
}));

describe('useWebSocket', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should connect automatically when autoConnect is true', () => {
    const mockSocket = { id: 'socket-123' };
    wsService.connect.mockReturnValue(mockSocket);

    renderHook(() => useWebSocket(true));

    expect(wsService.connect).toHaveBeenCalled();
  });

  it('should not connect when autoConnect is false', () => {
    renderHook(() => useWebSocket(false));

    expect(wsService.connect).not.toHaveBeenCalled();
  });

  it('should disconnect on unmount', () => {
    const { unmount } = renderHook(() => useWebSocket(true));

    unmount();

    expect(wsService.disconnect).toHaveBeenCalled();
  });

  it('should provide connect function', () => {
    const mockSocket = { id: 'socket-123' };
    wsService.connect.mockReturnValue(mockSocket);

    const { result } = renderHook(() => useWebSocket(false));

    act(() => {
      result.current.connect();
    });

    expect(wsService.connect).toHaveBeenCalled();
  });

  it('should provide disconnect function', () => {
    const { result } = renderHook(() => useWebSocket(false));

    act(() => {
      result.current.disconnect();
    });

    expect(wsService.disconnect).toHaveBeenCalled();
  });

  it('should provide isConnected function', () => {
    wsService.isConnected.mockReturnValue(true);

    const { result } = renderHook(() => useWebSocket(false));

    const connected = result.current.isConnected();

    expect(connected).toBe(true);
  });

  it('should provide emit function', () => {
    const { result } = renderHook(() => useWebSocket(false));

    act(() => {
      result.current.emit('testEvent', { data: 'test' });
    });

    expect(wsService.emit).toHaveBeenCalledWith('testEvent', { data: 'test' });
  });

  it('should provide joinRoom function', () => {
    const { result } = renderHook(() => useWebSocket(false));

    act(() => {
      result.current.joinRoom('kitchen');
    });

    expect(wsService.joinRoom).toHaveBeenCalledWith('kitchen');
  });

  it('should provide leaveRoom function', () => {
    const { result } = renderHook(() => useWebSocket(false));

    act(() => {
      result.current.leaveRoom('kitchen');
    });

    expect(wsService.leaveRoom).toHaveBeenCalledWith('kitchen');
  });
});

describe('useNewOrderListener', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should subscribe to new order events when enabled', () => {
    const callback = vi.fn();
    const unsubscribe = vi.fn();

    wsService.onNewOrder.mockReturnValue(unsubscribe);

    renderHook(() => useNewOrderListener(callback, true));

    expect(wsService.onNewOrder).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should not subscribe when disabled', () => {
    const callback = vi.fn();

    renderHook(() => useNewOrderListener(callback, false));

    expect(wsService.onNewOrder).not.toHaveBeenCalled();
  });

  it('should not subscribe when callback is null', () => {
    renderHook(() => useNewOrderListener(null, true));

    expect(wsService.onNewOrder).not.toHaveBeenCalled();
  });

  it('should show toast notification on new order', () => {
    const callback = vi.fn();
    let eventCallback;

    wsService.onNewOrder.mockImplementation((cb) => {
      eventCallback = cb;
      return vi.fn();
    });

    renderHook(() => useNewOrderListener(callback, true));

    // Simulate new order event
    act(() => {
      eventCallback({ id: 'order-12345678' });
    });

    expect(toast.success).toHaveBeenCalledWith(
      expect.stringContaining('Nuevo pedido'),
      expect.any(Object)
    );
    expect(callback).toHaveBeenCalledWith({ id: 'order-12345678' });
  });
});

describe('useOrderStatusListener', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should subscribe to order status change events', () => {
    const callback = vi.fn();

    wsService.onOrderStatusChange.mockReturnValue(vi.fn());

    renderHook(() => useOrderStatusListener(callback, true));

    expect(wsService.onOrderStatusChange).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should not subscribe when disabled', () => {
    const callback = vi.fn();

    renderHook(() => useOrderStatusListener(callback, false));

    expect(wsService.onOrderStatusChange).not.toHaveBeenCalled();
  });
});

describe('useOrderUpdateListener', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should subscribe to specific order updates', () => {
    const callback = vi.fn();

    wsService.onOrderUpdate.mockReturnValue(vi.fn());

    renderHook(() => useOrderUpdateListener('order-1', callback, true));

    expect(wsService.onOrderUpdate).toHaveBeenCalledWith('order-1', expect.any(Function));
  });

  it('should not subscribe when disabled', () => {
    const callback = vi.fn();

    renderHook(() => useOrderUpdateListener('order-1', callback, false));

    expect(wsService.onOrderUpdate).not.toHaveBeenCalled();
  });

  it('should not subscribe when orderId is null', () => {
    const callback = vi.fn();

    renderHook(() => useOrderUpdateListener(null, callback, true));

    expect(wsService.onOrderUpdate).not.toHaveBeenCalled();
  });
});

describe('useMenuUpdateListener', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should subscribe to menu update events', () => {
    const callback = vi.fn();
    let eventCallback;

    wsService.onMenuUpdate.mockImplementation((cb) => {
      eventCallback = cb;
      return vi.fn();
    });

    renderHook(() => useMenuUpdateListener(callback, true));

    // Simulate menu update event
    act(() => {
      eventCallback({ updated: true });
    });

    expect(toast.success).toHaveBeenCalledWith('Menú actualizado', expect.any(Object));
    expect(callback).toHaveBeenCalledWith({ updated: true });
  });

  it('should not subscribe when disabled', () => {
    const callback = vi.fn();

    renderHook(() => useMenuUpdateListener(callback, false));

    expect(wsService.onMenuUpdate).not.toHaveBeenCalled();
  });
});
