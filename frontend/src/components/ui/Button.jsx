/**
 * Componente Button - Botón reutilizable
 * @component
 *
 * Botón con variantes, tamaños y estados.
 * Utiliza las clases de Tailwind definidas en index.css
 */

import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * @typedef {'primary'|'secondary'|'outline'|'ghost'|'danger'} ButtonVariant
 * @typedef {'sm'|'md'|'lg'} ButtonSize
 */

/**
 * @param {Object} props
 * @param {ButtonVariant} [props.variant='primary'] - Variante del botón
 * @param {ButtonSize} [props.size='md'] - Tamaño del botón
 * @param {boolean} [props.loading=false] - Estado de carga
 * @param {boolean} [props.disabled=false] - Estado deshabilitado
 * @param {boolean} [props.fullWidth=false] - Ancho completo
 * @param {React.ReactNode} [props.leftIcon] - Icono izquierdo
 * @param {React.ReactNode} [props.rightIcon] - Icono derecho
 * @param {React.ReactNode} props.children - Contenido del botón
 * @param {string} [props.className] - Clases adicionales
 */
const Button = forwardRef(({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  type = 'button',
  ...props
}, ref) => {
  // Clases base
  const baseClasses = 'btn';

  // Variantes
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:ring-red-400 shadow-sm hover:shadow-md',
  };

  // Tamaños
  const sizeClasses = {
    sm: 'btn-sm',
    md: '', // tamaño por defecto
    lg: 'btn-lg',
  };

  // Ancho completo
  const widthClass = fullWidth ? 'w-full' : '';

  // Estado de carga o disabled
  const isDisabled = disabled || loading;

  const classes = [
    baseClasses,
    variantClasses[variant] || variantClasses.primary,
    sizeClasses[size],
    widthClass,
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      className={classes}
      {...props}
    >
      {loading && (
        <Loader2 className="w-4 h-4 animate-spin" />
      )}

      {!loading && leftIcon && (
        <span className="inline-flex">{leftIcon}</span>
      )}

      <span>{children}</span>

      {!loading && rightIcon && (
        <span className="inline-flex">{rightIcon}</span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
