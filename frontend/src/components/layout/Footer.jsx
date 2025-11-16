/**
 * Componente Footer - Pie de página
 * @component
 *
 * Muestra información del café y créditos.
 */

import { Heart, Coffee } from 'lucide-react';
import { APP_NAME, APP_VERSION } from '../../constants';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-800 text-neutral-300 mt-auto safe-bottom">
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Columna 1: Información */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Coffee className="w-6 h-6 text-secondary" />
              <h3 className="font-display font-bold text-white text-lg">
                {APP_NAME}
              </h3>
            </div>
            <p className="text-sm text-neutral-400">
              El Carmen de Viboral, Antioquia
              <br />
              Carrera 30 # 29-60
            </p>
          </div>

          {/* Columna 2: Enlaces */}
          <div>
            <h4 className="font-semibold text-white mb-3">Información</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="hover:text-secondary transition-colors"
                >
                  Acerca de nosotros
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-secondary transition-colors"
                >
                  Política de privacidad
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-secondary transition-colors"
                >
                  Términos y condiciones
                </a>
              </li>
            </ul>
          </div>

          {/* Columna 3: Contacto */}
          <div>
            <h4 className="font-semibold text-white mb-3">Contacto</h4>
            <p className="text-sm text-neutral-400">
              ¿Tienes alguna pregunta?
              <br />
              Habla con nuestro personal.
            </p>
          </div>
        </div>

        {/* Separador */}
        <div className="border-t border-neutral-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <p className="text-neutral-400">
              &copy; {currentYear} {APP_NAME}. Todos los derechos reservados.
            </p>

            <p className="flex items-center gap-1 text-neutral-400">
              Hecho con{' '}
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />{' '}
              para Café Limón
            </p>

            <p className="text-neutral-500 text-xs">
              v{APP_VERSION}
            </p>
          </div>
        </div>

        {/* Créditos del proyecto de grado */}
        <div className="mt-6 pt-6 border-t border-neutral-700">
          <p className="text-center text-xs text-neutral-500">
            Proyecto de grado - Técnico Auxiliar Desarrollo y Análisis de Software
            <br />
            Angie Melissa Gutierrez Quintana • Politécnico ASYS • 2025
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
