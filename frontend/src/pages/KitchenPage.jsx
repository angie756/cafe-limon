/**
 * KitchenPage - Panel de cocina
 * @page
 *
 * Panel para el personal de cocina que muestra pedidos activos
 * y permite actualizar su estado en tiempo real.
 */

import { useEffect } from 'react';
import { useOrders } from '../hooks/useOrders';
import { useNewOrderListener } from '../hooks/useWebSocket';
import Layout from '../components/layout/Layout';
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { OrderStatusBadge } from '../components/ui/Badge';
import { LoadingContainer } from '../components/ui/Spinner';
import { formatPrice, formatRelativeTime } from '../utils/formatters';
import { ORDER_STATUS } from '../constants';
import { Clock, ChefHat, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const KitchenPage = () => {
  const {
    orders,
    getActiveOrders,
    startPreparing,
    markReady,
    loading,
  } = useOrders();

  useEffect(() => {
    getActiveOrders();
  }, [getActiveOrders]);

  // Escuchar nuevos pedidos
  useNewOrderListener(
    (newOrder) => {
      getActiveOrders(); // Recargar lista
    },
    true
  );

  const handleStartPreparing = async (orderId) => {
    try {
      await startPreparing(orderId);
      await getActiveOrders();
    } catch (error) {
      // Error ya manejado en el hook
    }
  };

  const handleMarkReady = async (orderId) => {
    try {
      await markReady(orderId);
      await getActiveOrders();
      toast.success('Pedido marcado como listo');
    } catch (error) {
      // Error ya manejado en el hook
    }
  };

  // Ordenar pedidos por antigüedad
  const sortedOrders = [...(orders || [])].sort((a, b) => {
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  // Separar por estado
  const pendingOrders = sortedOrders.filter(o => o.status === ORDER_STATUS.PENDING);
  const preparingOrders = sortedOrders.filter(o => o.status === ORDER_STATUS.EN_PREPARACION);
  const readyOrders = sortedOrders.filter(o => o.status === ORDER_STATUS.LISTO);

  if (loading && orders.length === 0) {
    return (
      <Layout>
        <LoadingContainer text="Cargando pedidos..." />
      </Layout>
    );
  }

  return (
    <Layout showFooter={false}>
      <div className="bg-neutral-50 min-h-screen">
        <div className="container-custom py-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Panel de Cocina</h1>
                <p className="text-neutral-600">
                  {sortedOrders.length} pedidos activos
                </p>
              </div>

              <Button
                variant="outline"
                onClick={() => getActiveOrders()}
                disabled={loading}
              >
                Actualizar
              </Button>
            </div>
          </div>

          {/* Columnas de pedidos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pendientes */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <h2 className="font-bold">Pendientes ({pendingOrders.length})</h2>
              </div>

              <div className="space-y-4">
                {pendingOrders.map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onAction={() => handleStartPreparing(order.id)}
                    actionLabel="Iniciar Preparación"
                    actionIcon={<ChefHat className="w-4 h-4" />}
                  />
                ))}

                {pendingOrders.length === 0 && (
                  <EmptyState message="No hay pedidos pendientes" />
                )}
              </div>
            </div>

            {/* En Preparación */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <h2 className="font-bold">En Preparación ({preparingOrders.length})</h2>
              </div>

              <div className="space-y-4">
                {preparingOrders.map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onAction={() => handleMarkReady(order.id)}
                    actionLabel="Marcar como Listo"
                    actionIcon={<CheckCircle2 className="w-4 h-4" />}
                    actionVariant="secondary"
                  />
                ))}

                {preparingOrders.length === 0 && (
                  <EmptyState message="No hay pedidos en preparación" />
                )}
              </div>
            </div>

            {/* Listos */}
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <h2 className="font-bold">Listos ({readyOrders.length})</h2>
              </div>

              <div className="space-y-4">
                {readyOrders.map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    showAction={false}
                  />
                ))}

                {readyOrders.length === 0 && (
                  <EmptyState message="No hay pedidos listos" />
                )}
              </div>
            </div>
          </div>

          {sortedOrders.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✨</div>
              <h3 className="text-xl font-semibold mb-2">
                No hay pedidos activos
              </h3>
              <p className="text-neutral-600">
                Los nuevos pedidos aparecerán aquí automáticamente.
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

// Componente para cada tarjeta de pedido
const OrderCard = ({
  order,
  onAction,
  actionLabel,
  actionIcon,
  actionVariant = 'primary',
  showAction = true,
}) => {
  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">
              Pedido #{order.id?.substring(0, 8)}
            </CardTitle>
            <p className="text-sm text-neutral-600">
              Mesa {order.table?.number || order.tableId}
            </p>
          </div>

          <OrderStatusBadge status={order.status} />
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-2 mb-3">
          {order.items?.map((item, index) => (
            <div key={index}>
              <p className="font-medium">
                {item.quantity}x {item.product?.name || 'Producto'}
              </p>
              {item.notes && (
                <p className="text-sm text-neutral-500 bg-yellow-50 p-2 rounded mt-1">
                  📝 {item.notes}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <Clock className="w-4 h-4" />
          <span>{formatRelativeTime(order.createdAt)}</span>
        </div>
      </CardContent>

      {showAction && (
        <CardFooter>
          <Button
            variant={actionVariant}
            fullWidth
            onClick={onAction}
            leftIcon={actionIcon}
          >
            {actionLabel}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

// Componente para estado vacío
const EmptyState = ({ message }) => {
  return (
    <div className="text-center py-8 text-neutral-400">
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default KitchenPage;
