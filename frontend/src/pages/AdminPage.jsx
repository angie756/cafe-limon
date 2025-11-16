/**
 * AdminPage - Panel de administración
 * @page
 *
 * Panel principal para administradores del café.
 * Muestra estadísticas y acceso a gestión de productos, categorías y mesas.
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Layers, Table2, TrendingUp, Users, Clock, CheckCircle } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Card, { CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { OrderStatusBadge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../hooks/useOrders';
import { LoadingContainer } from '../components/ui/Spinner';
import { formatPrice } from '../utils/formatters';
import { ORDER_STATUS } from '../constants';

const AdminPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { orders, getActiveOrders, getAllOrders, markDelivered, loading } = useOrders();
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeOrders: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    // Cargar todos los pedidos para estadísticas
    getAllOrders();
  }, [getAllOrders]);

  useEffect(() => {
    if (orders && orders.length > 0) {
      const activeCount = orders.filter(o =>
        ['PENDING', 'EN_PREPARACION', 'LISTO'].includes(o.status)
      ).length;

      // Calcular ingresos solo de pedidos de hoy (ENTREGADO)
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayRevenue = orders
        .filter(order => {
          const orderDate = new Date(order.createdAt);
          orderDate.setHours(0, 0, 0, 0);
          return orderDate.getTime() === today.getTime() && order.status === ORDER_STATUS.ENTREGADO;
        })
        .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

      setStats({
        totalOrders: orders.length,
        activeOrders: activeCount,
        totalRevenue: todayRevenue,
      });
    }
  }, [orders]);

  const handleMarkDelivered = async (orderId) => {
    try {
      await markDelivered(orderId);
      await getAllOrders(); // Recargar pedidos
    } catch (error) {
      // Error ya manejado en el hook
    }
  };

  if (loading && orders.length === 0) {
    return (
      <Layout>
        <LoadingContainer text="Cargando panel de administración..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-custom py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Panel de Administración</h1>
          <p className="text-neutral-600">
            Bienvenido de vuelta, <strong>{user?.username}</strong>
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Pedidos Activos</p>
                  <p className="text-3xl font-bold text-primary">{stats.activeOrders}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Total Pedidos</p>
                  <p className="text-3xl font-bold text-primary">{stats.totalOrders}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Ingresos Hoy</p>
                  <p className="text-3xl font-bold text-primary">{formatPrice(stats.totalRevenue)}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Acciones Rápidas */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Gestión</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-auto py-6 flex-col gap-3"
              onClick={() => alert('Gestión de productos - Por implementar')}
            >
              <Package className="w-8 h-8" />
              <span>Productos</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-6 flex-col gap-3"
              onClick={() => alert('Gestión de categorías - Por implementar')}
            >
              <Layers className="w-8 h-8" />
              <span>Categorías</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-6 flex-col gap-3"
              onClick={() => navigate('/tables')}
            >
              <Table2 className="w-8 h-8" />
              <span>Mesas</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-6 flex-col gap-3"
              onClick={() => alert('Gestión de usuarios - Por implementar')}
            >
              <Users className="w-8 h-8" />
              <span>Usuarios</span>
            </Button>
          </div>
        </div>

        {/* Pedidos Recientes */}
        <div>
          <h2 className="text-xl font-bold mb-4">Pedidos Recientes</h2>
          {orders && orders.length > 0 ? (
            <div className="grid gap-4">
              {orders.slice(0, 10).map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-semibold">Pedido #{order.id.substring(0, 8)}</p>
                        <p className="text-sm text-neutral-600">
                          Mesa {order.table?.number || 'N/A'} - {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{formatPrice(order.totalAmount || 0)}</p>
                        <OrderStatusBadge status={order.status} />
                      </div>
                      {order.status === ORDER_STATUS.LISTO && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleMarkDelivered(order.id)}
                          leftIcon={<CheckCircle className="w-4 h-4" />}
                        >
                          Marcar Entregado
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-neutral-600">
                No hay pedidos recientes
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminPage;
