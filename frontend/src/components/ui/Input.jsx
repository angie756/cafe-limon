/**
 * Componente Input - Campo de entrada reutilizable
 * @component
 *
 * Input con label, error, y diferentes tipos.
 */

import { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * @param {Object} props
 * @param {string} [props.label] - Label del input
 * @param {string} [props.error] - Mensaje de error
 * @param {string} [props.helperText] - Texto de ayuda
 * @param {string} [props.type='text'] - Tipo de input
 * @param {boolean} [props.required=false] - Campo requerido
 * @param {React.ReactNode} [props.leftIcon] - Icono izquierdo
 * @param {React.ReactNode} [props.rightIcon] - Icono derecho
 * @param {string} [props.className] - Clases adicionales
 */
const Input = forwardRef(({
  label,
  error,
  helperText,
  type = 'text',
  required = false,
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = !!error;

  const inputClasses = [
    'input',
    hasError && 'input-error',
    leftIcon && 'pl-10',
    rightIcon && 'pr-10',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-neutral-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          className={inputClasses}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
          }
          {...props}
        />

        {rightIcon && !hasError && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
            {rightIcon}
          </div>
        )}

        {hasError && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
            <AlertCircle className="w-5 h-5" />
          </div>
        )}
      </div>

      {error && (
        <p
          id={`${inputId}-error`}
          className="mt-1 text-sm text-red-600 flex items-center gap-1"
        >
          {error}
        </p>
      )}

      {!error && helperText && (
        <p
          id={`${inputId}-helper`}
          className="mt-1 text-sm text-neutral-500"
        >
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
