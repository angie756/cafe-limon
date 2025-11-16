# Base de Datos - Café Limón

> Documentación completa de la base de datos PostgreSQL del sistema de auto-pedidos

## 📊 Información General

- **Motor**: PostgreSQL 16
- **Nombre**: `cafe_limon_dev`
- **Usuario**: `postgres`
- **Puerto**: `5432`
- **Total de Tablas**: 6
- **Total de Registros Iniciales**: ~170

## 🗃️ Esquema de Base de Datos

### Entidades y Relaciones

```sql
users (2)
  │
  └─── (no hay relación directa con pedidos)

tables (6)
  │
  │
categories (15)          orders (variable)
  │                         │
  │                         ├── table_id → tables.id
  └── products (151)        │
         │                  │
         └── order_items (variable)
                 │
                 ├── order_id → orders.id
                 └── product_id → products.id
```

## 📁 Scripts Disponibles

### 1. `init.sql` - Esquema Inicial

Crea todas las tablas, índices y constraints de la base de datos.

**Tablas creadas:**
- `users` - Usuarios del sistema (admin, cocina)
- `categories` - Categorías de productos
- `products` - Productos del menú
- `tables` - Mesas del café
- `orders` - Pedidos de clientes
- `order_items` - Ítems de cada pedido

**Ejecutar:**
```bash
# Con Docker
docker exec -it cafe-limon-db psql -U postgres -d cafe_limon_dev -f /docker-entrypoint-initdb.d/init.sql

# Sin Docker
psql -U postgres -d cafe_limon_dev -f database/init.sql
```

### 2. `setup-complete.sql` - Setup Completo

Script todo-en-uno que incluye:
- ✅ Eliminación de tablas existentes (CASCADE)
- ✅ Creación del esquema completo
- ✅ Inserción de usuarios (admin, cocina)
- ✅ Inserción de 15 categorías
- ✅ Inserción de 151 productos
- ✅ Configuración de 6 mesas con QR codes

**Ejecutar:**
```bash
# Con Docker (RECOMENDADO)
docker exec -it cafe-limon-db psql -U postgres -d cafe_limon_dev -f /docker-entrypoint-initdb.d/setup-complete.sql

# Sin Docker
psql -U postgres -d cafe_limon_dev -f database/setup-complete.sql
```

**⚠️ ADVERTENCIA**: Este script elimina TODOS los datos existentes.

## 📋 Estructura Detallada de Tablas

### 1. `users` - Usuarios del Sistema

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,        -- BCrypt hash
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL,             -- ADMIN, KITCHEN
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Datos Iniciales:**
| Username | Password (Plain) | Role | Email |
|----------|-----------------|------|-------|
| `admin` | `admin123` | ADMIN | admin@cafelimon.com |
| `cocina` | `cocina123` | KITCHEN | cocina@cafelimon.com |

**Hashes BCrypt:**
```
admin123  = $2a$10$1rORzRlcbhCuJx2Xz0mzh.JlolOmYhteAH0COH/s18EljsJ4MhSFm
cocina123 = $2a$10$1m.AGZxTNS.4J8goWK2I4Oha9KHhyjjORJ7fxjB2fKV/NW1gypIjW
```

### 2. `categories` - Categorías de Productos

```sql
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(10),                      -- Emoji icon
    order_index INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Categorías Disponibles (15):**
1. ☕ Bebidas Calientes (48 productos)
2. 🥤 Bebidas Frías (21 productos)
3. 🍨 Helados (sin productos aún)
4. 🍰 Repostería (8 productos)
5. 🥐 Panadería (8 productos)
6. ⭐ Delicias de la Casa (39 productos)
7. 🍪 Dulces y Mecatos (sin productos aún)
8. 🥤 Gaseosas (sin productos aún)
9. 🥤 Coca Cola (sin productos aún)
10. 🥤 Postobon (sin productos aún)
11. 🍺 Cerveza Nacional (sin productos aún)
12. 🍺 Cerveza Internacional (sin productos aún)
13. 🍹 Cocteles (sin productos aún)
14. 🥃 Tragos (14 productos)
15. 🍷 Licores (13 productos)

### 3. `products` - Productos del Menú

```sql
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    image_url VARCHAR(500),
    available BOOLEAN DEFAULT true,
    preparation_time INTEGER,              -- Minutos
    order_count BIGINT DEFAULT 0,          -- Contador de pedidos
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Índices:**
```sql
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_available ON products(available);
CREATE INDEX idx_products_name ON products(name);
```

**Total de Productos:** 151

**Rangos de Precios:**
- Mínimo: $1,500 (Aromáticas)
- Máximo: $12,000 (Bebidas especiales)
- Promedio: ~$3,500

### 4. `tables` - Mesas del Café

```sql
CREATE TABLE tables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    number VARCHAR(10) UNIQUE NOT NULL,
    capacity INTEGER NOT NULL,
    location VARCHAR(100),
    qr_code TEXT,                          -- Base64 o URL del QR
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Mesas Configuradas (6):**
| Número | Capacidad | Ubicación | Activa |
|--------|-----------|-----------|--------|
| 1 | 4 | Exterior | ✅ |
| 2 | 2 | Interior | ✅ |
| 3 | 4 | Interior | ✅ |
| 4 | 6 | Exterior | ✅ |
| 5 | 2 | Barra | ✅ |
| 6 | 8 | Salón | ✅ |

**URLs de Acceso:**
```
Mesa 1: http://localhost:5173/menu/1
Mesa 2: http://localhost:5173/menu/2
Mesa 3: http://localhost:5173/menu/3
Mesa 4: http://localhost:5173/menu/4
Mesa 5: http://localhost:5173/menu/5
Mesa 6: http://localhost:5173/menu/6
```

### 5. `orders` - Pedidos de Clientes

```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_id UUID REFERENCES tables(id) ON DELETE SET NULL,
    customer_name VARCHAR(100),
    status VARCHAR(20) DEFAULT 'PENDING',  -- PENDING, EN_PREPARACION, LISTO, ENTREGADO, CANCELADO
    total_amount DECIMAL(10, 2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ready_at TIMESTAMP,                    -- Cuando se marca LISTO
    delivered_at TIMESTAMP,                -- Cuando se marca ENTREGADO
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Índices:**
```sql
CREATE INDEX idx_orders_table ON orders(table_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
```

**Estados Posibles:**
1. `PENDING` - Pendiente (recién creado)
2. `EN_PREPARACION` - En preparación (cocina trabajando)
3. `LISTO` - Listo para entregar
4. `ENTREGADO` - Entregado al cliente
5. `CANCELADO` - Cancelado

### 6. `order_items` - Ítems de Pedidos

```sql
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    notes TEXT,                            -- Notas especiales del cliente
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Índices:**
```sql
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);
```

## 🔍 Consultas Útiles

### Ver Estadísticas Generales

```sql
-- Total de productos por categoría
SELECT
    c.name AS categoria,
    COUNT(p.id) AS total_productos,
    ROUND(AVG(p.price), 2) AS precio_promedio
FROM categories c
LEFT JOIN products p ON p.category_id = c.id
WHERE c.active = true
GROUP BY c.id, c.name
ORDER BY total_productos DESC;
```

### Ver Pedidos del Día

```sql
-- Pedidos de hoy con detalles
SELECT
    o.id,
    t.number AS mesa,
    o.customer_name AS cliente,
    o.status AS estado,
    o.total_amount AS total,
    o.created_at AS creado,
    COUNT(oi.id) AS items
FROM orders o
JOIN tables t ON o.table_id = t.id
LEFT JOIN order_items oi ON oi.order_id = o.id
WHERE DATE(o.created_at) = CURRENT_DATE
GROUP BY o.id, t.number, o.customer_name, o.status, o.total_amount, o.created_at
ORDER BY o.created_at DESC;
```

### Productos Más Vendidos

```sql
-- Top 10 productos más pedidos
SELECT
    p.name AS producto,
    p.order_count AS veces_pedido,
    p.price AS precio,
    c.name AS categoria
FROM products p
JOIN categories c ON p.category_id = c.id
ORDER BY p.order_count DESC
LIMIT 10;
```

### Ingresos del Día

```sql
-- Total de ingresos del día (solo pedidos entregados)
SELECT
    DATE(o.created_at) AS fecha,
    COUNT(o.id) AS total_pedidos,
    SUM(o.total_amount) AS ingresos_total
FROM orders o
WHERE o.status = 'ENTREGADO'
  AND DATE(o.created_at) = CURRENT_DATE
GROUP BY DATE(o.created_at);
```

### Mesas Más Utilizadas

```sql
-- Ranking de mesas por número de pedidos
SELECT
    t.number AS mesa,
    t.location AS ubicacion,
    COUNT(o.id) AS total_pedidos,
    SUM(o.total_amount) AS ingresos_total
FROM tables t
LEFT JOIN orders o ON o.table_id = t.id
GROUP BY t.id, t.number, t.location
ORDER BY total_pedidos DESC;
```

## 🛠️ Mantenimiento y Administración

### Backup Completo

```bash
# Crear backup
docker exec cafe-limon-db pg_dump -U postgres cafe_limon_dev > backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurar backup
docker exec -i cafe-limon-db psql -U postgres cafe_limon_dev < backup_20250116_120000.sql
```

### Limpiar Pedidos Antiguos

```sql
-- Eliminar pedidos de más de 30 días (CUIDADO)
DELETE FROM orders
WHERE created_at < NOW() - INTERVAL '30 days';
```

### Resetear Contadores de Productos

```sql
-- Resetear order_count de todos los productos
UPDATE products SET order_count = 0;
```

### Actualizar Timestamps

Los timestamps se actualizan automáticamente con triggers (si están configurados) o manualmente:

```sql
-- Actualizar updated_at manualmente
UPDATE products
SET updated_at = NOW()
WHERE id = 'product-uuid-here';
```

## 🔐 Seguridad

### Permisos de Usuario

```sql
-- Crear usuario solo lectura
CREATE USER readonly_user WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE cafe_limon_dev TO readonly_user;
GRANT USAGE ON SCHEMA public TO readonly_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user;

-- Revocar permisos de escritura
REVOKE INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public FROM readonly_user;
```

### Encriptación de Contraseñas

Las contraseñas en la tabla `users` están hasheadas con BCrypt (cost factor 10):

```javascript
// Ejemplo en JavaScript (backend)
const bcrypt = require('bcrypt');
const hash = await bcrypt.hash('admin123', 10);
// Resultado: $2a$10$1rORzRlcbhCuJx2Xz0mzh.JlolOmYhteAH0COH/s18EljsJ4MhSFm
```

## 📈 Monitoreo y Performance

### Ver Tamaño de Tablas

```sql
SELECT
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Ver Índices Utilizados

```sql
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan AS index_scans
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

### Estadísticas de Consultas

```sql
-- Ver consultas lentas (requiere pg_stat_statements extension)
SELECT
    query,
    calls,
    total_time,
    mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

## 🧪 Datos de Prueba

### Crear Pedido de Prueba

```sql
-- 1. Crear pedido
INSERT INTO orders (table_id, customer_name, status, total_amount)
SELECT
    id,
    'Cliente de Prueba',
    'PENDING',
    5000.00
FROM tables
WHERE number = '2';

-- 2. Agregar items (usar último order_id creado)
INSERT INTO order_items (order_id, product_id, quantity, unit_price, subtotal)
SELECT
    (SELECT id FROM orders ORDER BY created_at DESC LIMIT 1),
    id,
    2,
    price,
    price * 2
FROM products
WHERE name = 'Tinto Tradicional';
```

## 📞 Soporte

Para problemas con la base de datos:

1. Verificar logs: `docker compose logs database`
2. Verificar conexión: `docker exec -it cafe-limon-db psql -U postgres -d cafe_limon_dev -c "SELECT version();"`
3. Reiniciar servicio: `docker compose restart database`

---

**Última Actualización**: Noviembre 2025
**Versión de Esquema**: 1.0
**PostgreSQL**: 16
