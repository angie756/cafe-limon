/**
 * HomePage - Página de inicio
 * @page
 *
 * Página de bienvenida con información del café.
 */

import { useNavigate } from 'react-router-dom';
import { Coffee, QrCode, ShoppingBag, Clock } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { APP_NAME } from '../constants';

const HomePage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <QrCode className="w-8 h-8" />,
      title: 'Escanea el QR',
      description: 'Escanea el código QR en tu mesa para acceder al menú digital.',
    },
    {
      icon: <ShoppingBag className="w-8 h-8" />,
      title: 'Ordena fácilmente',
      description: 'Explora nuestro menú y agrega productos a tu carrito.',
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Recibe notificaciones',
      description: 'Te avisaremos cuando tu pedido esté listo.',
    },
  ];

  return (
    <Layout showCart={false} showFooter={true}>
      {/* Hero Section */}
      <div className="gradient-primary text-white">
        <div className="container-custom py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 backdrop-blur-sm">
              ☕
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Bienvenido a {APP_NAME}
            </h1>

            <p className="text-lg md:text-xl text-white/90 mb-8">
              Disfruta de café artesanal del Oriente Antioqueño.
              <br />
              Ordena fácilmente escaneando el código QR en tu mesa.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate('/login')}
                leftIcon={<Coffee className="w-5 h-5" />}
              >
                Panel de Administración
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-neutral-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">
            ¿Cómo funciona?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center text-primary mx-auto mb-4">
                  {feature.icon}
                </div>

                <h3 className="text-xl font-semibold mb-2">
                  {feature.title}
                </h3>

                <p className="text-neutral-600">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16">
        <div className="container-custom">
          <Card className="bg-gradient-secondary text-white text-center border-0">
            <h2 className="text-3xl font-bold mb-4">
              ¿Listo para ordenar?
            </h2>

            <p className="text-lg mb-6 text-white/90">
              Escanea el código QR en tu mesa para comenzar.
            </p>

            <div className="w-32 h-32 bg-white rounded-lg mx-auto p-4">
              <QrCode className="w-full h-full text-secondary" />
            </div>

            <p className="text-sm mt-4 text-white/80">
              O visita <strong>cafelimon.app/menu/[mesa]</strong>
            </p>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
