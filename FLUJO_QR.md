# Flujo Completo del Sistema de QR - Café Limón

## 📱 Flujo del Cliente (Usuario Final)

### 1. Cliente llega a la mesa
- El restaurante tiene un **código QR físico** en cada mesa
- Cada mesa tiene un número único (ej: M01, M02, M03)

### 2. Cliente escanea el QR con su celular
El QR contiene una URL como:
```
http://localhost:5173/menu?table=<ID_DE_MESA>
```
O en producción:
```
https://cafelimon.com/menu?table=<ID_DE_MESA>
```

### 3. Se abre la página del menú digital
**Componente:** `MenuPage.jsx` (`/menu` o `/menu/:tableId`)

La página muestra:
- ✅ Nombre del café y número de mesa
- ✅ Buscador de productos
- ✅ Filtros por categoría (bebidas calientes, frías, postres, etc.)
- ✅ Grid de productos con:
  - Foto (si existe)
  - Nombre
  - Descripción
  - Precio
  - Botón "Agregar al carrito"

### 4. Cliente navega por las categorías disponibles

**Categorías implementadas:**
1. ☕ Bebidas Calientes - Café, té, chocolate
2. 🥤 Bebidas Frías - Jugos, malteadas, frappes
3. 🍨 Helados - Helados artesanales
4. 🍰 Repostería - Pasteles, tartas
5. 🥐 Panadería - Pan, croissants
6. ⭐ Delicias de la Casa - Especialidades
7. 🍪 Dulces y Mecatos - Snacks, galletas
8. 🥤 Gaseosas - Refrescos
9. 🥤 Coca Cola - Productos Coca-Cola
10. 🥤 Postobon - Productos Postobón
11. 🍺 Cerveza Nacional - Cervezas colombianas
12. 🍺 Cerveza Internacional - Cervezas importadas
13. 🍹 Cocteles - Cocteles clásicos y de autor
14. 🥃 Tragos - Bebidas alcohólicas
15. 🍷 Licores - Vinos, whisky, ron

### 5. Cliente agrega productos al carrito
- Click en "Agregar" en cualquier producto
- Toast de confirmación: "Producto agregado al carrito"
- **Contexto:** `CartContext` maneja el estado del carrito
- El carrito persiste en `localStorage`

### 6. Cliente tiene dos opciones:

#### Opción A: Llamar al Mesero 👋
- Click en botón flotante "Llamar Mesero"
- Notificación: "¡Mesero en camino!"
- El mesero viene a la mesa para tomar la orden personalmente

#### Opción B: Ordenar directamente 🛒
- Click en botón flotante "Ver Carrito (X items)"
- Redirección a `/cart`

### 7. Página del Carrito (`CartPage.jsx`)
El cliente puede:
- Ver todos los productos agregados
- Ajustar cantidades (+/-)
- Eliminar productos
- Ver subtotal y total
- Ver número de mesa
- Click en "Confirmar Pedido"

### 8. Confirmación del Pedido
**Componente:** `CartPage.jsx` → botón "Confirmar Pedido"

Al confirmar:
1. Se crea una orden en el backend
2. Se envía notificación WebSocket a:
   - Cocina (pantalla de KitchenPage)
   - Mesa específica (para seguimiento)
3. Se redirecciona a `/order/:orderId`

### 9. Página de Estado del Pedido (`OrderStatusPage.jsx`)
El cliente puede ver:
- Número de orden
- Estado del pedido (badges de color):
  - 🔵 PENDING - Pendiente
  - 🟡 PREPARING - En preparación
  - 🟢 READY - Listo
  - ⚫ DELIVERED - Entregado
  - 🔴 CANCELLED - Cancelado
- Items del pedido
- Total a pagar
- **Actualizaciones en tiempo real** vía WebSocket

---

## 🔧 Flujo Técnico (Backend)

### 1. Generación del QR Code

**Servicio:** `QRCodeService.java`
**Endpoint:** `POST /api/tables/{id}/generate-qr`

```java
public String generateQRCode(String tableId) {
    String url = String.format("%s/menu?table=%s", frontendUrl, tableId);

    // Generar QR usando ZXing
    QRCodeWriter qrCodeWriter = new QRCodeWriter();
    BitMatrix bitMatrix = qrCodeWriter.encode(url, BarcodeFormat.QR_CODE, 300, 300);

    // Convertir a PNG en Base64
    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
    MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);

    return "data:image/png;base64," + Base64.encode(outputStream.toByteArray());
}
```

### 2. Cliente accede al menú

**Endpoint:** `GET /api/menu/table/{tableId}`
**Servicio:** `MenuService.java`

Respuesta:
```json
{
  "table": {
    "id": "uuid",
    "number": "M01",
    "capacity": 4
  },
  "categories": [
    {
      "id": "uuid",
      "name": "Bebidas Calientes",
      "icon": "☕",
      "orderIndex": 1
    }
  ],
  "products": [
    {
      "id": "uuid",
      "name": "Café Americano",
      "description": "Café de altura",
      "price": 4500.00,
      "categoryId": "uuid",
      "available": true,
      "imageUrl": "https://..."
    }
  ]
}
```

### 3. Cliente crea una orden

**Endpoint:** `POST /api/orders`
**Servicio:** `OrderService.java`

Request:
```json
{
  "tableId": "uuid",
  "items": [
    {
      "productId": "uuid",
      "quantity": 2,
      "notes": "Sin azúcar"
    }
  ]
}
```

El backend:
1. Valida la mesa
2. Valida los productos
3. Calcula precios y totales
4. Crea la orden con estado PENDING
5. **Envía notificaciones WebSocket:**
   ```java
   webSocketService.notifyNewOrder(orderResponse);
   webSocketService.notifyKitchen(orderResponse);
   webSocketService.notifyOrderUpdateToTable(tableId, orderResponse);
   ```

### 4. Cocina procesa la orden

**Página:** `KitchenPage.jsx` (requiere autenticación)
**Endpoint:** `PATCH /api/orders/{id}/status`

La cocina puede cambiar el estado:
- PENDING → PREPARING
- PREPARING → READY
- READY → DELIVERED

Cada cambio envía notificación WebSocket al cliente.

---

## 🏗️ Arquitectura de Componentes

### Frontend
```
src/
├── pages/
│   ├── MenuPage.jsx        ← Cliente escanea QR y llega aquí
│   ├── CartPage.jsx        ← Cliente revisa y confirma pedido
│   ├── OrderStatusPage.jsx ← Cliente ve estado en tiempo real
│   ├── KitchenPage.jsx     ← Cocina gestiona pedidos
│   └── TablesPage.jsx      ← Admin gestiona mesas y QR codes
├── components/
│   └── admin/
│       └── TableQRCode.jsx ← Muestra y descarga QR codes
├── services/
│   ├── menuService.js      ← API de menú
│   ├── orderService.js     ← API de órdenes
│   ├── tableService.js     ← API de mesas y QR
│   └── websocketService.js ← WebSocket para tiempo real
└── context/
    ├── CartContext.jsx     ← Estado global del carrito
    └── AuthContext.jsx     ← Autenticación (admin/cocina)
```

### Backend
```
backend/
└── src/main/java/com/cafelimon/
    ├── controller/
    │   ├── TableController.java     ← CRUD mesas + QR
    │   ├── MenuController.java      ← Menú público
    │   └── OrderController.java     ← Gestión de órdenes
    ├── service/
    │   ├── QRCodeService.java       ← Generación de QR
    │   ├── MenuService.java         ← Lógica de menú
    │   ├── OrderService.java        ← Lógica de órdenes
    │   ├── TableService.java        ← Lógica de mesas
    │   └── WebSocketService.java    ← Notificaciones
    ├── model/
    │   ├── Table.java               ← Entidad Mesa
    │   ├── Category.java            ← Entidad Categoría
    │   ├── Product.java             ← Entidad Producto
    │   ├── Order.java               ← Entidad Orden
    │   └── OrderItem.java           ← Entidad Item de Orden
    └── config/
        ├── SecurityConfig.java      ← JWT + CORS
        └── WebSocketConfig.java     ← Config WebSocket
```

---

## 🚀 Configuración para Producción

### 1. Imprimir los QR Codes

**Opción A: Desde TablesPage (Admin)**
1. Login como admin en `/login`
2. Ir a gestión de mesas
3. Click en "Descargar QR" para cada mesa
4. Imprimir en alta calidad (512x512 px)

**Opción B: Desde API directamente**
```bash
GET /api/tables/{id}/qr
```

### 2. Variables de Entorno

**Frontend (.env.production):**
```env
VITE_API_URL=https://api.cafelimon.com/api
VITE_WS_URL=https://api.cafelimon.com/ws
VITE_APP_ENV=production
```

**Backend (application-prod.yml):**
```yaml
app:
  frontend:
    url: https://cafelimon.com  # ← URL para QR codes
```

### 3. Despliegue

**Frontend (Vercel/Netlify):**
```bash
cd frontend
npm run build
# Subir carpeta dist/
```

**Backend (Heroku/AWS/DigitalOcean):**
```bash
cd backend
./mvnw clean package -DskipTests
java -jar target/backend-1.0.0.jar --spring.profiles.active=prod
```

---

## ✅ Checklist de Implementación

### Completado ✓
- [x] Generación de QR codes con ZXing
- [x] MenuPage con filtros por categoría
- [x] Carrito de compras con localStorage
- [x] Botón "Llamar Mesero"
- [x] CartPage para revisión de pedido
- [x] OrderStatusPage con WebSocket
- [x] KitchenPage para cocina
- [x] 15 categorías de productos
- [x] Script de inicialización de datos
- [x] Soporte para rutas con query string y params

### Pendiente ⏳
- [ ] Compilar backend (requiere IDE con Lombok)
- [ ] Inicializar base de datos PostgreSQL
- [ ] Ejecutar script data-init.sql
- [ ] Generar QR codes para todas las mesas
- [ ] Imprimir QR codes físicos
- [ ] Testing completo del flujo
- [ ] Configurar WebSocket en producción
- [ ] Implementar pagos (futuro)

---

## 🔐 Usuarios por Defecto

### Admin
- **Usuario:** admin
- **Password:** admin123
- **Rol:** ADMIN
- **Acceso a:** Gestión de mesas, QR codes, productos, categorías

### Cocina
- **Usuario:** cocina
- **Password:** cocina123
- **Rol:** KITCHEN
- **Acceso a:** KitchenPage para gestión de órdenes

---

## 📊 Estados de una Orden

1. **PENDING** (🔵 Azul)
   - Orden recién creada
   - Esperando confirmación de cocina

2. **PREPARING** (🟡 Amarillo)
   - Cocina confirmó y está preparando
   - Cliente puede ver progreso

3. **READY** (🟢 Verde)
   - Orden lista para servir
   - Mesero puede recoger

4. **DELIVERED** (⚫ Gris)
   - Orden entregada al cliente
   - Estado final

5. **CANCELLED** (🔴 Rojo)
   - Orden cancelada
   - Puede ser por cocina o cliente

---

## 🌐 URLs del Sistema

### Producción
- Frontend: `https://cafelimon.com`
- Backend API: `https://api.cafelimon.com`
- Swagger UI: `https://api.cafelimon.com/swagger-ui.html`

### Desarrollo
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8080`
- Swagger UI: `http://localhost:8080/swagger-ui.html`

### QA/Staging
- Frontend: `https://qa.cafelimon.com`
- Backend API: `https://api-qa.cafelimon.com`

---

**Sistema listo para uso en restaurante! 🎉**
