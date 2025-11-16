/**
 * TableQRCode - Componente para mostrar código QR de una mesa
 * @component
 *
 * Muestra el código QR generado por el backend para acceso al menú de la mesa.
 */

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, RefreshCw, Loader2 } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { generateQRCode } from '../../services/tableService';
import toast from 'react-hot-toast';

const TableQRCode = ({ tableId, tableNumber, initialQRData }) => {
  const [qrData, setQrData] = useState(initialQRData);
  const [loading, setLoading] = useState(false);

  // Generar URL del menú
  const menuUrl = `${window.location.origin}/menu?table=${tableId}`;

  // Regenerar QR code
  const handleRegenerateQR = async () => {
    setLoading(true);
    try {
      const response = await generateQRCode(tableId);
      setQrData(response.qrCode);
      toast.success('Código QR regenerado exitosamente');
    } catch (error) {
      console.error('Error regenerando QR:', error);
      toast.error('Error al regenerar código QR');
    } finally {
      setLoading(false);
    }
  };

  // Descargar QR code
  const handleDownloadQR = () => {
    const svg = document.getElementById(`qr-${tableId}`);
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = 512;
    canvas.height = 512;

    img.onload = () => {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `mesa-${tableNumber}-qr.png`;
        link.click();
        URL.revokeObjectURL(url);
        toast.success('QR descargado exitosamente');
      });
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <Card className="text-center">
      <h3 className="text-lg font-semibold mb-4">
        Mesa {tableNumber}
      </h3>

      {/* QR Code */}
      <div className="bg-white p-4 rounded-lg inline-block mb-4">
        <QRCodeSVG
          id={`qr-${tableId}`}
          value={menuUrl}
          size={256}
          level="H"
          includeMargin={true}
          imageSettings={{
            src: '/logo.png',
            height: 40,
            width: 40,
            excavate: true,
          }}
        />
      </div>

      {/* URL */}
      <div className="mb-4">
        <p className="text-sm text-neutral-600 mb-1">URL del menú:</p>
        <code className="text-xs bg-neutral-100 px-2 py-1 rounded block break-all">
          {menuUrl}
        </code>
      </div>

      {/* Acciones */}
      <div className="flex gap-2 justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadQR}
          leftIcon={<Download className="w-4 h-4" />}
        >
          Descargar
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleRegenerateQR}
          disabled={loading}
          leftIcon={loading ?
            <Loader2 className="w-4 h-4 animate-spin" /> :
            <RefreshCw className="w-4 h-4" />
          }
        >
          Regenerar
        </Button>
      </div>
    </Card>
  );
};

export default TableQRCode;
