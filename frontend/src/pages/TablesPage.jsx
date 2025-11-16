/**
 * TablesPage - Página de gestión de mesas
 * @page
 *
 * Permite administrar mesas y sus códigos QR.
 */

import { useState, useEffect } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import TableQRCode from '../components/admin/TableQRCode';
import { getTables } from '../services/tableService';
import toast from 'react-hot-toast';

const TablesPage = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    setLoading(true);
    try {
      const data = await getTables();
      setTables(data);
    } catch (error) {
      console.error('Error cargando mesas:', error);
      toast.error('Error al cargar mesas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gestión de Mesas</h1>
            <p className="text-neutral-600">
              Administra las mesas y sus códigos QR
            </p>
          </div>

          <Button
            leftIcon={<Plus className="w-5 h-5" />}
            onClick={() => {
              toast('Funcionalidad en desarrollo', { icon: '🚧' });
            }}
          >
            Nueva Mesa
          </Button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Lista de Mesas */}
        {!loading && (
          <>
            {tables.length === 0 ? (
              <Card className="text-center py-16">
                <p className="text-neutral-600 mb-4">
                  No hay mesas registradas
                </p>
                <Button
                  leftIcon={<Plus className="w-5 h-5" />}
                  onClick={() => {
                    toast('Funcionalidad en desarrollo', { icon: '🚧' });
                  }}
                >
                  Crear Primera Mesa
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tables.map((table) => (
                  <TableQRCode
                    key={table.id}
                    tableId={table.id}
                    tableNumber={table.number}
                    initialQRData={table.qrCode}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default TablesPage;
