/**
 * CartPage - Página del carrito de compras
 * @page
 *
 * Muestra los productos en el carrito y permite confirmar el pedido.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Trash2, Plus, Minus, Send } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useCart } from '../context/CartContext';
import { useOrders } from '../hooks/useOrders';
import Card, { CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { formatPrice } from '../utils/formatters';
import toast from 'react-hot-toast';

const CartPage = () => {
  const navigate = useNavigate();
  const {
    items,
    isEmpty,
    updateQuantity,
    removeItem,
    getTotal,
    getItemSubtotal,
    getOrderData,
    validate,
    clearCart,
  } = useCart();

  const { createOrder, loading } = useOrders();

  const [customerName, setCustomerName] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleConfirmOrder = async () => {
    // Validar carrito
    const validation = validate();

    if (!validation.valid) {
      validation.errors.forEach(error => toast.error(error));
      return;
    }

    setShowConfirmModal(true);
  };

  const handleSubmitOrder = async () => {
    try {
      const orderData = getOrderData(customerName);
      const order = await createOrder(orderData);

      // Limpiar carrito
      clearCart();

      // Navegar a la página de estado del pedido
      navigate(`/order/${order.id}`);
    } catch (error) {
      // El error ya se muestra en el hook
    } finally {
      setShowConfirmModal(false);
    }
  };

  if (isEmpty) {
    return (
      <Layout>
        <div className="container-custom py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="text-6xl mb-4">🛒</div>

            <h1 className="text-2xl font-bold mb-2">
              Tu carrito está vacío
            </h1>

            <p className="text-neutral-600 mb-6">
              Agrega productos del menú para comenzar tu pedido.
            </p>

            <Button
              variant="primary"
              onClick={() => navigate(-1)}
            >
              Ver Menú
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-custom py-6">
        <h1 className="text-2xl font-bold mb-6">
          Tu Carrito
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de productos */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, index) => (
              <Card key={`${item.productId}-${index}`}>
                <div className="flex gap-4">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}

                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{item.name}</h3>

                    <p className="text-sm text-neutral-600 mb-2">
                      {formatPrice(item.price)} c/u
                    </p>

                    {item.notes && (
                      <p className="text-sm text-neutral-500 italic">
                        Nota: {item.notes}
                      </p>
                    )}

                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.productId, item.notes, item.quantity - 1)}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>

                      <span className="w-12 text-center font-semibold">
                        {item.quantity}
                      </span>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.productId, item.notes, item.quantity + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem(item.productId, item.notes)}
                        className="ml-auto text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-lg">
                      {formatPrice(getItemSubtotal(item))}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Resumen del pedido */}
          <div>
            <Card className="sticky top-20">
              <h2 className="text-xl font-bold mb-4">Resumen</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(getTotal())}</span>
                </div>

                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(getTotal())}</span>
                </div>
              </div>

              <div className="mb-4">
                <Input
                  label="Nombre (opcional)"
                  placeholder="Tu nombre"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              <Button
                variant="primary"
                fullWidth
                size="lg"
                onClick={handleConfirmOrder}
                leftIcon={<Send className="w-5 h-5" />}
              >
                Confirmar Pedido
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Confirmar Pedido"
        footer={
          <div className="flex gap-2 justify-end">
            <Button
              variant="ghost"
              onClick={() => setShowConfirmModal(false)}
              disabled={loading}
            >
              Cancelar
            </Button>

            <Button
              variant="primary"
              onClick={handleSubmitOrder}
              loading={loading}
            >
              Enviar Pedido
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p>
            ¿Estás seguro de que quieres enviar este pedido?
          </p>

          <div className="bg-neutral-50 p-4 rounded-lg">
            <p className="font-semibold mb-2">Resumen:</p>
            <ul className="text-sm space-y-1">
              {items.map((item, index) => (
                <li key={index}>
                  {item.quantity}x {item.name}
                </li>
              ))}
            </ul>

            <p className="font-bold mt-3 text-primary">
              Total: {formatPrice(getTotal())}
            </p>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default CartPage;
