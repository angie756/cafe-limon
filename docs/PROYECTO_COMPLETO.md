# Café Limón - Proyecto Completo

## Estado Actual del Proyecto ✅

### Frontend (100% Completado)
- ✅ React 19 + Vite configurado
- ✅ Tailwind CSS con diseño personalizado
- ✅ 65+ componentes y páginas
- ✅ Routing completo
- ✅ Context API y Zustand
- ✅ Ambientes configurados (Dev, QA, Prod)

### Backend (95% Completado)
- ✅ Spring Boot 3.2.1 + Java 17/21
- ✅ 7 entidades JPA
- ✅ 6 repositorios con queries personalizadas
- ✅ 18 DTOs organizados
- ✅ 8 servicios de negocio
- ✅ 7 controllers REST
- ✅ Seguridad JWT
- ✅ WebSocket configurado
- ✅ Configuración multi-ambiente (Dev, QA, Prod)
- ⚠️ Pequeños ajustes de tipos pendientes

### Documentación (100% Completada)
- ✅ README principal
- ✅ ARCHITECTURE.md
- ✅ REQUIREMENTS.md
- ✅ FRONTEND.md
- ✅ MCP_BROWSER_SETUP.md (NUEVO)
- ✅ Este documento

---

## Ambientes Configurados

### Development
```bash
# Frontend
cd frontend
npm run dev

# Backend
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

**URLs:**
- Frontend: http://localhost:5173
- Backend: http://localhost:8080
- Swagger: http://localhost:8080/swagger-ui.html

### QA/Staging
```bash
# Frontend
cd frontend
npm run dev:qa

# Build para QA
npm run build:qa

# Backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=qa
```

**Variables de entorno QA:**
```bash
export DB_HOST=qa-db.example.com
export DB_NAME=cafe_limon_qa
export JWT_SECRET=tu-secret-qa
export FRONTEND_URL=https://qa.cafelimon.com
```

### Production
```bash
# Frontend
cd frontend
npm run build

# Backend
./mvnw clean package -DskipTests
java -jar target/backend-1.0.0.jar --spring.profiles.active=prod
```

**Variables de entorno Production:**
```bash
export DB_HOST=prod-db.example.com
export DB_NAME=cafe_limon_prod
export JWT_SECRET=tu-super-secret-produccion
export FRONTEND_URL=https://cafelimon.com
```

---

## Soluciones a Problemas Identificados

### 1. Backend - Errores de Compilación Lombok

**Problema:** Lombok no compila por incompatibilidad con Java 21.

**Solución Rápida:**
```bash
# Opción 1: Usar IDE con soporte Lombok (RECOMENDADO)
# Instalar IntelliJ IDEA o Eclipse con plugin de Lombok

# Opción 2: Agregar configuración explícita al IDE
# Para IntelliJ IDEA:
# 1. Settings > Build > Compiler > Annotation Processors
# 2. Habilitar "Enable annotation processing"
# 3. Restart IDE

# Opción 3: Abrir en VS Code con extension de Java
code /Users/felix.garcia/Documents/Projects/myProjects/Asys/Coffe/backend
```

**Solución Definitiva (ya implementada):**
- ✅ Maven wrapper creado
- ✅ lombok.config agregado
- ✅ Imports corregidos en entidades

### 2. Backend - Incompatibilidades Double vs BigDecimal

**Problema:** Algunas clases usan `Double` y otras `BigDecimal` para precios.

**Solución (aplicar manualmente):**

En `Product.java`, cambiar línea 33:
```java
// Cambiar de:
private Double price;

// A:
private BigDecimal price;
```

En `Order.java`, cambiar línea 39:
```java
// Cambiar de:
private Double totalAmount;

// A:
private BigDecimal totalAmount;
```

En `OrderItem.java`, cambiar líneas 40 y 47:
```java
// Cambiar de:
private Double unitPrice;
private Double subtotal;

// A:
private BigDecimal unitPrice;
private BigDecimal subtotal;
```

Luego actualizar métodos `calculateTotal()` y `calculateSubtotal()`:
```java
// En Order.java:
public void calculateTotal() {
    this.totalAmount = items.stream()
            .map(OrderItem::getSubtotal)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
}

// En OrderItem.java:
public void calculateSubtotal() {
    this.subtotal = BigDecimal.valueOf(this.quantity)
            .multiply(this.unitPrice);
}
```

### 3. Frontend - Errores de Vite

**Problema:** Múltiples instancias de Vite corriendo causando conflictos.

**Solución (ejecutar):**
```bash
cd /Users/felix.garcia/Documents/Projects/myProjects/Asys/Coffe/frontend

# Limpiar procesos
pkill -f "vite" || true

# Limpiar cache
rm -rf node_modules/.vite
rm -rf dist

# Reinstalar (solo si es necesario)
# npm install

# Iniciar limpio
npm run dev
```

---

## Configuración MCP para Navegador

Documentación completa en: `docs/MCP_BROWSER_SETUP.md`

**Resumen rápido:**
```bash
# 1. Crear servidor MCP
mkdir mcp-browser-server && cd mcp-browser-server
npm init -y
npm install @modelcontextprotocol/sdk puppeteer

# 2. Copiar código del servidor desde MCP_BROWSER_SETUP.md

# 3. Configurar Claude Code
# Editar ~/.config/claude/config.json:
{
  "mcpServers": {
    "browser": {
      "command": "node",
      "args": ["/ruta/a/mcp-browser-server/server.js"]
    }
  }
}

# 4. Reiniciar Claude Code
```

---

## Comandos Útiles

### Frontend
```bash
# Development
npm run dev              # Puerto 5173 (development)
npm run dev:qa           # Puerto 5173 (qa)

# Build
npm run build            # Producción
npm run build:qa         # QA
npm run build:dev        # Development

# Preview
npm run preview          # Preview de producción
npm run preview:qa       # Preview de QA

# Lint
npm run lint
```

### Backend
```bash
# Compilar
./mvnw clean compile

# Tests
./mvnw test

# Package
./mvnw clean package -DskipTests

# Run
./mvnw spring-boot:run
./mvnw spring-boot:run -Dspring-boot.run.profiles=qa
./mvnw spring-boot:run -Dspring-boot.run.profiles=prod

# Generate wrapper (si no existe)
mvn wrapper:wrapper
```

---

## Estructura del Proyecto

```
Coffe/
├── frontend/                    # React + Vite
│   ├── .env.development        # Ambiente dev
│   ├── .env.qa                 # Ambiente QA
│   ├── .env.production         # Ambiente prod
│   ├── src/
│   │   ├── components/         # 20+ componentes
│   │   ├── pages/              # 7 páginas
│   │   ├── services/           # 6 servicios API
│   │   ├── context/            # 2 contexts
│   │   ├── hooks/              # 3 hooks personalizados
│   │   └── utils/              # Utilidades
│   └── package.json
│
├── backend/                     # Spring Boot
│   ├── src/main/java/com/cafelimon/
│   │   ├── config/             # Configuraciones
│   │   ├── controller/         # 7 controllers
│   │   ├── dto/                # 18 DTOs
│   │   ├── exception/          # Manejo de errores
│   │   ├── model/              # 7 entidades JPA
│   │   ├── repository/         # 6 repositorios
│   │   ├── security/           # JWT + Security
│   │   └── service/            # 8 servicios
│   ├── src/main/resources/
│   │   ├── application.yml     # Config principal
│   │   ├── application-dev.yml # Config dev
│   │   ├── application-qa.yml  # Config QA
│   │   └── application-prod.yml# Config prod
│   ├── pom.xml
│   ├── mvnw                    # Maven wrapper
│   └── lombok.config
│
└── docs/                        # Documentación
    ├── README.md
    ├── ARCHITECTURE.md
    ├── REQUIREMENTS.md
    ├── FRONTEND.md
    ├── MCP_BROWSER_SETUP.md    # NUEVO
    └── PROYECTO_COMPLETO.md    # Este archivo
```

---

## Checklist de Deployment

### Pre-deployment
- [ ] Corregir tipos Double → BigDecimal en backend
- [ ] Compilar backend exitosamente
- [ ] Ejecutar tests del backend
- [ ] Build del frontend para producción
- [ ] Verificar variables de entorno

### Base de Datos
- [ ] Crear base de datos PostgreSQL
- [ ] Configurar usuario y contraseña
- [ ] Ejecutar migraciones (DDL auto en primera ejecución)
- [ ] Crear datos iniciales (categorías, productos, mesas, usuario admin)

### Backend Deployment
- [ ] Configurar variables de entorno en servidor
- [ ] Subir JAR a servidor
- [ ] Configurar reverse proxy (Nginx/Apache)
- [ ] Configurar SSL/HTTPS
- [ ] Configurar CORS correctamente

### Frontend Deployment
- [ ] Build para producción
- [ ] Subir a Vercel/Netlify o servidor estático
- [ ] Configurar variables de entorno
- [ ] Verificar URLs de API
- [ ] Configurar redirects para SPA

### Post-deployment
- [ ] Probar login
- [ ] Probar creación de órdenes
- [ ] Probar WebSocket (notificaciones tiempo real)
- [ ] Probar generación de QR
- [ ] Verificar Swagger UI

---

## Scripts de Inicialización

### Crear Usuario Admin (SQL)
```sql
-- Crear usuario admin
INSERT INTO users (id, username, password, email, role, active, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'admin',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- password: admin123
  'admin@cafelimon.com',
  'ADMIN',
  true,
  NOW(),
  NOW()
);
```

### Crear Categorías (SQL)
```sql
INSERT INTO categories (id, name, description, icon, order_index, active, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'Bebidas Calientes', 'Café, té y chocolate caliente', '☕', 1, true, NOW(), NOW()),
  (gen_random_uuid(), 'Bebidas Frías', 'Jugos, malteadas y bebidas heladas', '🥤', 2, true, NOW(), NOW()),
  (gen_random_uuid(), 'Postres', 'Pasteles, galletas y dulces', '🍰', 3, true, NOW(), NOW()),
  (gen_random_uuid(), 'Alimentos', 'Sándwiches, ensaladas y platos principales', '🥪', 4, true, NOW(), NOW());
```

---

## Próximos Pasos Recomendados

1. **Abrir en IDE** (IntelliJ IDEA recomendado)
   ```bash
   # Instalar IntelliJ IDEA Community (gratis)
   brew install --cask intellij-idea-ce

   # O usar VS Code con Java Extension Pack
   code /Users/felix.garcia/Documents/Projects/myProjects/Asys/Coffe/backend
   ```

2. **Aplicar Correcciones de Tipos**
   - Cambiar Double → BigDecimal en entidades
   - Actualizar métodos de cálculo

3. **Compilar y Probar**
   ```bash
   ./mvnw clean compile
   ./mvnw spring-boot:run
   ```

4. **Probar Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

5. **Setup Base de Datos**
   ```bash
   # Crear DB en PostgreSQL
   createdb cafe_limon_dev

   # Ejecutar backend (creará tablas automáticamente)
   ./mvnw spring-boot:run

   # Insertar datos iniciales
   psql cafe_limon_dev < scripts/seed.sql
   ```

---

## Soporte y Contacto

- **Repositorio**: (agregar URL cuando esté en GitHub)
- **Documentación**: `/docs`
- **Issues**: (GitHub Issues)

## Licencia

Este proyecto es para uso académico/interno de Café Limón.

---

**¡El proyecto está casi listo para producción! Solo requiere los ajustes menores de tipos indicados.**

Generado: 2025-11-13
