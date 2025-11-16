/**
 * Barrel export de contextos
 * @module context
 */

export { CartProvider, useCart } from './CartContext';
export { AuthProvider, useAuth } from './AuthContext';

/**
 * Provider que combina todos los contextos
 */
import { CartProvider } from './CartContext';
import { AuthProvider } from './AuthContext';

export const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </AuthProvider>
  );
};
