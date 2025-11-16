/**
 * Context para gestión del carrito de compras
 * @module context/CartContext
 *
 * Proporciona estado global y funciones para manejar el carrito.
 * Utiliza localStorage para persistencia.
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { saveCart, getCart, clearCart as clearCartStorage } from '../utils/localStorage';
import { validateOrder } from '../utils/validators';
import { formatPrice } from '../utils/formatters';

const CartContext = createContext(null);

/**
 * Provider del contexto de carrito
 */
export const CartProvider = ({ children }) => {
  // Inicializar state directamente con valores del localStorage (lazy initialization)
  const [items, setItems] = useState(() => {
    const savedCart = getCart();
    if (Array.isArray(savedCart)) {
      // Formato viejo
      return savedCart;
    } else if (savedCart && typeof savedCart === 'object') {
      // Formato nuevo
      return savedCart.items || [];
    }
    return [];
  });

  const [tableId, setTableId] = useState(() => {
    const savedCart = getCart();
    if (savedCart && typeof savedCart === 'object' && !Array.isArray(savedCart)) {
      return savedCart.tableId || null;
    }
    return null;
  });

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    console.log('🔍 CartContext: Guardando en localStorage - items:', items.length, 'tableId:', tableId);
    saveCart({ items, tableId });
  }, [items, tableId]);

  /**
   * Agrega un producto al carrito
   */
  const addItem = useCallback((product, quantity = 1, notes = '') => {
    setItems((prevItems) => {
      // Verificar si el producto ya existe con las mismas notas
      const existingIndex = prevItems.findIndex(
        (item) => item.productId === product.id && item.notes === notes
      );

      if (existingIndex >= 0) {
        // Incrementar cantidad si ya existe
        const newItems = [...prevItems];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + quantity,
        };
        return newItems;
      }

      // Agregar nuevo item
      return [
        ...prevItems,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity,
          notes,
          imageUrl: product.imageUrl,
        },
      ];
    });
  }, []);

  /**
   * Actualiza la cantidad de un item
   */
  const updateQuantity = useCallback((productId, notes, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(productId, notes);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId && item.notes === notes
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  }, []);

  /**
   * Actualiza las notas de un item
   */
  const updateNotes = useCallback((productId, oldNotes, newNotes) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId && item.notes === oldNotes
          ? { ...item, notes: newNotes }
          : item
      )
    );
  }, []);

  /**
   * Remueve un item del carrito
   */
  const removeItem = useCallback((productId, notes = '') => {
    setItems((prevItems) =>
      prevItems.filter(
        (item) => !(item.productId === productId && item.notes === notes)
      )
    );
  }, []);

  /**
   * Vacía el carrito completamente
   */
  const clearCart = useCallback(() => {
    setItems([]);
    setTableId(null);
    clearCartStorage();
  }, []);

  /**
   * Establece la mesa del pedido
   */
  const setTable = useCallback((newTableId) => {
    console.log('🔍 CartContext: setTable llamado con:', newTableId);
    setTableId(newTableId);
  }, []);

  /**
   * Calcula el subtotal de un item
   */
  const getItemSubtotal = useCallback((item) => {
    return item.price * item.quantity;
  }, []);

  /**
   * Calcula el total del carrito
   */
  const getTotal = useCallback(() => {
    return items.reduce((total, item) => total + getItemSubtotal(item), 0);
  }, [items, getItemSubtotal]);

  /**
   * Cuenta total de items (considerando cantidades)
   */
  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  /**
   * Verifica si el carrito está vacío
   */
  const isEmpty = items.length === 0;

  /**
   * Obtiene el objeto de pedido listo para enviar al backend
   */
  const getOrderData = useCallback((customerName = '') => {
    const orderData = {
      tableId,
      customerName,
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        notes: item.notes || '',
        unitPrice: item.price,
      })),
      totalAmount: getTotal(),
    };

    console.log('🔍 CartContext: getOrderData - tableId:', tableId, 'orderData:', orderData);

    return orderData;
  }, [items, tableId, getTotal]);

  /**
   * Valida el carrito antes de crear el pedido
   */
  const validate = useCallback(() => {
    const orderData = getOrderData();
    return validateOrder(orderData);
  }, [getOrderData]);

  const value = {
    // Estado
    items,
    tableId,
    isEmpty,

    // Acciones
    addItem,
    updateQuantity,
    updateNotes,
    removeItem,
    clearCart,
    setTable,

    // Cálculos
    getItemSubtotal,
    getTotal,
    getTotalItems,
    getOrderData,
    validate,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

/**
 * Hook para usar el contexto del carrito
 */
export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart debe usarse dentro de CartProvider');
  }

  return context;
};

export default CartContext;
