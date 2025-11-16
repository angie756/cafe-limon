/**
 * NotFoundPage - Página 404
 * @page
 *
 * Página que se muestra cuando la ruta no existe.
 */

import { useNavigate } from 'react-router-dom';
import { Home, Coffee } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Layout showHeader={false} showFooter={false}>
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
        <div className="text-center max-w-md">
          {/* Icono de café derramado */}
          <div className="text-8xl mb-6">☕💨</div>

          <h1 className="text-6xl font-bold text-neutral-800 mb-4">
            404
          </h1>

          <h2 className="text-2xl font-semibold text-neutral-700 mb-4">
            Página no encontrada
          </h2>

          <p className="text-neutral-600 mb-8">
            Lo sentimos, la página que buscas no existe.
            <br />
            Puede que se haya movido o eliminado.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="primary"
              onClick={() => navigate('/')}
              leftIcon={<Home className="w-5 h-5" />}
            >
              Volver al Inicio
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Volver Atrás
            </Button>
          </div>

          <p className="mt-8 text-sm text-neutral-500">
            Si crees que esto es un error, contacta al administrador.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default NotFoundPage;
