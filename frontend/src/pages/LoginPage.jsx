/**
 * LoginPage - Página de inicio de sesión
 * @page
 *
 * Formulario de login para personal del café (Admin/Cocina).
 */

import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Coffee, Lock, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { APP_NAME } from '../constants';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  // Si ya está autenticado, redirigir según el rol
  if (isAuthenticated && user) {
    if (user.role === 'KITCHEN') {
      return <Navigate to="/kitchen" replace />;
    }
    if (user.role === 'ADMIN') {
      return <Navigate to="/admin" replace />;
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await login(formData);

      toast.success('Bienvenido de vuelta');

      // Navegar según el rol usando la respuesta del login
      const userRole = response?.user?.role;

      if (userRole === 'KITCHEN') {
        navigate('/kitchen', { replace: true });
      } else if (userRole === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (error) {
      toast.error(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout showHeader={false} showFooter={false}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-primary p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl mx-auto mb-4 shadow-strong">
              ☕
            </div>

            <h1 className="text-3xl font-bold text-white mb-2">
              {APP_NAME}
            </h1>

            <p className="text-white/80">
              Panel de Administración
            </p>
          </div>

          {/* Formulario de Login */}
          <Card>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  label="Usuario"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Ingresa tu usuario"
                  required
                  leftIcon={<User className="w-5 h-5" />}
                  autoComplete="username"
                />
              </div>

              <div>
                <Input
                  label="Contraseña"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Ingresa tu contraseña"
                  required
                  leftIcon={<Lock className="w-5 h-5" />}
                  autoComplete="current-password"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={loading}
                size="lg"
              >
                Iniciar Sesión
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-sm text-neutral-600 hover:text-primary transition-colors"
              >
                Volver al inicio
              </button>
            </div>
          </Card>

          {/* Información de roles */}
          <div className="mt-6 text-center text-white/60 text-sm">
            <p>Solo para personal autorizado</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
