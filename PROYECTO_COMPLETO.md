# 🍋 Proyecto Café Limón - Documentación Completa

## 📋 Índice
1. [Descripción General](#descripción-general)
2. [Tecnologías Utilizadas](#tecnologías-utilizadas)
3. [Arquitectura del Sistema](#arquitectura-del-sistema)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Instalación y Configuración](#instalación-y-configuración)
6. [Docker - Configuración](#docker---configuración)
7. [Endpoints de la API](#endpoints-de-la-api)
8. [Flujo de QR y Pedidos](#flujo-de-qr-y-pedidos)
9. [Problemas Resueltos](#problemas-resueltos)
10. [Estado Actual](#estado-actual)
11. [Próximos Pasos](#próximos-pasos)

---

## 📖 Descripción General

**Café Limón** es un sistema de auto-ordenamiento basado en códigos QR para restaurantes. Los clientes escanean un código QR en su mesa, acceden al menú digital, realizan pedidos y los envían directamente a la cocina.

### Características Principales:
- ✅ Menú digital accesible vía QR
- ✅ Sistema de pedidos en tiempo real
- ✅ Panel administrativo para gestión
- ✅ Panel de cocina para preparación
- ✅ Autenticación con JWT
- ✅ WebSocket para actualizaciones en tiempo real
- ✅ 15 categorías de productos
- ✅ Gestión de mesas y pedidos

### Proyecto de Grado
Este sistema fue desarrollado como proyecto de grado para el Politécnico ASYS 2025.

---

## 🛠 Tecnologías Utilizadas

### Frontend
- **React 19.2.0** - Biblioteca de UI
- **Vite 5.4.11** - Build tool y dev server
- **Tailwind CSS 3.4.1** - Framework CSS
- **React Router DOM 7.1.1** - Enrutamiento
- **Zustand 5.0.2** - Gestión de estado
- **Axios 1.7.9** - Cliente HTTP
- **SockJS Client 1.6.1** - WebSocket
- **STOMP.js 2.3.3** - Protocolo de mensajería
- **React Hot Toast 2.4.1** - Notificaciones
- **Lucide React 0.469.0** - Iconos

### Backend
- **Java 17** - Lenguaje de programación
- **Spring Boot 3.2.1** - Framework principal
- **Spring Security** - Autenticación y autorización
- **Spring Data JPA** - ORM y persistencia
- **PostgreSQL** - Base de datos
- **JWT (JJWT 0.12.3)** - Tokens de autenticación
- **WebSocket** - Comunicación en tiempo real
- **Lombok** - Reducción de boilerplate
- **ZXing 3.5.2** - Generación de códigos QR
- **SpringDoc OpenAPI 2.3.0** - Documentación Swagger

### DevOps
- **Docker** - Contenedorización
- **Docker Compose** - Orquestación de contenedores
- **Maven** - Gestión de dependencias (Backend)
- **npm** - Gestión de dependencias (Frontend)

---

## 🏗 Arquitectura del Sistema

### Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENTE (Navegador)                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │   Menu     │  │   Carrito  │  │   Pedido   │        │
│  │  (Público) │  │  (Público) │  │  (Público) │        │
│  └────────────┘  └────────────┘  └────────────┘        │
└─────────────────────────────────────────────────────────┘
                         │
                         │ HTTP/WebSocket
                         ▼
┌─────────────────────────────────────────────────────────┐
│                 BACKEND (Spring Boot)                    │
│  ┌──────────────────────────────────────────────────┐   │
│  │              API REST Controllers                 │   │
│  │  • Auth  • Menu  • Orders  • Tables  • Products  │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Security (JWT Filter)                │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │                   Services                        │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │             Repositories (JPA)                    │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                         │
                         │ JDBC
                         ▼
┌─────────────────────────────────────────────────────────┐
│              BASE DE DATOS (PostgreSQL)                  │
│  • users       • tables      • categories               │
│  • products    • orders      • order_items              │
└─────────────────────────────────────────────────────────┘
```

### Flujo de Autenticación

```
Cliente → POST /api/auth/login → Backend
                                    ↓
                              Validar Usuario
                                    ↓
                              Generar JWT Token
                                    ↓
Cliente ← { token, user } ←  Backend
```

### Flujo de Pedido

```
1. Cliente escanea QR → /menu?table=M01
2. Cliente selecciona productos → Carrito
3. Cliente confirma pedido → POST /api/orders
4. Backend crea pedido → DB
5. WebSocket notifica → Panel de Cocina
6. Cocina prepara → Actualiza estado
7. WebSocket notifica → Cliente
```

---

## 📁 Estructura del Proyecto

```
Coffe/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/cafelimon/
│   │   │   │   ├── config/           # Configuraciones
│   │   │   │   │   ├── CorsConfig.java
│   │   │   │   │   ├── SecurityConfig.java
│   │   │   │   │   ├── SwaggerConfig.java
│   │   │   │   │   └── WebSocketConfig.java
│   │   │   │   ├── controller/       # Controladores REST
│   │   │   │   │   ├── AuthController.java
│   │   │   │   │   ├── CategoryController.java
│   │   │   │   │   ├── MenuController.java
│   │   │   │   │   ├── OrderController.java
│   │   │   │   │   ├── ProductController.java
│   │   │   │   │   ├── TableController.java
│   │   │   │   │   └── UserController.java
│   │   │   │   ├── dto/              # Data Transfer Objects
│   │   │   │   │   ├── auth/
│   │   │   │   │   ├── category/
│   │   │   │   │   ├── order/
│   │   │   │   │   ├── product/
│   │   │   │   │   └── table/
│   │   │   │   ├── exception/        # Manejo de excepciones
│   │   │   │   │   ├── GlobalExceptionHandler.java
│   │   │   │   │   └── ResourceNotFoundException.java
│   │   │   │   ├── model/            # Entidades JPA
│   │   │   │   │   ├── Category.java
│   │   │   │   │   ├── Order.java
│   │   │   │   │   ├── OrderItem.java
│   │   │   │   │   ├── OrderStatus.java
│   │   │   │   │   ├── Product.java
│   │   │   │   │   ├── Table.java
│   │   │   │   │   ├── User.java
│   │   │   │   │   └── UserRole.java
│   │   │   │   ├── repository/       # Repositorios JPA
│   │   │   │   │   ├── CategoryRepository.java
│   │   │   │   │   ├── OrderItemRepository.java
│   │   │   │   │   ├── OrderRepository.java
│   │   │   │   │   ├── ProductRepository.java
│   │   │   │   │   ├── TableRepository.java
│   │   │   │   │   └── UserRepository.java
│   │   │   │   ├── security/         # Seguridad JWT
│   │   │   │   │   ├── JwtAuthenticationFilter.java
│   │   │   │   │   └── JwtUtil.java
│   │   │   │   ├── service/          # Lógica de negocio
│   │   │   │   │   ├── CategoryService.java
│   │   │   │   │   ├── OrderService.java
│   │   │   │   │   ├── ProductService.java
│   │   │   │   │   ├── QRCodeService.java
│   │   │   │   │   ├── TableService.java
│   │   │   │   │   └── UserService.java
│   │   │   │   └── CafeLimonApplication.java
│   │   │   └── resources/
│   │   │       ├── application.yml           # Config principal
│   │   │       ├── application-dev.yml       # Config desarrollo
│   │   │       ├── application-qa.yml        # Config QA
│   │   │       ├── application-prod.yml      # Config producción
│   │   │       └── data-init.sql             # Datos iniciales
│   │   └── test/                             # Tests
│   ├── Dockerfile                            # Docker backend
│   ├── pom.xml                               # Dependencies Maven
│   └── mvnw                                  # Maven Wrapper
│
├── frontend/
│   ├── public/                               # Archivos estáticos
│   ├── src/
│   │   ├── components/                       # Componentes React
│   │   │   ├── admin/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── OrderManagement.jsx
│   │   │   │   └── ProductManagement.jsx
│   │   │   ├── kitchen/
│   │   │   │   └── KitchenDisplay.jsx
│   │   │   ├── menu/
│   │   │   │   ├── CategoryFilter.jsx
│   │   │   │   ├── MenuHeader.jsx
│   │   │   │   ├── ProductCard.jsx
│   │   │   │   └── ProductGrid.jsx
│   │   │   ├── cart/
│   │   │   │   ├── Cart.jsx
│   │   │   │   └── CartItem.jsx
│   │   │   ├── common/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Loading.jsx
│   │   │   │   └── Modal.jsx
│   │   │   └── layout/
│   │   │       ├── Header.jsx
│   │   │       └── Sidebar.jsx
│   │   ├── contexts/                         # React Context
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── hooks/                            # Custom Hooks
│   │   │   ├── useAuth.js
│   │   │   └── useWebSocket.js
│   │   ├── pages/                            # Páginas principales
│   │   │   ├── LoginPage.jsx
│   │   │   ├── MenuPage.jsx
│   │   │   ├── OrderConfirmationPage.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── KitchenPage.jsx
│   │   ├── services/                         # Servicios API
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── categoryService.js
│   │   │   ├── orderService.js
│   │   │   ├── productService.js
│   │   │   ├── tableService.js
│   │   │   └── websocketService.js
│   │   ├── store/                            # Zustand store
│   │   │   └── useStore.js
│   │   ├── utils/                            # Utilidades
│   │   │   ├── constants.js
│   │   │   └── formatters.js
│   │   ├── App.jsx                           # Componente principal
│   │   ├── main.jsx                          # Entry point
│   │   └── index.css                         # Estilos globales
│   ├── .env.development                      # Variables desarrollo
│   ├── .env.qa                               # Variables QA
│   ├── .env.production                       # Variables producción
│   ├── package.json                          # Dependencies npm
│   ├── vite.config.js                        # Config Vite
│   ├── tailwind.config.js                    # Config Tailwind
│   └── postcss.config.js                     # Config PostCSS
│
├── docs/                                     # Documentación
│   ├── BACKEND.md
│   ├── FRONTEND.md
│   ├── API.md
│   └── DEPLOYMENT.md
│
├── docker-compose.yml                        # Orquestación Docker
├── .dockerignore                             # Excluir archivos Docker
├── DOCKER_README.md                          # Guía Docker
├── INSTALAR_DOCKER.md                        # Instalar Docker macOS
├── FLUJO_QR.md                              # Flujo de QR
├── ESTADO_FINAL.md                          # Estado del proyecto
└── README.md                                # Readme principal
```

---

## 🚀 Instalación y Configuración

### Prerrequisitos

- **Node.js 18+** y **npm**
- **Java 17**
- **Docker Desktop** o **Colima**
- **Git**

### 1. Clonar el Repositorio

```bash
cd /Users/felix.garcia/Documents/Projects/myProjects/Asys/Coffe
```

### 2. Configurar el Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Crear archivo .env.development
cat > .env.development << 'EOF'
VITE_API_URL=http://localhost:8080
VITE_WS_URL=http://localhost:8080/ws
VITE_ENV=development
EOF

# Ejecutar en modo desarrollo
npm run dev
```

El frontend estará disponible en: **http://localhost:5173**

### 3. Configurar el Backend (SIN Docker)

```bash
cd backend

# Compilar
./mvnw clean install

# Ejecutar
./mvnw spring-boot:run
```

El backend estará disponible en: **http://localhost:8080**

---

## 🐳 Docker - Configuración

### Levantar el Sistema Completo con Docker

```bash
# Desde la raíz del proyecto
docker-compose up -d --build
```

### Servicios Levantados

1. **PostgreSQL** (puerto 5432)
   - Base de datos: `cafe_limon_dev`
   - Usuario: `postgres`
   - Contraseña: `postgres123`

2. **Backend Spring Boot** (puerto 8080)
   - Perfil: `prod`
   - Conectado a PostgreSQL

### Comandos Docker Útiles

```bash
# Ver logs del backend
docker-compose logs -f backend

# Ver logs de la base de datos
docker-compose logs -f postgres

# Ver estado de los contenedores
docker-compose ps

# Detener servicios
docker-compose stop

# Iniciar servicios
docker-compose start

# Reiniciar servicios
docker-compose restart

# Detener y eliminar todo
docker-compose down

# Detener y eliminar todo (incluyendo volúmenes)
docker-compose down -v

# Reconstruir desde cero
docker-compose down -v
docker-compose up -d --build
```

### Acceder a la Base de Datos

```bash
# Desde Docker
docker-compose exec postgres psql -U postgres -d cafe_limon_dev

# Desde tu máquina (si tienes psql instalado)
psql -h localhost -U postgres -d cafe_limon_dev
```

### Verificar que Todo Funciona

```bash
# Backend health check
curl http://localhost:8080/actuator/health

# API de mesas
curl http://localhost:8080/api/tables

# Swagger UI
open http://localhost:8080/swagger-ui.html
```

---

## 🔌 Endpoints de la API

### Base URL
```
http://localhost:8080
```

### Autenticación

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "username": "admin",
    "role": "ADMIN"
  }
}
```

#### Registro
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "usuario",
  "email": "usuario@ejemplo.com",
  "password": "password123",
  "role": "ADMIN"
}
```

### Mesas

#### Listar todas las mesas
```http
GET /api/tables
```

#### Obtener mesa por ID
```http
GET /api/tables/{id}
```

#### Crear mesa (Requiere autenticación)
```http
POST /api/tables
Authorization: Bearer {token}
Content-Type: application/json

{
  "number": "M10",
  "capacity": 4,
  "location": "Terraza"
}
```

#### Generar QR para mesa
```http
GET /api/tables/{id}/qr
```

### Categorías

#### Listar categorías activas
```http
GET /api/categories/active
```

#### Listar todas las categorías (Requiere autenticación)
```http
GET /api/categories
Authorization: Bearer {token}
```

### Productos

#### Listar productos por categoría
```http
GET /api/products/category/{categoryId}
```

#### Buscar productos
```http
GET /api/products/search?query=cafe
```

### Menú

#### Obtener menú de una mesa
```http
GET /api/menu/table/{tableId}

Response:
{
  "table": { ... },
  "categories": [ ... ],
  "products": [ ... ]
}
```

### Pedidos

#### Crear pedido
```http
POST /api/orders
Content-Type: application/json

{
  "tableId": "uuid",
  "customerName": "Juan Pérez",
  "items": [
    {
      "productId": "uuid",
      "quantity": 2,
      "notes": "Sin azúcar"
    }
  ],
  "notes": "Para llevar"
}
```

#### Listar pedidos activos
```http
GET /api/orders/active
```

#### Obtener pedido por ID
```http
GET /api/orders/{id}
```

#### Actualizar estado del pedido (Requiere autenticación)
```http
PUT /api/orders/{id}/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "EN_PREPARACION"
}
```

Estados posibles:
- `PENDING` - Pendiente
- `EN_PREPARACION` - En preparación
- `LISTO` - Listo
- `ENTREGADO` - Entregado
- `CANCELADO` - Cancelado

### WebSocket

#### Conectar
```javascript
const socket = new SockJS('http://localhost:8080/ws');
const stompClient = Stomp.over(socket);

stompClient.connect({}, function(frame) {
  // Suscribirse a nuevos pedidos
  stompClient.subscribe('/topic/orders/new', function(message) {
    const order = JSON.parse(message.body);
    console.log('Nuevo pedido:', order);
  });

  // Suscribirse a actualizaciones de pedidos
  stompClient.subscribe('/topic/orders/updates', function(message) {
    const order = JSON.parse(message.body);
    console.log('Pedido actualizado:', order);
  });
});
```

---

## 📱 Flujo de QR y Pedidos

### 1. Generación de QR

Cada mesa tiene un código QR único que dirige a:
```
http://localhost:5173/menu?table=M01
```

### 2. Cliente Escanea QR

```
Cliente → Escanea QR en Mesa M01
       ↓
Navegador abre: /menu?table=M01
       ↓
Frontend carga: MenuPage.jsx
       ↓
API Request: GET /api/menu/table/{tableId}
       ↓
Backend responde con:
  - Información de la mesa
  - Categorías activas
  - Productos disponibles
```

### 3. Cliente Selecciona Productos

```
Cliente → Navega por categorías
       ↓
Cliente → Selecciona productos
       ↓
Productos se agregan al carrito (CartContext)
       ↓
Cliente → Revisa carrito
       ↓
Cliente → Confirma pedido
```

### 4. Envío del Pedido

```
Cliente → Click en "Confirmar Pedido"
       ↓
Frontend → POST /api/orders
       ↓
Backend:
  1. Valida datos
  2. Calcula total
  3. Crea pedido en BD
  4. Envía notificación WebSocket
       ↓
Respuesta → OrderConfirmationPage
       ↓
Cliente ve número de pedido
```

### 5. Cocina Recibe Pedido

```
WebSocket → /topic/orders/new
       ↓
Panel de Cocina actualiza (KitchenDisplay.jsx)
       ↓
Cocina ve:
  - Mesa
  - Productos
  - Notas especiales
  - Timestamp
```

### 6. Preparación y Entrega

```
Cocina → Marca como "En Preparación"
       ↓
PUT /api/orders/{id}/status { status: "EN_PREPARACION" }
       ↓
WebSocket → /topic/orders/updates
       ↓
Cliente ve actualización
       ↓
Cocina → Marca como "Listo"
       ↓
Mesero → Entrega pedido
       ↓
Cocina → Marca como "Entregado"
```

---

## ⚠️ Problemas Resueltos

### 1. Tailwind CSS PostCSS Error

**Problema:**
```
[postcss] It looks like you're trying to use tailwindcss directly as a PostCSS plugin
```

**Causa:** Tailwind v4.1.17 cambió la arquitectura

**Solución:**
- Desinstalé Tailwind v4.1.17
- Instalé Tailwind v3.4.1
- Creé `postcss.config.js` con configuración v3
- Reordené `@import` en `index.css`

### 2. Compilación Backend - Double to BigDecimal

**Problema:**
```
incompatible types: java.lang.Double cannot be converted to java.math.BigDecimal
```

**Solución:**
Cambié todos los campos de precio de `Double` a `BigDecimal`:
- `Product.java`: `private BigDecimal price`
- `Order.java`: `private BigDecimal totalAmount`
- `OrderItem.java`: `private BigDecimal unitPrice`, `private BigDecimal subtotal`

### 3. Dependencia Circular en Spring

**Problema:**
```
The dependencies of some of the beans in the application context form a cycle:
userService ↔ securityConfig
```

**Solución:**
Agregué `@Lazy` en `UserService`:
```java
public UserService(UserRepository userRepository, @Lazy PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
}
```

### 4. Docker - Alpine Images Not Available

**Problema:**
```
no match for platform in manifest: eclipse-temurin:17-jdk-alpine not found
```

**Solución:**
Cambié en `Dockerfile`:
```dockerfile
# De:
FROM eclipse-temurin:17-jdk-alpine

# A:
FROM eclipse-temurin:17-jdk
```

### 5. Docker - No Space Left on Device

**Problema:**
```
initdb: error: could not create directory: No space left on device
```

**Solución:**
```bash
docker system prune -a -f --volumes
```

### 6. Health Check Failing

**Problema:**
Health check retornaba 403 Forbidden

**Solución:**
Agregué en `SecurityConfig.java`:
```java
.requestMatchers("/actuator/health/**", "/actuator/health").permitAll()
```

---

## ✅ Estado Actual

### Backend ✅
- [x] API REST completa
- [x] Autenticación JWT
- [x] WebSocket configurado
- [x] Base de datos PostgreSQL
- [x] Docker configurado
- [x] Swagger UI funcional
- [x] Datos iniciales (15 categorías)
- [x] Usuarios de prueba creados
- [x] Generación de QR

### Frontend ✅
- [x] Página de menú funcional
- [x] Carrito de compras
- [x] Sistema de pedidos
- [x] Panel administrativo
- [x] Panel de cocina
- [x] WebSocket integrado
- [x] Responsive design
- [x] Soporte para QR con query string

### Docker ✅
- [x] Dockerfile backend
- [x] docker-compose.yml
- [x] PostgreSQL containerizado
- [x] Health checks configurados
- [x] Volúmenes persistentes
- [x] Init script de base de datos
- [x] Documentación completa

### Datos Inicializados ✅

**Categorías (15):**
1. Bebidas Calientes
2. Bebidas Frías
3. Helados
4. Cerveza Internacional
5. Cocteles
6. Tragos
7. Cerveza Nacional
8. Coca Cola
9. Repostería
10. Gaseosas
11. Delicias de la Casa
12. Dulces y Mecatos
13. Licores
14. Panadería
15. Postobón

**Usuarios de Prueba:**
- **Admin:**
  - Username: `admin`
  - Password: `admin123`
  - Rol: ADMIN

- **Cocina:**
  - Username: `cocina`
  - Password: `cocina123`
  - Rol: KITCHEN

**Mesas:**
- M01, M02, M03, M04, M05

---

## 🚧 Próximos Pasos

### Funcionalidades Pendientes

1. **Autenticación Frontend**
   - [ ] Integrar login en frontend
   - [ ] Proteger rutas privadas
   - [ ] Refresh token

2. **Gestión de Productos**
   - [ ] CRUD completo de productos
   - [ ] Subida de imágenes
   - [ ] Stock management

3. **Reportes**
   - [ ] Ventas por día
   - [ ] Productos más vendidos
   - [ ] Reporte de mesas

4. **Notificaciones**
   - [ ] Push notifications
   - [ ] Sonido al recibir pedido
   - [ ] Email confirmación

5. **Pagos**
   - [ ] Integración pasarela de pago
   - [ ] Múltiples métodos de pago
   - [ ] Facturación

### Mejoras Técnicas

1. **Tests**
   - [ ] Unit tests backend
   - [ ] Integration tests
   - [ ] E2E tests frontend

2. **Performance**
   - [ ] Lazy loading
   - [ ] Image optimization
   - [ ] Caching

3. **Seguridad**
   - [ ] Rate limiting
   - [ ] HTTPS
   - [ ] Sanitización de inputs

4. **Deployment**
   - [ ] CI/CD pipeline
   - [ ] Kubernetes
   - [ ] Monitoring (Prometheus + Grafana)

---

## 📚 Documentación Adicional

- **[DOCKER_README.md](./DOCKER_README.md)** - Guía completa de Docker
- **[INSTALAR_DOCKER.md](./INSTALAR_DOCKER.md)** - Instalación de Docker en macOS
- **[FLUJO_QR.md](./FLUJO_QR.md)** - Flujo detallado del sistema QR
- **[FRONTEND.md](./docs/FRONTEND.md)** - Documentación del frontend
- **[BACKEND.md](./docs/BACKEND.md)** - Documentación del backend

---

## 🔗 URLs Importantes

### Desarrollo
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **PostgreSQL**: localhost:5432

### Producción
- **Backend**: `https://api.cafelimon.com` (por configurar)
- **Frontend**: `https://cafelimon.com` (por configurar)

---

## 👨‍💻 Autor

**Proyecto de Grado**
Politécnico ASYS 2025
Desarrollado con Claude Code

---

## 📄 Licencia

Este proyecto fue desarrollado como proyecto de grado académico.

---

## 🙏 Agradecimientos

- Spring Boot Team
- React Team
- PostgreSQL Team
- Docker Team
- Anthropic (Claude Code)

---

**Última actualización:** 14 de Noviembre, 2025
**Versión:** 1.0.0
**Estado:** ✅ Funcional y Dockerizado
