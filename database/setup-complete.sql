-- ============================================
-- SCRIPT DE CONFIGURACIÓN COMPLETA
-- Café Limón - Base de Datos
-- ============================================
-- Este script configura TODA la base de datos desde cero

-- ============================================
-- LIMPIAR DATOS EXISTENTES (opcional para resetear)
-- ============================================
-- NOTA: Descomenta estas líneas solo si quieres resetear completamente
-- TRUNCATE TABLE order_items CASCADE;
-- TRUNCATE TABLE orders CASCADE;
-- TRUNCATE TABLE products CASCADE;
-- TRUNCATE TABLE categories CASCADE;
-- TRUNCATE TABLE tables CASCADE;
-- TRUNCATE TABLE users CASCADE;

-- ============================================
-- ELIMINAR USUARIOS EXISTENTES Y RECREARLOS
-- ============================================
DELETE FROM users WHERE username IN ('admin', 'cocina');

-- Password hashes (BCrypt):
-- admin123 = $2a$10$1rORzRlcbhCuJx2Xz0mzh.JlolOmYhteAH0COH/s18EljsJ4MhSFm
-- cocina123 = $2a$10$1m.AGZxTNS.4J8goWK2I4Oha9KHhyjjORJ7fxjB2fKV/NW1gypIjW

INSERT INTO users (id, username, password, email, role, active, created_at, updated_at) VALUES
(gen_random_uuid(), 'admin', '$2a$10$1rORzRlcbhCuJx2Xz0mzh.JlolOmYhteAH0COH/s18EljsJ4MhSFm', 'admin@cafelimon.com', 'ADMIN', true, NOW(), NOW()),
(gen_random_uuid(), 'cocina', '$2a$10$1m.AGZxTNS.4J8goWK2I4Oha9KHhyjjORJ7fxjB2fKV/NW1gypIjW', 'cocina@cafelimon.com', 'KITCHEN', true, NOW(), NOW());

-- ============================================
-- MESAS
-- ============================================
DELETE FROM tables;

INSERT INTO tables (id, number, capacity, location, active, created_at, updated_at) VALUES
(gen_random_uuid(), '1', 4, 'Terraza', true, NOW(), NOW()),
(gen_random_uuid(), '2', 2, 'Interior', true, NOW(), NOW()),
(gen_random_uuid(), '3', 6, 'Terraza', true, NOW(), NOW()),
(gen_random_uuid(), '4', 4, 'Interior', true, NOW(), NOW()),
(gen_random_uuid(), '5', 2, 'Barra', true, NOW(), NOW()),
(gen_random_uuid(), '6', 8, 'Terraza VIP', true, NOW(), NOW()),
(gen_random_uuid(), '7', 4, 'Interior', true, NOW(), NOW()),
(gen_random_uuid(), '8', 6, 'Terraza', true, NOW(), NOW()),
(gen_random_uuid(), '9', 4, 'Interior', true, NOW(), NOW()),
(gen_random_uuid(), '10', 10, 'Salón Principal', true, NOW(), NOW());

-- ============================================
-- CATEGORÍAS
-- ============================================
DELETE FROM categories;

INSERT INTO categories (id, name, description, icon, order_index, active, created_at, updated_at) VALUES
(gen_random_uuid(), 'Bebidas Calientes', 'Café, té, chocolate caliente y más', '☕', 1, true, NOW(), NOW()),
(gen_random_uuid(), 'Bebidas Frías', 'Jugos, malteadas, frappes y bebidas heladas', '🥤', 2, true, NOW(), NOW()),
(gen_random_uuid(), 'Tragos', 'Bebidas alcohólicas', '🥃', 3, true, NOW(), NOW()),
(gen_random_uuid(), 'Repostería', 'Pasteles, tartas y tortas', '🍰', 4, true, NOW(), NOW()),
(gen_random_uuid(), 'Delicias de la Casa', 'Hamburguesas, salchipapas y especialidades', '⭐', 5, true, NOW(), NOW()),
(gen_random_uuid(), 'Licores', 'Vinos, whisky, ron y más', '🍷', 6, true, NOW(), NOW()),
(gen_random_uuid(), 'Panadería', 'Pan fresco, pasteles y bocadillos', '🥐', 7, true, NOW(), NOW());

-- ============================================
-- PRODUCTOS - BEBIDAS CALIENTES
-- ============================================
DELETE FROM products;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Tinto Tradicional', 'Café tradicional colombiano', 2500.00, id, '', true, 3, NOW(), NOW() FROM categories WHERE name = 'Bebidas Calientes';

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Americano', 'Café americano de altura', 4000.00, id, '', true, 5, NOW(), NOW() FROM categories WHERE name = 'Bebidas Calientes';

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Café con Leche', 'Café con leche fresca', 4000.00, id, '', true, 5, NOW(), NOW() FROM categories WHERE name = 'Bebidas Calientes';

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Capuchino', 'Espresso con leche y espuma', 7500.00, id, '', true, 7, NOW(), NOW() FROM categories WHERE name = 'Bebidas Calientes';

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Aromática Tisana', 'Té de hierbas aromáticas', 2000.00, id, '', true, 5, NOW(), NOW() FROM categories WHERE name = 'Bebidas Calientes';

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Aromática Artesanal Pequeña', 'Té artesanal pequeño', 4000.00, id, '', true, 5, NOW(), NOW() FROM categories WHERE name = 'Bebidas Calientes';

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Aromática Artesanal Grande', 'Té artesanal grande', 7000.00, id, '', true, 5, NOW(), NOW() FROM categories WHERE name = 'Bebidas Calientes';

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Latte', 'Espresso con leche vaporizada', 6000.00, id, '', true, 7, NOW(), NOW() FROM categories WHERE name = 'Bebidas Calientes';

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Chocolate', 'Chocolate caliente artesanal', 6000.00, id, '', true, 7, NOW(), NOW() FROM categories WHERE name = 'Bebidas Calientes';

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Espresso', 'Café espresso italiano', 4000.00, id, '', true, 3, NOW(), NOW() FROM categories WHERE name = 'Bebidas Calientes';

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Café Perico', 'Café con un toque especial', 3000.00, id, '', true, 5, NOW(), NOW() FROM categories WHERE name = 'Bebidas Calientes';

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Capuccino con Licor', 'Capuccino con licor especial', 12000.00, id, '', true, 10, NOW(), NOW() FROM categories WHERE name = 'Bebidas Calientes';

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Té Chai Caliente', 'Té chai con especias', 8500.00, id, '', true, 7, NOW(), NOW() FROM categories WHERE name = 'Bebidas Calientes';

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Milo Caliente', 'Bebida de chocolate Milo', 6500.00, id, '', true, 5, NOW(), NOW() FROM categories WHERE name = 'Bebidas Calientes';

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Carajillo', 'Café con licor', 7500.00, id, '', true, 7, NOW(), NOW() FROM categories WHERE name = 'Bebidas Calientes';

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Latte Pequeño', 'Latte tamaño pequeño', 4000.00, id, '', true, 5, NOW(), NOW() FROM categories WHERE name = 'Bebidas Calientes';

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Aromática de Frutos Deshidratados', 'Té con frutos deshidratados', 8000.00, id, '', true, 7, NOW(), NOW() FROM categories WHERE name = 'Bebidas Calientes';

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Mocaccino', 'Chocolate con espresso', 7000.00, id, '', true, 7, NOW(), NOW() FROM categories WHERE name = 'Bebidas Calientes';

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Leche Caliente', 'Leche caliente natural', 2000.00, id, '', true, 3, NOW(), NOW() FROM categories WHERE name = 'Bebidas Calientes';

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Café Caramelo', 'Café con sirope de caramelo', 7000.00, id, '', true, 7, NOW(), NOW() FROM categories WHERE name = 'Bebidas Calientes';

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Vino Caliente Copa', 'Copa de vino caliente especiado', 18000.00, id, '', true, 10, NOW(), NOW() FROM categories WHERE name = 'Bebidas Calientes';

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Café Bombón', 'Café con leche condensada', 7000.00, id, '', true, 7, NOW(), NOW() FROM categories WHERE name = 'Bebidas Calientes';

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Macchiato', 'Espresso con un toque de leche', 3000.00, id, '', true, 3, NOW(), NOW() FROM categories WHERE name = 'Bebidas Calientes';

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Café Irlandés', 'Café con whisky y crema', 10000.00, id, '', true, 10, NOW(), NOW() FROM categories WHERE name = 'Bebidas Calientes';

-- ============================================
-- VERIFICACIÓN
-- ============================================
SELECT 'Usuarios creados:' as status, COUNT(*) as total FROM users;
SELECT 'Categorías creadas:' as status, COUNT(*) as total FROM categories;
SELECT 'Productos creados:' as status, COUNT(*) as total FROM products;
SELECT 'Mesas creadas:' as status, COUNT(*) as total FROM tables;

-- Mostrar resumen por categoría
SELECT c.name as categoria, COUNT(p.id) as total_productos
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.name
ORDER BY c.order_index;
