/**
 * Componente Layout - Layout principal de la aplicación
 * @component
 *
 * Envuelve las páginas con Header y Footer.
 */

import Header from './Header';
import Footer from './Footer';

const Layout = ({
  children,
  showHeader = true,
  showFooter = true,
  showCart = false,
  showMenu = false,
  onMenuClick,
  transparent = false,
}) => {
  return (
    <div className="flex flex-col min-h-screen">
      {showHeader && (
        <Header
          showCart={showCart}
          showMenu={showMenu}
          onMenuClick={onMenuClick}
          transparent={transparent}
        />
      )}

      <main className="flex-1 w-full" id="main-content">
        {children}
      </main>

      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;
