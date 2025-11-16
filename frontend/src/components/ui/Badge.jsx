/**
 * Componente Badge - Insignia/etiqueta reutilizable
 * @component
 *
 * Badge para mostrar estados, categorías, o información destacada.
 */

import { ORDER_STATUS } from '../../constants';

/**
 * @typedef {'pending'|'preparing'|'ready'|'delivered'|'cancelled'|'default'|'success'|'warning'|'error'|'info'} BadgeVariant
 */

/**
 * @param {Object} props
 * @param {BadgeVariant} [props.variant='default'] - Variante del badge
 * @param {React.ReactNode} props.children - Contenido del badge
 * @param {string} [props.className] - Clases adicionales
 */
const Badge = ({
  variant = 'default',
  children,
  className = '',
  ...props
}) => {
  // Clases base
  const baseClasses = 'badge';

  // Variantes
  const variantClasses = {
    // Estados de pedidos
    pending: 'badge-pending',
    preparing: 'badge-preparing',
    ready: 'badge-ready',
    delivered: 'badge-delivered',
    cancelled: 'badge-cancelled',

    // Estados generales
    default: 'bg-neutral-100 text-neutral-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  const classes = [
    baseClasses,
    variantClasses[variant] || variantClasses.default,
    className,
  ].filter(Boolean).join(' ');

  return (
    <span
      className={classes}
      {...props}
    >
      {children}
    </span>
  );
};

/**
 * Badge para estado de pedido
 * Mapea automáticamente el estado a la variante correcta
 */
export const OrderStatusBadge = ({ status, className = '', ...props }) => {
  const variantMap = {
    [ORDER_STATUS.PENDING]: 'pending',
    [ORDER_STATUS.EN_PREPARACION]: 'preparing',
    [ORDER_STATUS.LISTO]: 'ready',
    [ORDER_STATUS.ENTREGADO]: 'delivered',
    [ORDER_STATUS.CANCELADO]: 'cancelled',
  };

  const labelMap = {
    [ORDER_STATUS.PENDING]: 'Pendiente',
    [ORDER_STATUS.EN_PREPARACION]: 'En Preparación',
    [ORDER_STATUS.LISTO]: 'Listo',
    [ORDER_STATUS.ENTREGADO]: 'Entregado',
    [ORDER_STATUS.CANCELADO]: 'Cancelado',
  };

  return (
    <Badge
      variant={variantMap[status] || 'default'}
      className={className}
      {...props}
    >
      {labelMap[status] || status}
    </Badge>
  );
};

export default Badge;
