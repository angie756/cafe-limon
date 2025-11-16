/**
 * Componente Card - Tarjeta contenedora reutilizable
 * @component
 *
 * Card con variantes y padding personalizable.
 */

import { forwardRef } from 'react';

/**
 * @param {Object} props
 * @param {'default'|'hover'|'interactive'} [props.variant='default'] - Variante de la card
 * @param {'sm'|'md'|'lg'|'none'} [props.padding='md'] - Padding de la card
 * @param {boolean} [props.bordered=true] - Mostrar borde
 * @param {React.ReactNode} props.children - Contenido de la card
 * @param {string} [props.className] - Clases adicionales
 */
const Card = forwardRef(({
  variant = 'default',
  padding = 'md',
  bordered = true,
  children,
  className = '',
  ...props
}, ref) => {
  // Clases base
  const baseClasses = 'bg-white rounded-lg shadow-soft transition-shadow duration-200';

  // Variantes
  const variantClasses = {
    default: '',
    hover: 'card-hover',
    interactive: 'card-interactive',
  };

  // Padding
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4 md:p-6',
    lg: 'p-6 md:p-8',
  };

  // Borde
  const borderClass = bordered ? 'border border-neutral-200' : '';

  const classes = [
    baseClasses,
    variantClasses[variant],
    paddingClasses[padding],
    borderClass,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div
      ref={ref}
      className={classes}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

/**
 * Card Header - Cabecera de la card
 */
export const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`mb-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Card Title - Título de la card
 */
export const CardTitle = ({ children, className = '', ...props }) => {
  return (
    <h3
      className={`text-lg font-semibold text-neutral-800 ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
};

/**
 * Card Description - Descripción de la card
 */
export const CardDescription = ({ children, className = '', ...props }) => {
  return (
    <p
      className={`text-sm text-neutral-500 mt-1 ${className}`}
      {...props}
    >
      {children}
    </p>
  );
};

/**
 * Card Content - Contenido principal de la card
 */
export const CardContent = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Card Footer - Pie de la card
 */
export const CardFooter = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`mt-4 pt-4 border-t border-neutral-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
