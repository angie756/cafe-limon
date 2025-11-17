# Sistema de Auto Pedido - Café Limón ☕

> Sistema de gestión de pedidos mediante códigos QR para optimizar la atención en Café Limón - El Carmen de Viboral, Antioquia

[![React](https://img.shields.io/badge/React-18.x-61dafb?logo=react)](https://reactjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.1-6db33f?logo=spring)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169e1?logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ed?logo=docker)](https://www.docker.com/)

## 📋 Descripción del Proyecto

Sistema completo de auto-pedido con códigos QR que digitaliza la experiencia del cliente en Café Limón:

- ✅ **Menú Digital Interactivo** - 151 productos organizados en 15 categorías
- ✅ **Pedidos en Tiempo Real** - WebSockets para notificaciones instantáneas
- ✅ **Panel de Cocina** - Gestión de pedidos con estados (Pendiente → En Preparación → Listo → Entregado)
- ✅ **Panel de Administración** - Control total del menú, mesas y estadísticas
- ✅ **Códigos QR por Mesa** - Acceso directo al menú desde cada mesa
- ✅ **Sin Registro de Cliente** - Experiencia fluida sin crear cuentas

## 🚀 Inicio Rápido con Docker

### Prerrequisitos

- Docker Desktop instalado
- Git
- Puerto 8080 (backend) y 5173 (frontend) disponibles

### Instalación en 3 Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/cafe-limon.git
cd cafe-limon

# 2. Levantar servicios con Docker
docker compose up -d

# 3. Ejecutar script de setup inicial
docker exec -it cafe-limon-db psql -U postgres -d cafe_limon_dev -f /docker-entrypoint-initdb.d/setup-complete.sql
```

**¡Listo!** El sistema está funcionando:

- 🌐 **Frontend**: http://localhost:5173
- 🔧 **Backend**: http://localhost:8080
- 📊 **Base de Datos**: localhost:5432

### Credenciales de Acceso

```bash
# Administrador
Usuario: admin
Contraseña: admin123
URL: http://localhost:5173/login

# Personal de Cocina
Usuario: cocina
Contraseña: cocina123
URL: http://localhost:5173/login

# Cliente (Sin login)
URL: http://localhost:5173/menu/2  # Mesa 2
```

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                   CLIENTE (Escanea QR)                      │
│              http://localhost:5173/menu/{mesa}              │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                 FRONTEND (React + Vite)                     │
│  • Menú Digital con 151 productos                           │
│  • Carrito de Compras con localStorage                      │
│  • Seguimiento de Pedidos en tiempo real                    │
│  • Panel de Cocina (WebSocket)                              │
│  • Panel de Administración                                  │
└──────────────────────┬──────────────────────────────────────┘
                       │ REST API + WebSockets
                       ▼
┌─────────────────────────────────────────────────────────────┐
│             BACKEND (Spring Boot 3.2.1)                     │
│  • API REST (Java 17)                                       │
│  • JWT Authentication                                        │
│  • WebSocket con Socket.IO                                  │
│  • Generación de QR Codes                                   │
│  • Gestión de pedidos con estados                           │
└──────────────────────┬──────────────────────────────────────┘
                       │ JPA/Hibernate
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              BASE DE DATOS (PostgreSQL 16)                  │
│  • 2 usuarios (admin, cocina)                               │
│  • 6 mesas configuradas                                     │
│  • 15 categorías de productos                               │
│  • 151 productos del menú                                   │
└─────────────────────────────────────────────────────────────┘
```

## 📱 Flujo de Pedidos

### Estados del Pedido

1. **PENDING** (Pendiente) - Pedido recibido, esperando que cocina lo vea
2. **EN_PREPARACION** (En Preparación) - Cocina está preparando el pedido
3. **LISTO** (Listo) - Pedido terminado, esperando entrega
4. **ENTREGADO** (Entregado) - Admin/mesero confirma entrega al cliente

### Diagrama de Flujo

```
CLIENTE                  COCINA                  ADMIN
   │                        │                       │
   │ 1. Escanea QR          │                       │
   │ 2. Ve menú            │                       │
   │ 3. Agrega productos   │                       │
   │ 4. Confirma pedido    │                       │
   │─────────────PENDING──>│                       │
   │                        │ 5. Inicia prep        │
   │<────NOTIFICACIÓN──────│                       │
   │                        │──EN_PREPARACION───>   │
   │                        │ 6. Marca listo        │
   │<────NOTIFICACIÓN*─────│                       │
   │                        │────────LISTO──────>   │
   │                        │                       │ 7. Entrega
   │<─────────────────────ENTREGADO───────────────│

*Solo usuarios autenticados reciben notificaciones WebSocket en tiempo real
```

## 🎯 Funcionalidades Implementadas

### Para Clientes (Sin Login)

- ✅ Escanear QR y acceder al menú de su mesa
- ✅ Navegar por 15 categorías de productos
- ✅ Buscar productos por nombre
- ✅ Agregar productos al carrito con notas especiales
- ✅ Ver resumen del pedido con total calculado
- ✅ Confirmar pedido
- ✅ Seguimiento del estado del pedido (requiere recarga manual)
- ✅ Llamar al mesero con un botón

### Para Personal de Cocina (Login Requerido)

- ✅ Ver pedidos en tiempo real con WebSocket
- ✅ Organizar pedidos en columnas: Pendientes / En Preparación / Listos
- ✅ Iniciar preparación de pedidos pendientes
- ✅ Marcar pedidos como listos
- ✅ Ver notas especiales de cada producto
- ✅ Ver tiempo transcurrido desde que se hizo el pedido
- ✅ Notificación sonora y visual de nuevos pedidos

### Para Administradores (Login Requerido)

- ✅ Dashboard con estadísticas:
  - Pedidos activos
  - Total de pedidos del día
  - Ingresos del día (solo pedidos ENTREGADOS)
- ✅ Ver lista de pedidos recientes con estados
- ✅ Marcar pedidos como ENTREGADO
- ✅ Ver número de mesa en cada pedido
- ✅ Acceso a gestión de mesas, productos y categorías

## 📦 Estructura del Proyecto

```
cafe-limon/
├── backend/                    # Spring Boot 3.2.1 + Java 17
│   ├── src/main/java/com/cafelimon/
│   │   ├── config/             # Configuraciones (Security, WebSocket, CORS)
│   │   ├── controller/         # REST Controllers
│   │   ├── dto/                # Data Transfer Objects
│   │   ├── exception/          # Manejo de excepciones
│   │   ├── model/              # Entidades JPA
│   │   ├── repository/         # Repositorios JPA
│   │   ├── security/           # JWT + Spring Security
│   │   ├── service/            # Lógica de negocio
│   │   └── websocket/          # WebSocket handlers
│   ├── src/main/resources/
│   │   ├── application.yml     # Configuración principal
│   │   └── application-dev.yml # Configuración desarrollo
│   ├── mvnw                    # Maven Wrapper
│   ├── pom.xml                 # Dependencias Maven
│   └── Dockerfile              # Imagen Docker del backend
│
├── frontend/                   # React 18 + Vite
│   ├── src/
│   │   ├── components/         # Componentes reutilizables
│   │   │   ├── ui/             # Button, Card, Badge, Spinner...
│   │   │   └── layout/         # Layout, Header, Footer
│   │   ├── context/            # Context API (Auth, Cart)
│   │   ├── hooks/              # Custom Hooks (useMenu, useOrders, useWebSocket)
│   │   ├── pages/              # Páginas principales
│   │   │   ├── MenuPage.jsx    # Menú digital para clientes
│   │   │   ├── CartPage.jsx    # Carrito de compras
│   │   │   ├── OrderStatusPage.jsx  # Seguimiento de pedido
│   │   │   ├── KitchenPage.jsx      # Panel de cocina
│   │   │   ├── AdminPage.jsx        # Panel de administración
│   │   │   └── LoginPage.jsx        # Login admin/cocina
│   │   ├── services/           # API calls (Axios)
│   │   ├── utils/              # Utilidades (formatters, validators)
│   │   └── constants/          # Constantes (API_URL, ORDER_STATUS...)
│   ├── public/                 # Archivos estáticos
│   ├── .env                    # Variables de entorno
│   ├── package.json            # Dependencias npm
│   ├── tailwind.config.js      # Configuración Tailwind CSS
│   └── vite.config.js          # Configuración Vite
│
├── database/                   # Scripts de base de datos
│   ├── init.sql                # Esquema inicial (tablas, índices)
│   ├── setup-complete.sql      # Setup completo con datos
│   └── README.md               # Documentación de la BD
│
├── docs/                       # Documentación del proyecto
│   ├── ARCHITECTURE.md         # Arquitectura detallada
│   ├── API.md                  # Documentación de endpoints
│   ├── DEPLOYMENT.md           # Guía de deployment
│   └── REQUIREMENTS.md         # Requerimientos funcionales
│
├── docker-compose.yml          # Orquestación de servicios
├── .gitignore                  # Archivos ignorados por git
└── README.md                   # Este archivo
```

## 🛠️ Stack Tecnológico Detallado

### Backend
- **Java 17** - Lenguaje de programación
- **Spring Boot 3.2.1** - Framework principal
- **Spring Data JPA** - ORM con Hibernate
- **Spring Security** - Autenticación y autorización
- **JWT** - Tokens de autenticación
- **BCrypt** - Hash de contraseñas
- **Socket.IO (Java)** - WebSockets para tiempo real
- **ZXing** - Generación de códigos QR
- **PostgreSQL Driver** - Conexión a base de datos
- **Lombok** - Reducción de boilerplate
- **Jakarta Validation** - Validación de datos

### Frontend
- **React 19.2.0** - Librería UI
- **Vite 5.4.11** - Build tool y dev server
- **Vitest 4.0.9** - Testing framework
- **Tailwind CSS 3.4** - Framework CSS utility-first
- **React Router 7.9.6** - Routing
- **Axios 1.13.2** - Cliente HTTP
- **Socket.IO Client 4.8.1** - WebSockets cliente
- **React Hot Toast** - Notificaciones
- **Lucide React** - Iconos SVG
- **Zustand 5.0.8** - Estado global (alternativa a Context API)

### Base de Datos
- **PostgreSQL 16** - Base de datos relacional
- **UUID** - IDs únicos para entidades
- **Timestamps** - Auditoría automática (createdAt, updatedAt)

### DevOps
- **Docker 27.x** - Containerización
- **Docker Compose** - Orquestación multi-contenedor
- **Maven 3.9** - Build tool para Java

## 📊 Base de Datos

### Entidades Principales

| Tabla | Descripción | Registros |
|-------|-------------|-----------|
| `users` | Usuarios del sistema (admin, cocina) | 2 |
| `categories` | Categorías de productos | 15 |
| `products` | Productos del menú | 151 |
| `tables` | Mesas del café con QR codes | 6 |
| `orders` | Pedidos de clientes | Variable |
| `order_items` | Ítems de cada pedido | Variable |

### Diagrama ER Simplificado

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   USERS     │       │   TABLES    │       │ CATEGORIES  │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (UUID)   │       │ id (UUID)   │       │ id (UUID)   │
│ username    │       │ number      │       │ name        │
│ password    │       │ capacity    │       │ description │
│ email       │       │ qr_code     │       │ icon        │
│ role        │       │ active      │       │ order_index │
└─────────────┘       └─────────────┘       └─────────────┘
                             │                      │
                             │                      │
                      ┌──────▼──────┐       ┌───────▼──────┐
                      │   ORDERS    │       │   PRODUCTS   │
                      ├─────────────┤       ├──────────────┤
                      │ id (UUID)   │       │ id (UUID)    │
                      │ table_id    │───┐   │ name         │
                      │ customer    │   │   │ description  │
                      │ status      │   │   │ price        │
                      │ total       │   │   │ category_id  │────┘
                      │ created_at  │   │   │ available    │
                      └─────────────┘   │   └──────────────┘
                             │          │          │
                             │          │          │
                      ┌──────▼──────────▼──────────▼──┐
                      │       ORDER_ITEMS             │
                      ├───────────────────────────────┤
                      │ id (UUID)                     │
                      │ order_id                      │
                      │ product_id                    │
                      │ quantity                      │
                      │ unit_price                    │
                      │ notes                         │
                      └───────────────────────────────┘
```

## 🔧 Comandos Útiles

### Docker

```bash
# Levantar todos los servicios
docker compose up -d

# Ver logs en tiempo real
docker compose logs -f

# Ver logs solo del backend
docker compose logs -f backend

# Ver logs solo de la base de datos
docker compose logs -f database

# Reiniciar un servicio específico
docker compose restart backend

# Detener todos los servicios
docker compose down

# Detener y eliminar volúmenes (CUIDADO: borra la BD)
docker compose down -v

# Reconstruir imágenes
docker compose up -d --build

# Entrar a la shell de PostgreSQL
docker exec -it cafe-limon-db psql -U postgres -d cafe_limon_dev
```

### Backend (Sin Docker)

```bash
cd backend

# Compilar proyecto
./mvnw clean package -DskipTests

# Ejecutar en desarrollo
./mvnw spring-boot:run

# Ejecutar tests
./mvnw test

# Limpiar target/
./mvnw clean
```

### Frontend (Sin Docker)

```bash
cd frontend

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build

# Preview de build
npm run preview

# Linting
npm run lint
```

### Base de Datos

```bash
# Resetear base de datos completa
docker exec -it cafe-limon-db psql -U postgres -d cafe_limon_dev -f /docker-entrypoint-initdb.d/setup-complete.sql

# Backup de la base de datos
docker exec cafe-limon-db pg_dump -U postgres cafe_limon_dev > backup.sql

# Restaurar backup
docker exec -i cafe-limon-db psql -U postgres cafe_limon_dev < backup.sql

# Ver tablas
docker exec -it cafe-limon-db psql -U postgres -d cafe_limon_dev -c "\dt"

# Consultar productos
docker exec -it cafe-limon-db psql -U postgres -d cafe_limon_dev -c "SELECT id, name, price FROM products LIMIT 10;"
```

## 🧪 Testing y Calidad del Código

### Cobertura de Pruebas Unitarias

**Backend (Spring Boot + JUnit 5)**
- ✅ **180 tests** ejecutándose exitosamente
- ✅ **92% de cobertura** de código (JaCoCo)
- ✅ Pruebas de servicios: ProductService, OrderService, AuthService, UserService, CategoryService, TableService, StatsService, MenuService, QRCodeService, WebSocketService
- ✅ Pruebas de controladores con MockMvc
- ✅ Pruebas de excepciones y validaciones

**Frontend (React + Vitest)**
- ✅ **240 tests pasando** de 246 totales (97.6% tasa de éxito)
- ✅ Configuración de Vitest + React Testing Library
- ✅ Pruebas de utilidades: formatters, validators, localStorage
- ✅ Pruebas de servicios: api, auth, menu, order, table, websocket
- ✅ Pruebas de hooks: useMenu, useOrders, useWebSocket

### Ejecutar Pruebas

```bash
# Backend - Ejecutar todos los tests con cobertura
cd backend
./mvnw test
./mvnw jacoco:report

# Ver reporte de cobertura
open target/site/jacoco/index.html

# Frontend - Ejecutar todos los tests
cd frontend
npm test

# Ver cobertura del frontend
npm run test:coverage
```

### Test Manual Completo

#### 1. Test del Cliente

```bash
# 1. Abrir el menú de la mesa 2
http://localhost:5173/menu/2

# 2. Verificar que se muestran los 151 productos
# 3. Filtrar por categoría "Bebidas Calientes"
# 4. Buscar "Tinto"
# 5. Agregar 2x Tinto Tradicional al carrito
# 6. Agregar nota: "Muy caliente"
# 7. Ver carrito
# 8. Confirmar pedido
# 9. Verificar que se muestra el ID del pedido
# 10. Ir al seguimiento del pedido
# 11. Verificar estado: PENDING
```

#### 2. Test de Cocina

```bash
# 1. Login como cocina
http://localhost:5173/login
Usuario: cocina
Contraseña: cocina123

# 2. Verificar que aparece el pedido en "Pendientes"
# 3. Click en "Iniciar Preparación"
# 4. Verificar que pasa a "En Preparación"
# 5. Click en "Marcar como Listo"
# 6. Verificar que pasa a "Listos"
```

#### 3. Test de Admin

```bash
# 1. Login como admin
http://localhost:5173/login
Usuario: admin
Contraseña: admin123

# 2. Verificar estadísticas del dashboard
# 3. Ver pedido en "Pedidos Recientes"
# 4. Verificar que muestra "Mesa 2"
# 5. Click en "Marcar Entregado"
# 6. Verificar que "Ingresos Hoy" se actualiza
```

#### 4. Test de API

```bash
# Obtener todos los productos
curl http://localhost:8080/api/products | jq

# Obtener menú de la mesa 2
curl http://localhost:8080/api/menu/table/2 | jq

# Login como admin
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' | jq

# Ver pedidos activos (requiere JWT token del login anterior)
curl http://localhost:8080/api/orders/active \
  -H "Authorization: Bearer {TOKEN}" | jq
```

## 🔐 Seguridad

### Implementaciones de Seguridad

- ✅ **Autenticación JWT** - Tokens con expiración configurable
- ✅ **BCrypt** - Hash de contraseñas (cost factor 10)
- ✅ **CORS** - Configurado solo para orígenes permitidos
- ✅ **Spring Security** - Protección de endpoints
- ✅ **SQL Injection** - Prevención con JPA/Hibernate
- ✅ **XSS Protection** - Headers de seguridad configurados
- ✅ **Validación de Inputs** - Jakarta Validation en DTOs

### Endpoints Públicos

```java
// No requieren autenticación
GET  /api/menu/**           // Menú completo y por mesa
GET  /api/categories/active // Categorías activas
GET  /api/products/**       // Lista de productos
GET  /api/tables/{id}       // Info de mesa
GET  /api/tables/number/**  // Mesa por número
POST /api/orders            // Crear pedido (cliente)
```

### Endpoints Protegidos

```java
// Requieren JWT token válido
POST   /api/auth/logout     // Cerrar sesión
GET    /api/auth/profile    // Perfil del usuario
PATCH  /api/orders/{id}/status  // Actualizar estado (ADMIN/KITCHEN)
GET    /api/orders/active   // Pedidos activos (KITCHEN)
DELETE /api/orders/{id}     // Eliminar pedido (ADMIN)
```

## 📈 Performance y Optimización

### Métricas Actuales

- **API Response Time**: < 150ms (promedio)
- **Frontend First Load**: < 2s
- **WebSocket Latency**: < 100ms
- **Database Queries**: Optimizadas con índices

### Optimizaciones Implementadas

- ✅ Lazy initialization en React Context
- ✅ Debounce en búsqueda de productos
- ✅ Índices en BD para consultas frecuentes
- ✅ Cache de datos estáticos (categorías, productos)
- ✅ Tailwind CSS purge en producción
- ✅ Vite build optimization

## 🐛 Troubleshooting

### Problema: Backend no inicia

```bash
# Verificar que PostgreSQL está corriendo
docker compose ps

# Ver logs del backend
docker compose logs backend

# Verificar puerto 8080 disponible
lsof -i :8080

# Reconstruir backend
docker compose up -d --build backend
```

### Problema: Frontend no carga productos

```bash
# Verificar que backend está corriendo
curl http://localhost:8080/api/products

# Verificar configuración de API_URL en frontend
cat frontend/.env

# Ver consola del navegador para errores
# Abrir DevTools > Console
```

### Problema: WebSocket no conecta

```bash
# Verificar que el backend tiene WebSocket habilitado
docker compose logs backend | grep WebSocket

# Verificar en frontend (consola del navegador):
# ✅ Debe mostrar: "✅ WebSocket conectado: {socket-id}"
# ❌ Si muestra: "⚠️ Error de conexión WebSocket"
# Entonces reiniciar backend:
docker compose restart backend
```

### Problema: Base de datos vacía

```bash
# Ejecutar script de setup completo
docker exec -it cafe-limon-db psql -U postgres -d cafe_limon_dev -f /docker-entrypoint-initdb.d/setup-complete.sql

# Verificar que se crearon los datos
docker exec -it cafe-limon-db psql -U postgres -d cafe_limon_dev -c "SELECT COUNT(*) FROM products;"
# Debe retornar: 151
```

## 🚀 Despliegue en Producción

El proyecto está listo para desplegarse en plataformas gratuitas:

### Opción Recomendada (Gratuita)

- **Frontend**: Vercel (gratis ilimitado, 100GB bandwidth/mes)
- **Backend + Base de Datos**: Railway ($5 crédito mensual gratis, ~500 horas/mes)

### Guías de Despliegue

📖 **[QUICK-DEPLOY.md](QUICK-DEPLOY.md)** - Despliega en 10 minutos
- Git setup y push a GitHub
- Configurar Railway para backend + PostgreSQL
- Configurar Vercel para frontend
- Variables de entorno de producción

📖 **[DEPLOYMENT.md](DEPLOYMENT.md)** - Guía completa y detallada
- Preparación paso a paso
- Dockerización del backend
- Build del frontend
- Verificación del despliegue
- Troubleshooting y mantenimiento
- Costos y límites de las plataformas

### Archivos de Configuración Incluidos

```
✅ backend/Dockerfile          # Imagen Docker multi-stage
✅ backend/railway.json         # Configuración Railway
✅ frontend/vercel.json         # Configuración Vercel
✅ frontend/.env.production.example  # Template de variables de entorno
✅ .gitignore                   # Exclusiones de Git
```

## 📚 Documentación Adicional

- [Arquitectura del Sistema](docs/ARCHITECTURE.md)
- [Documentación de API](docs/API.md)
- [Guía de Deployment Completa](DEPLOYMENT.md)
- [Guía Rápida de Deployment](QUICK-DEPLOY.md)
- [Requerimientos del Proyecto](docs/REQUIREMENTS.md)
- [Base de Datos](database/README.md)

## 🔄 Roadmap Futuro

### Próximas Funcionalidades

- [ ] Pasarela de pagos integrada (PSE, tarjetas)
- [ ] Sistema de propinas digital
- [ ] Calificación de productos
- [ ] Historial de pedidos del cliente
- [ ] Promociones y descuentos
- [ ] Modo offline con sincronización
- [ ] PWA (Progressive Web App)
- [ ] Notificaciones push
- [ ] Analytics avanzados
- [ ] Multi-idioma (ES/EN)

## 👥 Equipo

- **Desarrolladora**: Angie Melissa Gutierrez Quintana
- **Asesor Técnico**: Juan Guillermo Henao
- **Asesor Metodológico**: Dacelly Duque Hincapié
- **Institución**: Politécnico ASYS - Rionegro, 2025

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- **Café Limón** - Por permitir el desarrollo de este proyecto
- **Politécnico ASYS** - Por el apoyo académico y recursos
- **Comunidad Open Source** - Por las herramientas y bibliotecas utilizadas

---

**Desarrollado con ❤️ para Café Limón - El Carmen de Viboral, Antioquia**

**Proyecto de Grado - Técnico Auxiliar Desarrollo y Análisis de Software**

**Politécnico ASYS © 2025**
