/**
 * Componente Header - Cabecera de la aplicación
 * @component
 *
 * Muestra el logo, título y acciones según el contexto.
 */

import { ShoppingCart, Menu, X, LogOut, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { APP_NAME } from '../../constants';

const Header = ({
  showCart = false,
  showMenu = false,
  onMenuClick,
  transparent = false,
}) => {
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const cartItems = getTotalItems();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header
      className={`
        sticky top-0 z-40 w-full border-b safe-top
        ${transparent ? 'bg-white/80 backdrop-blur-md' : 'bg-white'}
        ${transparent ? 'border-neutral-200/50' : 'border-neutral-200'}
      `}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo y título */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center text-white text-xl font-bold group-hover:scale-105 transition-transform">
              ☕
            </div>
            <span className="font-display font-bold text-xl text-neutral-800 hidden sm:inline">
              {APP_NAME}
            </span>
          </Link>

          {/* Acciones */}
          <div className="flex items-center gap-2">
            {/* Botón de menú (móvil) */}
            {showMenu && (
              <button
                onClick={onMenuClick}
                className="p-2 rounded-lg hover:bg-neutral-100 transition-colors md:hidden"
                aria-label="Abrir menú"
              >
                <Menu className="w-6 h-6 text-neutral-700" />
              </button>
            )}

            {/* Carrito */}
            {showCart && (
              <Button
                variant="ghost"
                onClick={() => navigate('/cart')}
                className="relative"
                aria-label={`Carrito (${cartItems} items)`}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {cartItems > 9 ? '9+' : cartItems}
                  </span>
                )}
              </Button>
            )}

            {/* Usuario autenticado */}
            {isAuthenticated && user && (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-neutral-100 rounded-lg">
                  <User className="w-4 h-4 text-neutral-600" />
                  <span className="text-sm font-medium text-neutral-700">
                    {user.username}
                  </span>
                  <Badge variant="info" className="text-xs">
                    {user.role}
                  </Badge>
                </div>

                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  leftIcon={<LogOut className="w-4 h-4" />}
                  className="hidden sm:inline-flex"
                >
                  Salir
                </Button>

                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="sm:hidden"
                  aria-label="Cerrar sesión"
                >
                  <LogOut className="w-5 h-5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
