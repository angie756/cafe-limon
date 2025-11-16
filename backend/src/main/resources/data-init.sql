-- Script de inicialización de datos para Café Limón
-- Ejecutar después de crear la base de datos

-- ============================================
-- CATEGORÍAS
-- ============================================
INSERT INTO categories (id, name, description, icon, order_index, active, created_at, updated_at) VALUES
(gen_random_uuid(), 'Bebidas Calientes', 'Café, té, chocolate caliente y más', '☕', 1, true, NOW(), NOW()),
(gen_random_uuid(), 'Bebidas Frías', 'Jugos, malteadas, frappes y bebidas heladas', '🥤', 2, true, NOW(), NOW()),
(gen_random_uuid(), 'Helados', 'Helados artesanales y postres helados', '🍨', 3, true, NOW(), NOW()),
(gen_random_uuid(), 'Repostería', 'Pasteles, tartas y tortas', '🍰', 4, true, NOW(), NOW()),
(gen_random_uuid(), 'Panadería', 'Pan fresco, croissants y bocadillos', '🥐', 5, true, NOW(), NOW()),
(gen_random_uuid(), 'Delicias de la Casa', 'Especialidades y platos exclusivos', '⭐', 6, true, NOW(), NOW()),
(gen_random_uuid(), 'Dulces y Mecatos', 'Snacks, galletas y dulces', '🍪', 7, true, NOW(), NOW()),
(gen_random_uuid(), 'Gaseosas', 'Bebidas gaseosas y refrescos', '🥤', 8, true, NOW(), NOW()),
(gen_random_uuid(), 'Coca Cola', 'Productos Coca-Cola', '🥤', 9, true, NOW(), NOW()),
(gen_random_uuid(), 'Postobon', 'Productos Postobón', '🥤', 10, true, NOW(), NOW()),
(gen_random_uuid(), 'Cerveza Nacional', 'Cervezas colombianas', '🍺', 11, true, NOW(), NOW()),
(gen_random_uuid(), 'Cerveza Internacional', 'Cervezas importadas', '🍺', 12, true, NOW(), NOW()),
(gen_random_uuid(), 'Cocteles', 'Cocteles clásicos y de autor', '🍹', 13, true, NOW(), NOW()),
(gen_random_uuid(), 'Tragos', 'Bebidas alcohólicas', '🥃', 14, true, NOW(), NOW()),
(gen_random_uuid(), 'Licores', 'Vinos, whisky, ron y más', '🍷', 15, true, NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- PRODUCTOS DE EJEMPLO
-- ============================================

-- Bebidas Calientes
INSERT INTO products (id, name, description, price, category_id, available, created_at, updated_at)
SELECT
  gen_random_uuid(),
  'Café Americano',
  'Café de altura del Oriente Antioqueño',
  4500.00,
  id,
  true,
  NOW(),
  NOW()
FROM categories WHERE name = 'Bebidas Calientes'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, available, created_at, updated_at)
SELECT
  gen_random_uuid(),
  'Café Latte',
  'Espresso con leche vaporizada',
  6000.00,
  id,
  true,
  NOW(),
  NOW()
FROM categories WHERE name = 'Bebidas Calientes'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, available, created_at, updated_at)
SELECT
  gen_random_uuid(),
  'Cappuccino',
  'Espresso con leche y espuma',
  6500.00,
  id,
  true,
  NOW(),
  NOW()
FROM categories WHERE name = 'Bebidas Calientes'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, available, created_at, updated_at)
SELECT
  gen_random_uuid(),
  'Chocolate Caliente',
  'Chocolate artesanal con leche',
  5500.00,
  id,
  true,
  NOW(),
  NOW()
FROM categories WHERE name = 'Bebidas Calientes'
ON CONFLICT DO NOTHING;

-- Bebidas Frías
INSERT INTO products (id, name, description, price, category_id, available, created_at, updated_at)
SELECT
  gen_random_uuid(),
  'Frappe de Café',
  'Café helado con crema batida',
  8000.00,
  id,
  true,
  NOW(),
  NOW()
FROM categories WHERE name = 'Bebidas Frías'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, available, created_at, updated_at)
SELECT
  gen_random_uuid(),
  'Limonada de Panela',
  'Limonada con panela natural',
  5000.00,
  id,
  true,
  NOW(),
  NOW()
FROM categories WHERE name = 'Bebidas Frías'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, available, created_at, updated_at)
SELECT
  gen_random_uuid(),
  'Jugo Natural',
  'Jugo de frutas frescas',
  6000.00,
  id,
  true,
  NOW(),
  NOW()
FROM categories WHERE name = 'Bebidas Frías'
ON CONFLICT DO NOTHING;

-- Repostería
INSERT INTO products (id, name, description, price, category_id, available, created_at, updated_at)
SELECT
  gen_random_uuid(),
  'Torta de Zanahoria',
  'Torta casera con frosting de queso crema',
  8000.00,
  id,
  true,
  NOW(),
  NOW()
FROM categories WHERE name = 'Repostería'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, available, created_at, updated_at)
SELECT
  gen_random_uuid(),
  'Brownie con Helado',
  'Brownie de chocolate con helado de vainilla',
  9000.00,
  id,
  true,
  NOW(),
  NOW()
FROM categories WHERE name = 'Repostería'
ON CONFLICT DO NOTHING;

-- Panadería
INSERT INTO products (id, name, description, price, category_id, available, created_at, updated_at)
SELECT
  gen_random_uuid(),
  'Croissant',
  'Croissant francés artesanal',
  4000.00,
  id,
  true,
  NOW(),
  NOW()
FROM categories WHERE name = 'Panadería'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, available, created_at, updated_at)
SELECT
  gen_random_uuid(),
  'Pan de Queso',
  'Pan de queso tradicional',
  3000.00,
  id,
  true,
  NOW(),
  NOW()
FROM categories WHERE name = 'Panadería'
ON CONFLICT DO NOTHING;

-- ============================================
-- MESAS
-- ============================================
INSERT INTO tables (id, number, capacity, location, active, created_at, updated_at) VALUES
(gen_random_uuid(), 'M01', 4, 'Terraza', true, NOW(), NOW()),
(gen_random_uuid(), 'M02', 2, 'Interior', true, NOW(), NOW()),
(gen_random_uuid(), 'M03', 6, 'Terraza', true, NOW(), NOW()),
(gen_random_uuid(), 'M04', 4, 'Interior', true, NOW(), NOW()),
(gen_random_uuid(), 'M05', 2, 'Barra', true, NOW(), NOW())
ON CONFLICT (number) DO NOTHING;

-- ============================================
-- USUARIO ADMINISTRADOR
-- ============================================
-- Password: admin123 (hash BCrypt)
INSERT INTO users (id, username, password, email, role, active, created_at, updated_at) VALUES
(gen_random_uuid(), 'admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'admin@cafelimon.com', 'ADMIN', true, NOW(), NOW())
ON CONFLICT (username) DO NOTHING;

-- ============================================
-- USUARIO DE COCINA
-- ============================================
-- Password: cocina123 (hash BCrypt)
INSERT INTO users (id, username, password, email, role, active, created_at, updated_at) VALUES
(gen_random_uuid(), 'cocina', '$2a$10$rZ8qhFy6wz3Z7cU5x9aLZO9mXzD4kN1xP2tR5sV6wY7zA8bC9dE0f', 'cocina@cafelimon.com', 'KITCHEN', true, NOW(), NOW())
ON CONFLICT (username) DO NOTHING;
