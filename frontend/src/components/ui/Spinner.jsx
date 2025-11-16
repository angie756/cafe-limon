/**
 * Componente Spinner - Indicador de carga
 * @component
 *
 * Spinner animado para estados de carga.
 */

import { Loader2 } from 'lucide-react';

/**
 * @typedef {'sm'|'md'|'lg'|'xl'} SpinnerSize
 */

/**
 * @param {Object} props
 * @param {SpinnerSize} [props.size='md'] - Tamaño del spinner
 * @param {string} [props.className] - Clases adicionales
 * @param {string} [props.text] - Texto a mostrar junto al spinner
 */
const Spinner = ({
  size = 'md',
  className = '',
  text,
  ...props
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <div
      className={`inline-flex items-center gap-2 ${className}`}
      role="status"
      aria-live="polite"
      {...props}
    >
      <Loader2
        className={`animate-spin text-primary ${sizeClasses[size]}`}
      />
      {text && (
        <span className="text-sm text-neutral-600">{text}</span>
      )}
      <span className="sr-only">Cargando...</span>
    </div>
  );
};

/**
 * Loading Overlay - Overlay de carga pantalla completa
 */
export const LoadingOverlay = ({ text = 'Cargando...' }) => {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-strong flex flex-col items-center gap-3">
        <Spinner size="lg" />
        <p className="text-neutral-700 font-medium">{text}</p>
      </div>
    </div>
  );
};

/**
 * Loading Container - Contenedor de carga
 */
export const LoadingContainer = ({ text = 'Cargando...', className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <Spinner size="lg" text={text} />
    </div>
  );
};

export default Spinner;
