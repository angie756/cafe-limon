# Frontend - Guía del Desarrollador

> Documentación técnica completa del frontend de Café Limón

## 🎯 Resumen Ejecutivo

El frontend de Café Limón es una aplicación React moderna, minimalista y optimizada para dispositivos móviles que permite a los clientes:

- Escanear un QR en su mesa para acceder al menú digital
- Navegar y buscar productos
- Agregar productos a un carrito
- Realizar pedidos sin intervención del personal
- Recibir notificaciones en tiempo real del estado de su pedido

Para el personal:
- Panel de cocina con actualizaciones en tiempo real
- Panel de administración (futuro)

## 🛠️ Stack Técnico Completo

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | 18.x | UI Library |
| Vite | 7.x | Build tool y dev server |
| React Router | 6.x | Routing |
| Tailwind CSS | 3.x | Styling |
| Axios | 1.x | HTTP Client |
| Socket.io Client | 4.x | WebSocket |
| React Hot Toast | 2.x | Notificaciones |
| Lucide React | Latest | Iconos |

Ver `package.json` para lista completa de dependencias.

## 🏃 Quick Start

```bash
cd frontend

# Instalar dependencias
npm install

# Copiar y configurar variables de entorno
cp .env.example .env.local
# Editar .env.local

# Ejecutar en desarrollo
npm run dev
# Abre: http://localhost:5173
```

## 📚 Guías Detalladas

Para más información, consulta:

- [README.md](../frontend/README.md) - Documentación general
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Arquitectura del sistema
- [REQUIREMENTS.md](./REQUIREMENTS.md) - Requerimientos funcionales
- [API.md](./API.md) - Documentación de API (futuro)

---

**Última actualización**: 2025-01-13
**Mantenido por**: Equipo Café Limón - Politécnico ASYS
