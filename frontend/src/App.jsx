/**
 * App.jsx - Componente raíz de la aplicación
 *
 * Configura React Router, providers globales y rutas principales.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProviders } from './context';
import { useAuth } from './context/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import OrderStatusPage from './pages/OrderStatusPage';
import KitchenPage from './pages/KitchenPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';

// Componente para proteger rutas que requieren autenticación
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Configuración de rutas
const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<HomePage />} />
      <Route path="/menu/:tableId" element={<MenuPage />} />
      <Route path="/menu" element={<MenuPage />} />  {/* Para QR con query string */}
      <Route path="/cart" element={<CartPage />} />
      <Route path="/order/:orderId" element={<OrderStatusPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Rutas protegidas - Cocina */}
      <Route
        path="/kitchen"
        element={
          <ProtectedRoute requiredRole="KITCHEN">
            <KitchenPage />
          </ProtectedRoute>
        }
      />

      {/* Rutas protegidas - Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminPage />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <AppRoutes />

        {/* Notificaciones toast */}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#2C2C2C',
              border: '1px solid #E8E8E8',
              borderRadius: '8px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            },
            success: {
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />

        {/* Región ARIA para anuncios de accesibilidad */}
        <div
          id="aria-live-region"
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        />
      </AppProviders>
    </BrowserRouter>
  );
}

export default App;
