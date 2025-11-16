/**
 * MenuPage - Página del menú digital
 * @page
 *
 * Muestra el menú completo con productos por categorías.
 * Los clientes acceden escaneando el QR de su mesa.
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ShoppingCart, Search, Plus, PhoneCall } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { useMenu } from '../hooks/useMenu';
import { useCart } from '../context/CartContext';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import { LoadingContainer } from '../components/ui/Spinner';
import { formatPrice } from '../utils/formatters';
import toast from 'react-hot-toast';
import * as tableService from '../services/tableService';

const MenuPage = () => {
  const { tableId: tableIdFromParams } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Obtener tableId de params o query string
  const tableId = tableIdFromParams || searchParams.get('table');
  const { loadMenu, loadMenuByTable, menu, loading, error } = useMenu();
  const { addItem, items: cartItems, getTotalItems, setTable } = useCart();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Obtener UUID de la mesa si tableId es un número
  useEffect(() => {
    const fetchTableUUID = async () => {
      if (tableId) {
        try {
          // Intentar obtener la mesa por número
          const table = await tableService.getTableByNumber(tableId);
          console.log('🔍 MenuPage: Mesa encontrada:', table);
          // Guardar el UUID real de la mesa en el carrito
          setTable(table.id);
        } catch (error) {
          // Si falla, asumir que tableId ya es un UUID
          console.log('🔍 MenuPage: Usando tableId como UUID:', tableId);
          setTable(tableId);
        }
      }
    };

    fetchTableUUID();
  }, [tableId, setTable]);

  useEffect(() => {
    if (tableId) {
      // Try table-specific endpoint first, fallback to general menu
      loadMenuByTable(tableId, { suppressToast: true }).catch(() => {
        console.warn('Table-specific menu failed, loading general menu');
        loadMenu();
      });
    } else {
      loadMenu();
    }
  }, [tableId, loadMenuByTable, loadMenu]);

  // Filtrar productos por búsqueda y categoría
  const filteredProducts = menu?.products?.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category?.id === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch && product.available;
  }) || [];

  // Agrupar productos por categoría para mostrar agrupados
  const groupedByCategory = menu?.categories?.reduce((acc, category) => {
    const categoryProducts = filteredProducts.filter(p => p.category?.id === category.id);
    if (categoryProducts.length > 0) {
      acc.push({
        category,
        products: categoryProducts
      });
    }
    return acc;
  }, []) || [];

  const handleAddToCart = (product) => {
    addItem(product, 1);
    toast.success(`${product.name} agregado al carrito`);
  };

  if (loading) {
    return (
      <Layout>
        <LoadingContainer text="Cargando menú..." />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container-custom py-12 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => navigate('/')}>Volver al inicio</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showCart={true} transparent={true}>
      <div className="container-custom py-6 pb-24">
        {/* Header del menú */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Menú Digital</h1>
          <p className="text-neutral-600">
            Mesa: <strong>{menu?.table?.number || tableId}</strong>
          </p>
        </div>

        {/* Búsqueda */}
        <div className="mb-6">
          <Input
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-5 h-5" />}
          />
        </div>

        {/* Filtro de categorías */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-6 pb-2">
          <Button
            variant={selectedCategory === 'all' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            Todos
          </Button>

          {menu?.categories?.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.icon} {category.name}
            </Button>
          ))}
        </div>

        {/* Productos agrupados por categoría */}
        {selectedCategory === 'all' ? (
          // Mostrar todas las categorías con sus productos
          <div className="space-y-8">
            {groupedByCategory.map(({ category, products }) => (
              <div key={category.id}>
                {/* Título de categoría */}
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                  <span className="text-sm font-normal text-neutral-500">({products.length})</span>
                </h2>

                {/* Grid de productos de esta categoría */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map(product => (
                    <Card key={product.id} variant="interactive">
                      {product.imageUrl && (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-40 object-cover rounded-lg mb-3"
                        />
                      )}

                      <h3 className="font-semibold text-lg mb-1">{product.name}</h3>

                      <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-primary">
                          {formatPrice(product.price)}
                        </span>

                        <Button
                          size="sm"
                          onClick={() => handleAddToCart(product)}
                          leftIcon={<Plus className="w-4 h-4" />}
                        >
                          Agregar
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Mostrar solo la categoría seleccionada
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map(product => (
              <Card key={product.id} variant="interactive">
                {product.imageUrl && (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                )}

                <h3 className="font-semibold text-lg mb-1">{product.name}</h3>

                <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-primary">
                    {formatPrice(product.price)}
                  </span>

                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(product)}
                    leftIcon={<Plus className="w-4 h-4" />}
                  >
                    Agregar
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-neutral-500">
            No se encontraron productos.
          </div>
        )}
      </div>

      {/* Botones flotantes */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col gap-3">
        {/* Botón Llamar Mesero */}
        <Button
          variant="secondary"
          size="lg"
          onClick={() => {
            toast.success('¡Mesero en camino!', {
              icon: '👋',
              duration: 4000,
            });
          }}
          className="shadow-strong rounded-full"
          leftIcon={<PhoneCall className="w-5 h-5" />}
        >
          Llamar Mesero
        </Button>

        {/* Botón Ver Carrito (solo si hay items) */}
        {getTotalItems() > 0 && (
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/cart')}
            className="shadow-strong rounded-full"
            leftIcon={<ShoppingCart className="w-5 h-5" />}
          >
            Ver Carrito ({getTotalItems()})
          </Button>
        )}
      </div>
    </Layout>
  );
};

export default MenuPage;
