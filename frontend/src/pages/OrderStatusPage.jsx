/**
 * OrderStatusPage - Página de seguimiento de pedido
 * @page
 *
 * Muestra el estado actual del pedido con actualizaciones en tiempo real.
 */

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, Clock, Loader2, CheckCircle2 } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useOrders } from '../hooks/useOrders';
import { useOrderUpdateListener } from '../hooks/useWebSocket';
import Card, { CardContent } from '../components/ui/Card';
import { OrderStatusBadge } from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { LoadingContainer } from '../components/ui/Spinner';
import { formatPrice, formatTime, formatRelativeTime } from '../utils/formatters';
import { ORDER_STATUS } from '../constants';

const OrderStatusPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { currentOrder, getOrder, loading, error } = useOrders();

  useEffect(() => {
    if (orderId) {
      getOrder(orderId);
    }
  }, [orderId, getOrder]);

  // Escuchar actualizaciones en tiempo real del pedido
  useOrderUpdateListener(
    orderId,
    (updatedOrder) => {
      getOrder(orderId); // Recargar el pedido
    },
    !!orderId
  );

  if (loading) {
    return (
      <Layout>
        <LoadingContainer text="Cargando pedido..." />
      </Layout>
    );
  }

  if (error || !currentOrder) {
    return (
      <Layout>
        <div className="container-custom py-12 text-center">
          <p className="text-red-600 mb-4">
            {error || 'Pedido no encontrado'}
          </p>
          <Button onClick={() => navigate('/')}>Volver al inicio</Button>
        </div>
      </Layout>
    );
  }

  const order = currentOrder;

  // Timeline de estados
  const getStatusStep = (status) => {
    const steps = [
      ORDER_STATUS.PENDING,
      ORDER_STATUS.EN_PREPARACION,
      ORDER_STATUS.LISTO,
      ORDER_STATUS.ENTREGADO,
    ];
    return steps.indexOf(status);
  };

  const currentStep = getStatusStep(order.status);

  const statusSteps = [
    { status: ORDER_STATUS.PENDING, label: 'Recibido', icon: Check },
    { status: ORDER_STATUS.EN_PREPARACION, label: 'En Preparación', icon: Loader2 },
    { status: ORDER_STATUS.LISTO, label: 'Listo', icon: CheckCircle2 },
    { status: ORDER_STATUS.ENTREGADO, label: 'Entregado', icon: CheckCircle2 },
  ];

  return (
    <Layout>
      <div className="container-custom py-6 max-w-2xl">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold mb-2">
            Pedido #{order.id?.substring(0, 8)}
          </h1>

          <p className="text-neutral-600">
            Mesa {order.table?.number || order.tableId}
          </p>

          <p className="text-sm text-neutral-500 mt-1">
            Realizado {formatRelativeTime(order.createdAt)}
          </p>
        </div>

        {/* Estado actual */}
        <Card className="mb-6 text-center bg-primary-50 border-primary-200">
          <div className="mb-3">
            <OrderStatusBadge status={order.status} className="text-base" />
          </div>

          {order.status === ORDER_STATUS.LISTO && (
            <p className="text-primary font-semibold">
              ¡Tu pedido está listo! 🎉
            </p>
          )}

          {order.status === ORDER_STATUS.EN_PREPARACION && (
            <p className="text-neutral-700">
              Estamos preparando tu pedido...
            </p>
          )}

          {order.status === ORDER_STATUS.PENDING && (
            <p className="text-neutral-700">
              Tu pedido ha sido recibido.
            </p>
          )}
        </Card>

        {/* Timeline de estados */}
        <Card className="mb-6">
          <h2 className="font-semibold mb-4">Progreso del Pedido</h2>

          <div className="space-y-4">
            {statusSteps.map((step, index) => {
              const isCompleted = index <= currentStep;
              const isCurrent = index === currentStep;
              const Icon = step.icon;

              return (
                <div key={step.status} className="flex items-center gap-3">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      ${isCompleted ? 'bg-primary text-white' : 'bg-neutral-200 text-neutral-400'}
                      ${isCurrent && step.status === ORDER_STATUS.EN_PREPARACION ? 'animate-pulse' : ''}
                    `}
                  >
                    <Icon className={`w-5 h-5 ${isCurrent && step.status === ORDER_STATUS.EN_PREPARACION ? 'animate-spin' : ''}`} />
                  </div>

                  <div className="flex-1">
                    <p className={`font-medium ${isCompleted ? 'text-neutral-800' : 'text-neutral-400'}`}>
                      {step.label}
                    </p>
                  </div>

                  {isCompleted && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Detalles del pedido */}
        <Card>
          <h2 className="font-semibold mb-4">Detalles del Pedido</h2>

          <div className="space-y-3">
            {order.items?.map((item, index) => (
              <div key={index} className="flex justify-between">
                <div className="flex-1">
                  <p className="font-medium">
                    {item.quantity}x {item.product?.name || 'Producto'}
                  </p>
                  {item.notes && (
                    <p className="text-sm text-neutral-500 italic">
                      Nota: {item.notes}
                    </p>
                  )}
                </div>

                <p className="font-medium">
                  {formatPrice(item.subtotal || item.unitPrice * item.quantity)}
                </p>
              </div>
            ))}

            <div className="border-t pt-3 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-primary">
                {formatPrice(order.totalAmount)}
              </span>
            </div>
          </div>
        </Card>

        {/* Botón de acción */}
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
          >
            Volver al Inicio
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default OrderStatusPage;
