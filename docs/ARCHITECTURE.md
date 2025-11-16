# Arquitectura del Sistema - Café Limón

> Documentación técnica detallada de la arquitectura del sistema de auto pedido

## 📐 Visión General

El sistema Café Limón sigue una arquitectura **cliente-servidor de 3 capas** con comunicación en tiempo real, diseñada para ser escalable, mantenible y de alto rendimiento.

## 🏛️ Arquitectura de Alto Nivel

```
┌────────────────────────────────────────────────────────────────┐
│                         CAPA DE PRESENTACIÓN                   │
│                                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐    │
│  │   Cliente    │  │    Cocina    │  │  Administrador  │    │
│  │   (Mobile)   │  │   (Tablet)   │  │     (Web)       │    │
│  └──────┬───────┘  └──────┬───────┘  └────────┬────────┘    │
│         │                  │                    │              │
│         └──────────────────┼────────────────────┘              │
│                            │                                   │
└────────────────────────────┼───────────────────────────────────┘
                             │
                    REST API + WebSockets
                             │
┌────────────────────────────┼───────────────────────────────────┐
│                    CAPA DE LÓGICA DE NEGOCIO                   │
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              Spring Boot Application                    │  │
│  │                                                         │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐ │  │
│  │  │  Auth    │  │  Order   │  │  Menu    │  │  Table │ │  │
│  │  │ Service  │  │ Service  │  │ Service  │  │Service │ │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └────────┘ │  │
│  │                                                         │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │         WebSocket Event Dispatcher               │  │  │
│  │  │  (Notificaciones en tiempo real)                 │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  └─────────────────────────────────────────────────────────┘  │
│                            │                                   │
└────────────────────────────┼───────────────────────────────────┘
                             │
                    JPA / Hibernate
                             │
┌────────────────────────────┼───────────────────────────────────┐
│                      CAPA DE DATOS                             │
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                  PostgreSQL 16                          │  │
│  │                                                         │  │
│  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌─────────────┐  │  │
│  │  │Products│  │ Orders │  │ Tables │  │    Users    │  │  │
│  │  └────────┘  └────────┘  └────────┘  └─────────────┘  │  │
│  └─────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

## 🎯 Decisiones Arquitectónicas Clave

### 1. Frontend: Single Page Application (SPA)

**Tecnología**: React 18 + Vite

**Justificación**:
- ✅ Experiencia de usuario fluida sin recargas de página
- ✅ Rápida respuesta a interacciones del usuario
- ✅ Ideal para aplicaciones móviles (principal dispositivo de uso)
- ✅ Fácil integración con WebSockets para actualizaciones en tiempo real
- ✅ Gran ecosistema de librerías y comunidad

**Patrones Implementados**:
- **Component-Based Architecture**: Componentes reutilizables y modulares
- **Context API**: Gestión de estado global (User, Cart, Orders)
- **Custom Hooks**: Lógica reutilizable (useCart, useOrders, useWebSocket)
- **Atomic Design**: Organización de componentes (atoms → molecules → organisms → templates → pages)

### 2. Backend: RESTful API + WebSockets

**Tecnología**: Spring Boot 3.x

**Justificación**:
- ✅ Robusto y probado en producción
- ✅ Excelente ecosistema de Spring (Security, Data, WebSocket)
- ✅ Alta performance y escalabilidad
- ✅ Fácil mantenimiento y testing
- ✅ Gran soporte y documentación

**Patrones Implementados**:
- **Layered Architecture**: Controller → Service → Repository
- **DTO Pattern**: Separación entre entidades de BD y objetos de transferencia
- **Repository Pattern**: Abstracción de acceso a datos
- **Dependency Injection**: Inversión de control con Spring IoC
- **Event-Driven**: Eventos de dominio para notificaciones

### 3. Base de Datos: PostgreSQL

**Justificación**:
- ✅ ACID compliant (crucial para pedidos y pagos)
- ✅ Soporte para JSON (flexibilidad en configuraciones)
- ✅ Excelente performance en lecturas/escrituras concurrentes
- ✅ Open source y sin costos de licenciamiento
- ✅ Soporte robusto para migraciones (Flyway/Liquibase)

### 4. Comunicación en Tiempo Real: WebSockets

**Protocolo**: STOMP sobre WebSocket

**Casos de Uso**:
- 📡 Notificación a cocina cuando se crea un pedido
- 📡 Notificación a cliente cuando su pedido cambia de estado
- 📡 Actualización de disponibilidad de productos
- 📡 Sincronización de múltiples dispositivos (cocina)

## 📦 Diagrama de Componentes Frontend

```
frontend/
│
├── App Component (Root)
│   │
│   ├── Providers (Context)
│   │   ├── AuthProvider
│   │   ├── CartProvider
│   │   ├── OrderProvider
│   │   └── WebSocketProvider
│   │
│   └── Router
│       │
│       ├── Public Routes
│       │   ├── MenuPage
│       │   │   ├── CategoryFilter
│       │   │   ├── ProductGrid
│       │   │   │   └── ProductCard
│       │   │   └── ShoppingCart (Drawer)
│       │   │
│       │   └── OrderStatusPage
│       │       ├── OrderTracker
│       │       └── OrderDetails
│       │
│       └── Protected Routes (Admin)
│           ├── KitchenPage
│           │   ├── OrderQueue
│           │   └── OrderCard (Kitchen)
│           │
│           └── AdminPage
│               ├── ProductManagement
│               ├── CategoryManagement
│               ├── TableManagement
│               └── Reports
```

## 📦 Diagrama de Componentes Backend

```
Spring Boot Application
│
├── Security Layer
│   ├── JwtAuthenticationFilter
│   ├── JwtTokenProvider
│   └── UserDetailsServiceImpl
│
├── Web Layer (Controllers)
│   ├── AuthController
│   ├── MenuController
│   ├── OrderController
│   ├── TableController
│   └── AdminController
│
├── Service Layer
│   ├── AuthService
│   ├── MenuService
│   ├── OrderService
│   │   └── OrderEventPublisher
│   ├── TableService
│   └── QRCodeService
│
├── Repository Layer (JPA)
│   ├── UserRepository
│   ├── ProductRepository
│   ├── CategoryRepository
│   ├── OrderRepository
│   └── TableRepository
│
├── WebSocket Layer
│   ├── WebSocketConfig
│   ├── OrderNotificationHandler
│   └── KitchenNotificationHandler
│
└── Domain Layer (Models)
    ├── User
    ├── Product
    ├── Category
    ├── Order
    ├── OrderItem
    └── Table
```

## 🔄 Flujo de Datos: Creación de Pedido

```
┌──────────┐
│ Cliente  │
│ (Mobile) │
└─────┬────┘
      │ 1. Escanea QR de la mesa
      ▼
┌────────────────┐
│  Frontend      │  2. Carga menú de la mesa específica
│  (React)       │     GET /api/tables/{tableId}/menu
└────────┬───────┘
         │ 3. Cliente agrega productos al carrito (estado local)
         │
         │ 4. Cliente confirma pedido
         │    POST /api/orders
         │    {
         │      tableId: "mesa-01",
         │      items: [{productId, quantity, notes}],
         │      customerName: "Juan"
         │    }
         ▼
┌───────────────────────┐
│  Backend              │  5. OrderController recibe request
│  OrderController      │
└──────────┬────────────┘
           │ 6. Valida datos
           ▼
┌───────────────────────┐
│  OrderService         │  7. Crea entidad Order
└──────────┬────────────┘
           │ 8. Guarda en BD
           ▼
┌───────────────────────┐
│  OrderRepository      │  9. INSERT en PostgreSQL
│  (JPA)                │
└──────────┬────────────┘
           │ 10. Retorna Order guardado
           ▼
┌───────────────────────┐
│  OrderEventPublisher  │  11. Publica evento NEW_ORDER
└──────────┬────────────┘
           │
           ├─────────────────────────┐
           │                         │
           ▼                         ▼
┌─────────────────────┐    ┌──────────────────────┐
│ WebSocket           │    │ Email/SMS Service    │
│ (Cocina)            │    │ (Opcional)           │
│                     │    │                      │
│ 12. Notifica a      │    │ 13. Envía SMS a      │
│     pantalla de     │    │     cliente          │
│     cocina          │    │     (confirmación)   │
└─────────────────────┘    └──────────────────────┘
           │
           ▼
┌─────────────────────┐
│ Frontend (Cliente)  │  14. Recibe confirmación
│                     │      Muestra OrderStatusPage
│ WS: ORDER_CONFIRMED │
└─────────────────────┘
```

## 🔄 Flujo de Datos: Actualización de Estado

```
┌──────────┐
│  Cocina  │
│ (Tablet) │
└─────┬────┘
      │ 1. Staff marca pedido como "LISTO"
      │    PATCH /api/orders/{orderId}/status
      │    { status: "READY" }
      ▼
┌───────────────────────┐
│  Backend              │  2. OrderController
│  OrderController      │
└──────────┬────────────┘
           │ 3. Valida transición de estado
           ▼
┌───────────────────────┐
│  OrderService         │  4. Actualiza estado
│                       │     Registra timestamp
└──────────┬────────────┘
           │ 5. UPDATE en BD
           ▼
┌───────────────────────┐
│  OrderRepository      │  6. PostgreSQL
└──────────┬────────────┘
           │ 7. Publica evento ORDER_STATUS_CHANGED
           ▼
┌───────────────────────┐
│ WebSocket Dispatcher  │  8. Envía notificación
└──────────┬────────────┘
           │
           ├────────────────────────┐
           │                        │
           ▼                        ▼
┌─────────────────────┐    ┌──────────────────┐
│ Cliente WebSocket   │    │ Cocina WebSocket │
│                     │    │                  │
│ 9. Notificación:    │    │ 10. Actualiza    │
│    "Tu pedido       │    │     lista de     │
│     está listo"     │    │     pedidos      │
│                     │    │                  │
│ 11. Toast/Alert     │    │                  │
│     Sound           │    │                  │
└─────────────────────┘    └──────────────────┘
```

## 🗄️ Modelo de Datos

### Diagrama ER (Entidad-Relación)

```
┌─────────────────┐
│     Category    │
│─────────────────│
│ id (PK)         │
│ name            │
│ description     │
│ icon            │
│ order_index     │
│ active          │
│ created_at      │
│ updated_at      │
└────────┬────────┘
         │
         │ 1:N
         │
         ▼
┌─────────────────────────┐
│       Product           │
│─────────────────────────│
│ id (PK)                 │
│ category_id (FK)        │
│ name                    │
│ description             │
│ price                   │
│ image_url               │
│ available               │
│ preparation_time        │
│ created_at              │
│ updated_at              │
└────────┬────────────────┘
         │
         │ N:M (via OrderItem)
         │
         ▼
┌─────────────────────────┐
│      OrderItem          │
│─────────────────────────│
│ id (PK)                 │
│ order_id (FK)           │
│ product_id (FK)         │
│ quantity                │
│ unit_price              │
│ notes                   │
│ subtotal                │
└────────┬────────────────┘
         │
         │ N:1
         │
         ▼
┌─────────────────────────┐       ┌─────────────────┐
│        Order            │  N:1  │     Table       │
│─────────────────────────│◄──────│─────────────────│
│ id (PK)                 │       │ id (PK)         │
│ table_id (FK)           │       │ number          │
│ customer_name           │       │ qr_code         │
│ status                  │       │ capacity        │
│ total_amount            │       │ active          │
│ notes                   │       │ created_at      │
│ created_at              │       └─────────────────┘
│ updated_at              │
│ ready_at                │
│ delivered_at            │
└─────────────────────────┘

┌─────────────────────────┐
│         User            │
│─────────────────────────│
│ id (PK)                 │
│ username                │
│ password (hashed)       │
│ email                   │
│ role (ADMIN/KITCHEN)    │
│ active                  │
│ created_at              │
│ last_login              │
└─────────────────────────┘
```

### Estados de Pedido (Order Status)

```
PENDING ──────────> EN_PREPARACION ──────────> LISTO ──────────> ENTREGADO
   │                                                                  │
   │                                                                  │
   └──────────────────────────> CANCELADO <─────────────────────────┘
```

**Estados**:
- `PENDING`: Pedido recibido, esperando preparación
- `EN_PREPARACION`: Cocina está preparando
- `LISTO`: Pedido completado, listo para entregar
- `ENTREGADO`: Pedido entregado al cliente
- `CANCELADO`: Pedido cancelado (por cliente o administrador)

### Índices de Base de Datos

```sql
-- Índices para optimizar consultas frecuentes

-- Orders
CREATE INDEX idx_orders_table_id ON orders(table_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Products
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_available ON products(available);

-- OrderItems
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- Tables
CREATE INDEX idx_tables_qr_code ON tables(qr_code) WHERE active = true;
```

## 🔐 Seguridad

### Autenticación y Autorización

**Flujo de Autenticación JWT**:

```
1. Usuario (Admin/Kitchen) → POST /api/auth/login
                             { username, password }
                                     │
                                     ▼
2. AuthController → AuthService → Valida credenciales (BCrypt)
                                     │
                                     ▼
3. Si válido → Genera JWT Token (HS256)
               {
                 sub: userId,
                 role: "ADMIN",
                 exp: 24h
               }
                                     │
                                     ▼
4. Retorna → { token, user: {id, username, role} }
                                     │
                                     ▼
5. Cliente guarda token → localStorage (con expiración)
                                     │
                                     ▼
6. Requests subsecuentes → Header: "Authorization: Bearer {token}"
                                     │
                                     ▼
7. JwtAuthenticationFilter → Valida token → Extrae usuario
                                     │
                                     ▼
8. SecurityContext → Usuario autenticado → Controller
```

**Niveles de Acceso**:

| Endpoint | Cliente (Sin Auth) | Kitchen | Admin |
|----------|-------------------|---------|-------|
| `GET /api/menu` | ✅ | ✅ | ✅ |
| `POST /api/orders` | ✅ | ✅ | ✅ |
| `GET /api/orders/{id}` | ✅ (solo su pedido) | ✅ | ✅ |
| `PATCH /api/orders/{id}/status` | ❌ | ✅ | ✅ |
| `GET /api/orders` | ❌ | ✅ | ✅ |
| `POST /api/products` | ❌ | ❌ | ✅ |
| `PUT /api/products/{id}` | ❌ | ❌ | ✅ |
| `DELETE /api/products/{id}` | ❌ | ❌ | ✅ |
| `POST /api/tables` | ❌ | ❌ | ✅ |

### Protección de Datos (Ley 1581/2012)

**Implementaciones**:

1. **Minimización de Datos**:
   - Solo se solicita nombre del cliente (opcional)
   - No se requiere email/teléfono para pedidos básicos

2. **Consentimiento Informado**:
   - Política de privacidad visible antes de realizar pedido
   - Checkbox de aceptación de términos

3. **Derecho de Acceso**:
   - Clientes pueden ver su pedido con código único
   - No se almacenan datos personales innecesarios

4. **Seguridad Técnica**:
   - HTTPS obligatorio en producción
   - Contraseñas hasheadas con BCrypt (factor 12)
   - Tokens JWT con expiración corta
   - CORS restringido a dominios específicos

5. **Logs de Auditoría**:
   - Registro de acciones críticas (creación/modificación de pedidos)
   - No se loguean datos personales sensibles

## 🚀 Escalabilidad y Performance

### Optimizaciones Implementadas

#### Frontend
- ✅ **Code Splitting**: Lazy loading de rutas
- ✅ **Image Optimization**: WebP con fallback
- ✅ **Bundle Optimization**: Tree shaking, minificación
- ✅ **Caching**: Service Worker para assets estáticos
- ✅ **Debouncing**: En búsquedas y filtros
- ✅ **Virtualización**: Listas largas (react-window)

#### Backend
- ✅ **Connection Pooling**: HikariCP (default Spring Boot)
- ✅ **Query Optimization**: Joins eficientes, índices
- ✅ **Lazy Loading**: Entidades JPA con fetch LAZY
- ✅ **Caching**: Spring Cache para menú (actualización cada 5 min)
- ✅ **Pagination**: Pedidos y productos paginados
- ✅ **Compression**: GZIP en responses

#### Base de Datos
- ✅ **Índices estratégicos**: En columnas frecuentemente consultadas
- ✅ **Particionamiento**: Tabla orders por fecha (cuando crece)
- ✅ **Vacuum automático**: Mantenimiento PostgreSQL
- ✅ **Prepared Statements**: Prevención de SQL Injection

### Estrategia de Caché

```
┌─────────────────────────────────────────────────┐
│              Caching Strategy                   │
├─────────────────────────────────────────────────┤
│                                                 │
│  Frontend (Browser):                            │
│  • Service Worker Cache: Assets estáticos (7d)  │
│  • LocalStorage: Token, preferencias (24h)      │
│  • Memory: Estado de aplicación (session)       │
│                                                 │
│  Backend (Spring Cache):                        │
│  • Menu completo: 5 minutos                     │
│  • Categorías: 1 hora                           │
│  • Configuración: 30 minutos                    │
│                                                 │
│  Database (PostgreSQL):                         │
│  • Query cache: Automático                      │
│  • Shared buffers: 25% RAM                      │
│                                                 │
└─────────────────────────────────────────────────┘
```

## 📈 Monitoreo y Observabilidad

### Métricas Clave (KPIs)

1. **Performance**:
   - Tiempo de carga inicial (< 2s)
   - Tiempo de respuesta API (< 200ms p95)
   - Throughput (requests/segundo)

2. **Negocio**:
   - Pedidos por hora
   - Tiempo promedio de preparación
   - Tasa de cancelación
   - Productos más vendidos

3. **Errores**:
   - Error rate (< 0.1%)
   - 5xx errors (< 0.01%)
   - Failed payments

### Logging

**Niveles por Ambiente**:

```yaml
# Development
logging.level.root: INFO
logging.level.com.cafelimon: DEBUG

# Production
logging.level.root: WARN
logging.level.com.cafelimon: INFO
```

**Formato de Logs** (JSON estructurado):

```json
{
  "timestamp": "2025-01-13T10:30:45.123Z",
  "level": "INFO",
  "logger": "com.cafelimon.service.OrderService",
  "message": "Order created successfully",
  "context": {
    "orderId": "ORD-20250113-001",
    "tableId": "mesa-01",
    "totalAmount": 25000,
    "itemCount": 3
  },
  "userId": "admin-01",
  "requestId": "uuid-1234-5678"
}
```

## 🔄 CI/CD Pipeline

```
GitHub Push (main)
      │
      ▼
┌─────────────────┐
│ GitHub Actions  │
│   - Checkout    │
│   - Setup Node  │
│   - Setup Java  │
└────────┬────────┘
         │
         ├──────────────────────┐
         │                      │
         ▼                      ▼
┌─────────────────┐    ┌──────────────────┐
│ Frontend CI     │    │  Backend CI      │
│  - npm install  │    │  - mvn test      │
│  - npm test     │    │  - mvn verify    │
│  - npm build    │    │  - mvn package   │
│  - Lint check   │    │  - Sonar scan    │
└────────┬────────┘    └────────┬─────────┘
         │                      │
         ▼                      ▼
┌─────────────────┐    ┌──────────────────┐
│  Vercel Deploy  │    │ Railway Deploy   │
│  (Frontend)     │    │  (Backend)       │
└────────┬────────┘    └────────┬─────────┘
         │                      │
         └──────────┬───────────┘
                    ▼
         ┌─────────────────────┐
         │  Integration Tests  │
         │  (E2E - Playwright) │
         └──────────┬──────────┘
                    │
                    ▼
         ┌─────────────────────┐
         │  Slack Notification │
         │  (Success/Failure)  │
         └─────────────────────┘
```

## 🧪 Estrategia de Testing

### Pirámide de Tests

```
              ╱╲
             ╱  ╲
            ╱ E2E╲         10% - Tests End-to-End
           ╱──────╲
          ╱        ╲
         ╱  Integr. ╲     30% - Tests de Integración
        ╱────────────╲
       ╱              ╲
      ╱   Unitarios    ╲   60% - Tests Unitarios
     ╱──────────────────╲
```

### Coverage Targets

- **Unitarios**: > 80%
- **Integración**: > 60%
- **E2E**: Flujos críticos (100% cobertura de user stories)

## 📚 Referencias y Recursos

### Estándares Seguidos

- **REST API**: OpenAPI 3.0 Specification
- **Seguridad Web**: OWASP Top 10
- **Accesibilidad**: WCAG 2.1 Level AA
- **Código**: Clean Code (Robert C. Martin)
- **Git**: Conventional Commits

### Documentación Adicional

- [API Reference](API.md)
- [Development Guide](DEVELOPMENT.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Contributing Guidelines](CONTRIBUTING.md)

---

**Última actualización**: 2025-01-13

**Versión**: 1.0.0

**Mantenido por**: Equipo Café Limón - Politécnico ASYS
