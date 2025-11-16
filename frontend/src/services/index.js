/**
 * Barrel export de todos los servicios
 * @module services
 *
 * Exporta todos los servicios de la aplicación para facilitar imports.
 * Ejemplo de uso: import { menuService, orderService } from '@/services';
 */

export { default as api } from './api';
export * from './api';

export { default as menuService } from './menuService';
export * from './menuService';

export { default as orderService } from './orderService';
export * from './orderService';

export { default as authService } from './authService';
export * from './authService';

export { default as tableService } from './tableService';
export * from './tableService';

export { default as websocketService } from './websocketService';
export * from './websocketService';
