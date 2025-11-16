-- ============================================
-- SCRIPT DE POBLACIÓN COMPLETA DEL MENÚ
-- Café Limón
-- ============================================
-- Este script inserta todas las categorías y productos del menú

-- ============================================
-- LIMPIAR PRODUCTOS EXISTENTES (opcional, solo para desarrollo)
-- ============================================
-- TRUNCATE TABLE products RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE categories RESTART IDENTITY CASCADE;

-- ============================================
-- CATEGORÍAS
-- ============================================
INSERT INTO categories (id, name, description, icon, order_index, active, created_at, updated_at) VALUES
(gen_random_uuid(), 'Bebidas Calientes', 'Café, té, chocolate caliente y más', '☕', 1, true, NOW(), NOW()),
(gen_random_uuid(), 'Bebidas Frías', 'Jugos, malteadas, frappes y bebidas heladas', '🥤', 2, true, NOW(), NOW()),
(gen_random_uuid(), 'Tragos', 'Bebidas alcohólicas', '🥃', 3, true, NOW(), NOW()),
(gen_random_uuid(), 'Repostería', 'Pasteles, tartas y tortas', '🍰', 4, true, NOW(), NOW()),
(gen_random_uuid(), 'Delicias de la Casa', 'Hamburguesas, salchipapas y especialidades', '⭐', 5, true, NOW(), NOW()),
(gen_random_uuid(), 'Licores', 'Vinos, whisky, ron y más', '🍷', 6, true, NOW(), NOW()),
(gen_random_uuid(), 'Panadería', 'Pan fresco, pasteles y bocadillos', '🥐', 7, true, NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- BEBIDAS CALIENTES
-- ============================================
INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Tinto Tradicional', 'Café tradicional colombiano', 2500.00, id, '', true, 3, NOW(), NOW() FROM categories WHERE name = 'Bebidas Calientes'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Americano', 'Café americano de altura', 4000.00, id, '', true, 5, NOW(), NOW() FROM categories WHERE name = 'Bebidas Calientes'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Café con Leche', 'Café con leche fresca', 4000.00, id, '', true, 5, NOW(), NOW() FROM categories WHERE name = 'Bebidas Calientes'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Capuchino', 'Espresso con leche y espuma', 7500.00, id, '', true, 7, NOW(), NOW() FROM categories WHERE name = 'Bebidas Calientes'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Aromática Tisana', 'Té de hierbas aromáticas', 2000.00, id, '', true, 5, NOW(), NOW() FROM categories WHERE name = 'Bebidas Calientes'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Aromática Artesanal Pequeña', 'Té artesanal pequeño', 4000.00, id, '', true, 5, NOW(), NOW() FROM categories WHERE name = 'Bebidas Calientes'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Aromática Artesanal Grande', 'Té artesanal grande', 7000.00, id, '', true, 5, NOW(), NOW() FROM categories WHERE name = 'Bebidas Calientes'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Latte', 'Espresso con leche vaporizada', 6000.00, id, '', true, 7, NOW(), NOW() FROM categories WHERE name = 'Bebidas Calientes'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Chocolate', 'Chocolate caliente artesanal', 6000.00, id, '', true, 7, NOW(), NOW() FROM categories WHERE name = 'Bebidas Calientes'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Espresso', 'Café espresso italiano', 4000.00, id, '', true, 3, NOW(), NOW() FROM categories WHERE name = 'Bebidas Calientes'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Café Perico', 'Café con un toque especial', 3000.00, id, '', true, 5, NOW(), NOW() FROM categories WHERE name = 'Bebidas Calientes'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Capuccino con Licor', 'Capuccino con licor especial', 12000.00, id, '', true, 10, NOW(), NOW() FROM categories WHERE name = 'Bebidas Calientes'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Té Chai Caliente', 'Té chai con especias', 8500.00, id, '', true, 7, NOW(), NOW() FROM categories WHERE name = 'Bebidas Calientes'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Milo Caliente', 'Bebida de chocolate Milo', 6500.00, id, '', true, 5, NOW(), NOW() FROM categories WHERE name = 'Bebidas Calientes'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Carajillo', 'Café con licor', 7500.00, id, '', true, 7, NOW(), NOW() FROM categories WHERE name = 'Bebidas Calientes'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Latte Pequeño', 'Latte tamaño pequeño', 4000.00, id, '', true, 5, NOW(), NOW() FROM categories WHERE name = 'Bebidas Calientes'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Aromática de Frutos Deshidratados', 'Té con frutos deshidratados', 8000.00, id, '', true, 7, NOW(), NOW() FROM categories WHERE name = 'Bebidas Calientes'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Mocaccino', 'Chocolate con espresso', 7000.00, id, '', true, 7, NOW(), NOW() FROM categories WHERE name = 'Bebidas Calientes'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Leche Caliente', 'Leche caliente natural', 2000.00, id, '', true, 3, NOW(), NOW() FROM categories WHERE name = 'Bebidas Calientes'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Café Caramelo', 'Café con sirope de caramelo', 7000.00, id, '', true, 7, NOW(), NOW() FROM categories WHERE name = 'Bebidas Calientes'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Vino Caliente Copa', 'Copa de vino caliente especiado', 18000.00, id, '', true, 10, NOW(), NOW() FROM categories WHERE name = 'Bebidas Calientes'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Café Bombón', 'Café con leche condensada', 7000.00, id, '', true, 7, NOW(), NOW() FROM categories WHERE name = 'Bebidas Calientes'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Macchiato', 'Espresso con un toque de leche', 3000.00, id, '', true, 3, NOW(), NOW() FROM categories WHERE name = 'Bebidas Calientes'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Café Irlandés', 'Café con whisky y crema', 10000.00, id, '', true, 10, NOW(), NOW() FROM categories WHERE name = 'Bebidas Calientes'
ON CONFLICT DO NOTHING;

-- ============================================
-- BEBIDAS FRÍAS
-- ============================================
INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Granizado de Café Pequeño', 'Café granizado pequeño', 4000.00, id, '', true, 5, NOW(), NOW() FROM categories WHERE name = 'Bebidas Frías'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Granizado de Café', 'Café granizado grande', 7000.00, id, '', true, 7, NOW(), NOW() FROM categories WHERE name = 'Bebidas Frías'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Granizado Saborizado Pequeño', 'Granizado de frutas pequeño', 3500.00, id, '', true, 5, NOW(), NOW() FROM categories WHERE name = 'Bebidas Frías'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Soda Saborizada', 'Soda italiana con frutas', 10000.00, id, '', true, 7, NOW(), NOW() FROM categories WHERE name = 'Bebidas Frías'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Michelada de Soda', 'Michelada con soda', 8000.00, id, '', true, 5, NOW(), NOW() FROM categories WHERE name = 'Bebidas Frías'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Granizado Saborizado', 'Granizado de frutas grande', 6000.00, id, '', true, 7, NOW(), NOW() FROM categories WHERE name = 'Bebidas Frías'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Milo Frío', 'Bebida de chocolate Milo fría', 7000.00, id, '', true, 5, NOW(), NOW() FROM categories WHERE name = 'Bebidas Frías'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Jugo en Agua', '¡Qué rico se siente un jugo en agua bien fría en un día caluroso! Hecho con los mejores ingredientes.', 7000.00, id, '', true, 5, NOW(), NOW() FROM categories WHERE name = 'Bebidas Frías'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Granizado Grande', 'Granizado tamaño grande', 9000.00, id, '', true, 7, NOW(), NOW() FROM categories WHERE name = 'Bebidas Frías'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Jugo en Leche', 'Jugo natural con leche', 8000.00, id, '', true, 5, NOW(), NOW() FROM categories WHERE name = 'Bebidas Frías'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Capuchino Frío', 'Capuchino helado', 8500.00, id, '', true, 7, NOW(), NOW() FROM categories WHERE name = 'Bebidas Frías'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Café de Cereza', 'Café con sabor a cereza', 6500.00, id, '', true, 7, NOW(), NOW() FROM categories WHERE name = 'Bebidas Frías'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Americano Frío', 'Café americano helado', 4500.00, id, '', true, 5, NOW(), NOW() FROM categories WHERE name = 'Bebidas Frías'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Limonada de Cereza', 'Limonada con cereza natural', 9000.00, id, '', true, 7, NOW(), NOW() FROM categories WHERE name = 'Bebidas Frías'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Limonada de Coco', 'Limonada con coco', 9000.00, id, '', true, 7, NOW(), NOW() FROM categories WHERE name = 'Bebidas Frías'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Latte Frío', 'Latte helado', 7000.00, id, '', true, 7, NOW(), NOW() FROM categories WHERE name = 'Bebidas Frías'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Limonada Natural', 'Limonada natural refrescante', 8000.00, id, '', true, 5, NOW(), NOW() FROM categories WHERE name = 'Bebidas Frías'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Té Chai', 'Té chai frío con especias', 9000.00, id, '', true, 7, NOW(), NOW() FROM categories WHERE name = 'Bebidas Frías'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Michelada Quattro', 'Michelada especial de la casa', 6000.00, id, '', true, 5, NOW(), NOW() FROM categories WHERE name = 'Bebidas Frías'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Limonada de Vino', 'Limonada con vino', 15000.00, id, '', true, 7, NOW(), NOW() FROM categories WHERE name = 'Bebidas Frías'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Granizado con Licor', 'Granizado con licor especial', 12000.00, id, '', true, 10, NOW(), NOW() FROM categories WHERE name = 'Bebidas Frías'
ON CONFLICT DO NOTHING;

-- ============================================
-- TRAGOS
-- ============================================
INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Aguardiente', 'Aguardiente tradicional', 5000.00, id, '', true, 2, NOW(), NOW() FROM categories WHERE name = 'Tragos'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Ron Caldas', 'Ron Caldas - Adiciones: Soda', 6000.00, id, '', true, 2, NOW(), NOW() FROM categories WHERE name = 'Tragos'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Tequila Reposado', 'Tequila reposado premium', 7000.00, id, '', true, 2, NOW(), NOW() FROM categories WHERE name = 'Tragos'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Ron Medellín', 'Ron Medellín tradicional', 6000.00, id, '', true, 2, NOW(), NOW() FROM categories WHERE name = 'Tragos'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Copa de Vino', 'Copa de vino tinto o blanco', 10000.00, id, '', true, 2, NOW(), NOW() FROM categories WHERE name = 'Tragos'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Whisky', 'Whisky premium', 10000.00, id, '', true, 2, NOW(), NOW() FROM categories WHERE name = 'Tragos'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Vodka', 'Vodka premium', 7000.00, id, '', true, 2, NOW(), NOW() FROM categories WHERE name = 'Tragos'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Zumo Limón', 'Zumo de limón natural', 1500.00, id, '', true, 2, NOW(), NOW() FROM categories WHERE name = 'Tragos'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Baileys', 'Crema de whisky Baileys', 7000.00, id, '', true, 2, NOW(), NOW() FROM categories WHERE name = 'Tragos'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Jägermeister', 'Licor de hierbas alemán', 10000.00, id, '', true, 2, NOW(), NOW() FROM categories WHERE name = 'Tragos'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Ron 8 Años', 'Ron añejo 8 años', 8000.00, id, '', true, 2, NOW(), NOW() FROM categories WHERE name = 'Tragos'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Brandy Domecq', 'Brandy Domecq', 5000.00, id, '', true, 2, NOW(), NOW() FROM categories WHERE name = 'Tragos'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Whisky B&W', 'Whisky Black & White', 7000.00, id, '', true, 2, NOW(), NOW() FROM categories WHERE name = 'Tragos'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Aguardiente Antioqueño Real', 'Aguardiente Antioqueño Real', 5000.00, id, '', true, 2, NOW(), NOW() FROM categories WHERE name = 'Tragos'
ON CONFLICT DO NOTHING;

-- ============================================
-- REPOSTERÍA
-- ============================================
INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Galleta de Avena y Arándanos', 'Galleta artesanal de avena con arándanos', 4000.00, id, 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTExQWFRUVGSIaGBgYGR8gIRsbICAfGh4gGyAfHiogHR4lICAeITEiJSkuLi4uHSAzODMtNyotLysBCgoKDg0OGxAQGy0lICYwLS02Ky0tLS0tLS8tKy0tLy0tLy0tLS0tLS8tLS0tLS0tLS0tLy0tLS0tLS0tLS0tLf/AABEIALcBEwMBIgACEQEDEQH/xAAcAAADAAMBAQEAAAAAAAAAAAAEBQYAAwcCAQj/xABGEAACAQIFAgQEAwYCCAQHAQABAhEDIQAEBRIxQVEGEyJhMnGBkUKhsRQjUsHR8GLhBxYzQ3KCsvEkksLSU2OEk6LD0xX/xAAaAQADAQEBAQAAAAAAAAAAAAADBAUCAQAG/8QALhEAAgIBBAEDAgUFAQEAAAAAAQIAEQMEEiExQRMiUWFxFDKBkfChscHh8TMF/9oADAMBAAIRAxEAPwCH1AUMvmabU085EpglVMqDa5kSRa3d98Uw0ZCUq0atOylPaRHqbdYEjdB49eMeMJ/EHiOjm6YFKndlLAhLwba5km/tjdq+c07MJsSjUIUeoxtJkkwRyOe98ZVHPMuEQ8mM6t5OVTLqFFRzJTaSQBMgT1hh9xGFWjZB6mYqVXqtT8sKp2gkK8SxMyJkWv1xbeINGqZf9ngf7u9pMkmIOD/B2Qp0kbfTBeor7i6y2xHYwZ2O7f5YbcN6bG+4iQwmyf0jPw1Sqvl/Njd5nm2n1FYUwRwJm+2Jv1wwzbvqVoAWjQAAViNzHkNJuI/Ljrh14my9IVVqeQGVSS5pKSCxIPQ/DY3PXDjJVdM8tRWpilSiGqBgSTIIEEcmPtg+Xeq7RJI44nBiqzZvwz5OUZvKFWsxKKVEhTfcTtAmT1+eHmUyZq5VMw+5fJ+NryfUIgBp5Hwm/v3QahrWXK7Uy/7mkf8Ad0isBr32ncZBPvjX4o05KmUY7VqMhDAMgYgMD8JFxttfrh2o2i/P5ykPVu/j+crPGubFSn5SlaigIxkAqRc9OV9o4OIEaTWWr5e57+am3rI+Ai8xePfEFRzmfqN+0NUDUigO3adwaY2j1PzMSOn544ZlNVetUf8AaWlpCbzfaLiD0MzjTL6P8nGGW7tKes/7U1K6oGq0lAUm4EgWbj4ueOuNml6bXqVfLpgFm5FgP87YoP2EhLoBu43RMD/D9BI+U43aToRqPT9aU00TbUA/iFNBKqGHMG/WeMbHpWaES1qCW4j1NCz9FQBVrbf3m0ETe5Hx/L798C53V8tdGrZhK8Bg1JGC+q2x/j3Ab7gjHVfC+Xy+XQU/KRQTuYKI3n4jJjjBXiAp+z0/IPwv8BjaoItY6C/ywF0w797jy5GuysiimX8UMSVKL+HeBt2ry46xM4f/AOqylEpvmBVYFhTdBSWTaHZTJJPPSMUuj6n+0AV2rU6tPbsAUbV3LJPcj0xPy7YbUc7SpimKm+p5jcUsQBbqSbx/PDE+nkdAB/fmThlvBucS081m8xQ2BWpVKamQzQTa4Mhiv5dsR3jXNOgpbaZNSp6Vj1GJifTPXp9cXGrpTzGZrqKjIV8j1oBu/jLExA4j+npihHh/L5mlTp01RTSDY0z6STwJPJ9v54lOuRDQHHSvPBM0sE1czXoVs+lTz6bKEJCZdE0W0u9H9pQM/lkNLkBXOQrTvFz2wu8SaHTUh10n91AStQLExS3G9+TsPeOuNWY1yqarCi4amCFKEXO26yBcSBbnA9N1is9apT80U3qOWb8FMk2BBUHcpn3M8c4XxpkF77jLsjDi4u8CeFKtUUlp0S1QyPKlShP8NwJPO3ocPMn4Tyzqu9TVNQhoZ1Cgg35Fh08viJxU6fnaDJSpq/lgZoVDwFFOQwPMH/Ljvh9V8Y+ST6aisgJUOCPLjbEX9iAR79seOJgLnmMqkNR+f2kiPhIUNSVtpk1xIJBE7ZEf34xmC80KsWpJeRYP1gQeMZi2P0wz8p9TdREDrzNxC8zx/l74zHyi4ZQZmJ5xmKnkMfKS2n0fNdaz1kR2IqI9MxTjkE+oL7/UYcU6Cn/e1XFUfuWVgA7fCSTzPy+/OOWH0NKFPJXgY6X4ay/k01cBWubbdxggGTyRafpgS47OYqCFFCO++Cc3SbLunlllpRSJpz8a2OmRc2M8XiSPqMR+i5n9tz2YWk2+muXp1KcT6tyGLSBtzI+mN/hLM1SjtVqMoV10iuSQSPQFE9IlrbTccTE47N4U8O5egtOpSRe+0gXH8VvUYYT1jWPbX5yUeOqbyp0/w/mKbea7JUqgEeZRkotryBJiRbtiD8SeatTdK71Kgq7V9J3ASIPy3c4r81nCdReuyk0gy06flKFsoYgkE8QNve59sQXiPOilVWmNlOAKZqkEuSSRJ7kWF+MLY7Rqb/eNudwF/t9ojz2dNZGYqgJkkICq+rfzP8R+2K/QMv+y0v2h6iiozMQfT6RG0z1MsSYvz7YkNB0/9p/Z3qOpYmoC5JAXsD7+rk+wxR+I9Do06VNqKk+Y4M7SS5Fvifkf+bBMmNlXcR+xGRkDGok8z+01XasxIpgqAQNnIiSbe+Ew8N5YkhcyWgKQQUb1QbAgG10FuJwxfKuuWqUIevWUy4IAgT++6HYwgGBzzjXpWZXKqUpCBUcgISqsb7gdoIkATN+scnEjdv4/eM+kATR+kEGSdqyJUzwp9RKlfSZZl3E8zJIg9cNqGpBRRpqW8p6XmMJOzzCAYYm40+F8sSGeo5lWNQ1x5bsSzNBcgi0i+4SBPti18c+EqNbLZdURjWpMACSYMDi/J2z0HyxnJijxsRzJ6ZSLYczlegUvMr1nqICEA8kA+nfJuxJkiBpfkfPB3h3xBRyrJSdNtNm9SqI2EEgER0BMccXtzhjS8F+V+1PVGxiipJ5LqWBG3oRthgOMMMppXk0gELmm20xSEu22ZPsLHrYzgqam3N/OAycDiccEYrLJVz+8mrsqsFKF++1dzFYPSx/X1e0aU2X8wvUNWpSLKYVZaDyZAjjk9T88c98QaL+z5RajV2dq9aoHqVGJt6B8MBQeL2mf1+fZFT9kygBqCnvvMNp+ZucPL8V+Gm3EhDuxY7cEY+k3vqRqY6gJ2N6ozH8f6Ucu0WPxf0wFpXiH9my+ZoV1O2pV21T1IUfwwfrb5jBPhfxDqNOnQp0k06m1OnS2tUUkGBGYDAgF4uLWIPYnC3xj4cztc0GXy6iBUDMp5qEVKjgq0wqFTsEEwWt98KtgPqWv/ABKRzrtAb+SZW+NsrVSlSqqPL3KN2wz5lRtjH8QDHkG5kjrjdpPh/K5eg7MVrGp8KLsUE7gZBAJgkz9O2N/idP8AY6Stt89aVOn5dRVCsGZSCQBIUW+IyD02WdqHiJ0p7EqVEVRtCsyggf4eY4AH/LgeVN+MKfvBIyrmbkf5L/VK1SnTrIpFJqbhzTZNobYd1hILHYbyP4uZxWZvQKYdG8l6ZphSp2sNwIJEoSDMRBHGIH/SzmSpysGC+XAFOm4Y+UKR3Lx7+mAYO7vgPwl4+OXpURGan+xF/JWlsR/NqKAh7fuwVgWCFg32xStjx4b2z9hDa1O5PSlVpKqJK0nZyNgDQQpBkT8R+EDuDjrGmeGaVSgj0KTikxKokkDcZEgiYFjF7YpM/wCGMhq1F61U/smfJWkGEqwBAYXJ5gqw9iQBibyWp5jL1adOnVb9n/Z6xqKT/tGBRgCLCQDNiLnqOmJLujPvX9RjYSK2sR8pW+GNVXL1fOqAAjYq+SQYDHZJP/U0fQ44j+k7xRmKbAUwoUU6LhirlirMzG6gEE7jEi3HUY60a5rwcq1TyPLAoMxj0lgQqzygKv1O+e2I/wAceEMzTyOUpUnaoUqPWD1F6tQP/VJBlFkASZNr4dpMvpEr9omtiBBb+JLV/wBJ+eZ2C7LFo26dTs1hl3H6nGYKrbJEE/TGY17W/wBR/wBJPcH5NURa3SfpGMxmMwUCAOJU06zEelR/xH/I/piiy+T3OyNLPTHp4M2IIg+2MxmJePO2Ot/H/iczY1bnpKHw74jfLZlXlWV5V2UhQdxgwZt6e4wyvq+e9Yo0gN9lJgz0MTtJIH0OOEY+YfwnUPi01cDzCe0lM2h/aatLQ2dRRpjbVOxSwAbhiSr8kXv0j2wN4KbLZ3LNUp0vLaqQKlBz+EgEE8mLQY6X+bDw/oivqOdWu7EHLjyo43QysXYggxclQP5DFp4Hz1DD9n+xJUMq0jc7gvJH1HUfMQcU8T1pD+c7NeQ/vIqzXU0A1YlkVCEJp2OzZvvaJNy2CfBegGoalSuA0E02pOLM4EKx9gJA+Xx88L87oNb9/ZVFU0q21VViN5KlJACghgQZABPQHFf4Q1mhkyK9emw3VajkB+VKlbITbcigET3nH1Ozfq3d/O4k+ruU2e5PZ7SsozrVy0+aZLodqiOqkEATa1/ljX+29J4j+nGOl6pqacGqh3tF1hj33NAbBD0adRhsNMhQfQQrNJBv16EY0Dh8mPV02g+fOVy/4hpEv0bUa9atTp0agoUVFVlU0fXujd+8aDxaxtYx8saNK1B8svl5fU6RQP6gQNRQFAMBSosWk3PIi/fBnizxElcUzVrClUDOEetSBemALKpAuROAw9XEqRxxJozL3fP1k5mMwylQy1Hps3b3P0xK+K/ElSkKS0aiKSfTUg1SQBE3MCDpfFLhMxUZXVmKsGWJL7dxEm4/OL4h/FuprVqCk1SaasGDUxJqQGYE9bKOexxqJjXU5dq/M62QooJgtM1FqmTqOlN6gHqpFSC5M9ACfhEEj26YQ5bUM3pqM1FTKMS21h5bW3JLCWJAMyPb5YbZ3WKVCkaQy9Ss8iWqlqkEEG7HrP2GKPQssuoZZK+a8urU8rdVqICqhQTbtcALEnuI98B2LjYMf2lN2N8/H8yboeOWo5ejQ8ip56D/aEFSF2mT6RBA/OcIqZD5hzcMzEgjcBM2BBIg8Y6R4TyjZdcxRqMrq2YqxQhgVBIVSZ6xcEfr0y3wno9FqaVMx5VOnWG8I/rDr8AZgLAEfF/z4W3I2X0++CwkhvSTMh+kLQqLVgpZy9ZvTPKAkeozwCAB+WIzM1USmqhq1WfWVbYCbAgGDyBHN8dV/SKiupzQ8tqaLsSmaBcNTJL3mJACiDt/F3xF1NYo+VRp0qCGoyqSys5RwI+I2YEHoBwMCw2uTkdxnM9oK94ipPl1EQlSwJpMWXdG6UJk8bjB48sQ3iPVKbVmYo52s6ot0TceAON0zPuTjtnifV6FfLZmilJmoJ8Iu1wOPSI7OL/hhT4b8OZbdXpZmstNqhbydm0v5bmJN42ks2wxPEQZnBNPhkVb7Zl1vb19pPacjPSRKlPZUABRlNwwFwYsQZt+uKXxX4n82ktCmF2pTpDzE+B3m14PCnmRJPXHQamVyuSoBM86pUq01NPfpzqQHDEhX3AWIK7mK+nnHPfFnjKjmahWm8rTorRUEWMFSSO+6BM9cFCPm0+lj5gQyYiw9TM9epzq7OamYqTEsxM3tyWg3j9cZgr0keQn1H9cZhrbP1M4+06f4RyorU6lWnI/2jWYCI+VxPMWxLf6YfDqZmm+q01FRqYKlSLwC3puZY7HaeSTRj2xYeFd1HJIjoy+WRsoT+72Tv20x6gSQV2r8Rt6pjDTxU62K1LKPRqU3p+bVqWN+Ib0kbQu0QTsJO3m/Gvj2r+nxs5jU5N3Ip8z4fq1Khr0Jpp1MZFQxGxlBMckyR1A9iosTfRvA9GpqSrlXGwBKh/eGHNMv6QYlpJ4kCQd2JzRfGeayllTNOVRiCNrQ45X1GCQJsOO04oNB1+lWy2aasauZqbdqvUI28qWgqAFqI1kMmRuHGAnPl9RfBHwYW8SHuB+krfCvh9qGZrqX3MgRQ1Rtw3F4IkqduyndN7fOKaGl+0Kup1l/a3owxr7WSmjEE+kKQT6hG/nv2xP+Ja9Bkp1MsHD06zFmMgoW3MGWCAd3qubfwhpjlxQ8qnm/2xCpYVRVbzFZ/XElpG82C/FzmL4rbJgKBTYZvqHZJK+VQdJy93kVAdx3Ar2Y9R9sTniDT6WWq0KtJaopvs9L/EVkIzDqCYYDgzviQLnPlXo1ctmaOYqv5lTd5S1AUqbHPqkyGJG+T0PeItd0vLIi0qnmBqO5gwUsDMNcEsT6l4PJm+F8OWIU7yLjy4z82nHuVIqv8YjFn4Gz+XzblKlJQwUuCFmQZBsd31xKa1piLmqwoGoGqglVqtJ9XNj6rnqZOHOkeJ66sQmZqJTqGShiGBg+rfcWIv2xOwZW3eiR9XFSMRx5mzxBp+SFREWjUp1V9LeXL022y3pmRCgkyb4Bymb1WnTNOlRy/lDym2pNNmDOzkhSrEQQII+XOCv8AqM4etq6GoRMR1lEA+F8m1LU1NSqXqMqhDUdmZ12gKoYkkERaOgxw+p+oO/6RHpD+4wf+pz/xLRo53L0TmKa1wlL93Tr7FemQAdpMQ3wi8m/3xLZrwvlqNBKy0p8yosEg+WqBgN7d/wCm/wB4xT/6+JXr1lf96KgpoVD+gqisIgncLQd0e3e/nPKLQFWjTYhG83YxkAgmYPaxOMjK6ZErqTGGRWTceszxF4T/AGeq1P8AeGiSCKgJBa/J9ggQOJAOKnL+H6T5P9ufMN+zbSlRAgQOx3UpbaTFja3Qx0GIjxp4qepmnp0aZNFPLXbJBqM20mRY7QVHAsOuPup+IPMy1Kgl6ZXMDL1QogM3lsgqDklAqMoG4yH64sLxpu16izQOw+4mwIakmr0wMzl6rh2NQMHoBmU+ksCGi0hhIP8AT0xR+H9TGcp5jKV6a1n0+oBSglKCNJgwbknaBPVTMHE3qTZdagqq7OqAOSGCOpOxiZBggCx4iIw91nP0MzTyeaajTDUaIR1Y2UqGc7o6EsbTc8cT6mqy9Lr/AJg8TkVf87QvK5Gm5qqL1VBSjRcG67Y3C99zgA3gf2WOmeEM4Ka11KKrJWRlb+I7yy8iQy1BIixPPfDzRdR0/MVUqZAMG0yWemrHcRICjcB6RyYsD7xjo3h3S82mWbMOrLqFKCKwp+lnVRDKR8cAgBuR74njzKjFx1fH/JmyhO0nz/Uf+GMqWzS1EqNUqLSZUouhAptFzuBNwSTMg3A5M4cZdK1LM06tZVJpOHXzFkJ8MlhGoeTpxJOXqVgHDV0Dih6SpqMl7SRsZnI+IHe2FH+mCnWqKHaojInlVEqBQKarB8udxMHcT1/4vnjGDUaF8WMhv6wuQnDwg5EsNZ1Opn1p50Ik0qxqVCim21TII+pRaZnoZ6YB0nQ6+ctXGz0ELSLAiY+KN3a3pifjx0fRNWWgVemxpvRAFK4AVB8XqUTtY9TifX/SemVplPNIZx5lRp2hQ5AJ/wDqk+omw6Y+jbiemXBtVj9GcDRVdz1Hfh3RqOUpCilNUi7sAxZj1JYkkn3Jwt1VqoqVDBAbepHv1FvYfTrjzpfj4eVXqVqjVH4SnoTdxEuxNz/L27k5P/SBTZa7+WQQKIhzAElmGMM2JHJO4dH/ALSqMpFUfnAlmwN5nQfC+bz1SjXFXy6dNTCBJLOvP3mOTx74L8UZOhUSltJJpuzVBTYgmRaQSeWW31xzHwj/AKQ00lFNWk9SqXCKaKqW2mQJ3FSdjR8scm/0j/tGZbO5+sGliaigXgX2qVuIE4o+mjdqMWxW7Uv/AHQ3j/xb5hCUh5TAh/NZ1Cq38KWM+8WPP0S6P4ozdNEoZt0qNlw8MPMp71aCYN7SGB+eMwTxB4Vo1KVLI5SmmWpLSVqjIQXpsqgB9plg5M7rEAmItY3/AOh+dq0ajUl2U6bGUu2wtYEDqRuP5YEMWGxq1/tDerqOK5+LiStSNXbmnUNT8wfShP8AEJ9Pt8PP3wn0OhuykI0sFMq0kQ5kNP8Ay2/PhvrGm1HrH96rU0R2SqwBg06TN6hfuYg/F74lqWpoULJvQKbqZYAjkcxguRPSxlRd/MJidnYF+OU1TWHAOxWI2yBMSVBIk9/64zBum1KabqnmKhI9LbiGA6xH2xmB+kPmQ5n//9k=', true, 5, NOW(), NOW() FROM categories WHERE name = 'Repostería'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Brownie', 'Brownie de chocolate artesanal', 6000.00, id, '', true, 10, NOW(), NOW() FROM categories WHERE name = 'Repostería'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Alfajor', 'Alfajor argentino tradicional', 3000.00, id, '', true, 5, NOW(), NOW() FROM categories WHERE name = 'Repostería'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Torta Zanahoria', 'Torta de zanahoria con frosting de queso', 9500.00, id, '', true, 15, NOW(), NOW() FROM categories WHERE name = 'Repostería'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Torta Red Velvet', 'Torta red velvet con frosting de queso crema', 9500.00, id, '', true, 15, NOW(), NOW() FROM categories WHERE name = 'Repostería'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Torta Maracuyá y Uchuva', 'Torta tropical de maracuyá y uchuva', 9500.00, id, '', true, 15, NOW(), NOW() FROM categories WHERE name = 'Repostería'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Rollo de Canela', 'Rollo de canela casero con glaseado', 7000.00, id, '', true, 10, NOW(), NOW() FROM categories WHERE name = 'Repostería'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Volcán de Chocolate', 'Volcán de chocolate con centro líquido', 7500.00, id, '', true, 15, NOW(), NOW() FROM categories WHERE name = 'Repostería'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Torta Mocca', 'Torta de café con chocolate', 9500.00, id, '', true, 15, NOW(), NOW() FROM categories WHERE name = 'Repostería'
ON CONFLICT DO NOTHING;

-- ============================================
-- DELICIAS DE LA CASA
-- ============================================
INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Combo Uno', 'Combo especial de la casa', 16000.00, id, '', true, 20, NOW(), NOW() FROM categories WHERE name = 'Delicias de la Casa'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Mini-Burger', 'Carne artesanal 100gr, tocineta, queso, ensalada', 10000.00, id, '', true, 15, NOW(), NOW() FROM categories WHERE name = 'Delicias de la Casa'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Hamburguesa Estudiante', 'Hamburguesa especial estudiante', 5000.00, id, '', true, 15, NOW(), NOW() FROM categories WHERE name = 'Delicias de la Casa'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Special-Burger', 'Carne artesanal 150gr, tocineta, queso, ensalada', 16000.00, id, '', true, 20, NOW(), NOW() FROM categories WHERE name = 'Delicias de la Casa'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Adición Papas', 'Porción de papas fritas', 5000.00, id, '', true, 10, NOW(), NOW() FROM categories WHERE name = 'Delicias de la Casa'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Salchipapas La Deliciosa', 'Salchipapas especial de la casa', 23000.00, id, '', true, 15, NOW(), NOW() FROM categories WHERE name = 'Delicias de la Casa'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Salchipapas Personal', 'Salchipapas porción personal', 16000.00, id, '', true, 12, NOW(), NOW() FROM categories WHERE name = 'Delicias de la Casa'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Adición Tocineta', 'Extra tocineta', 3000.00, id, '', true, 5, NOW(), NOW() FROM categories WHERE name = 'Delicias de la Casa'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Chuzo Cerdo', 'Chuzo de cerdo al carbón', 20000.00, id, '', true, 20, NOW(), NOW() FROM categories WHERE name = 'Delicias de la Casa'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Mini-Dog', 'Perro caliente mini', 10000.00, id, '', true, 10, NOW(), NOW() FROM categories WHERE name = 'Delicias de la Casa'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Súper-Burger', 'Carne artesanal 150gr, doble tocineta, doble queso, ensalada', 21000.00, id, '', true, 20, NOW(), NOW() FROM categories WHERE name = 'Delicias de la Casa'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Special-Dog', 'Perro caliente especial', 16000.00, id, '', true, 12, NOW(), NOW() FROM categories WHERE name = 'Delicias de la Casa'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Burger de la Casa', 'Carne artesanal de tocineta y churrasco 150gr, doble tocineta, doble queso', 26000.00, id, '', true, 25, NOW(), NOW() FROM categories WHERE name = 'Delicias de la Casa'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Burritos', 'Burritos mexicanos', 20000.00, id, '', true, 20, NOW(), NOW() FROM categories WHERE name = 'Delicias de la Casa'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Adición de Queso', 'Extra queso', 3000.00, id, '', true, 2, NOW(), NOW() FROM categories WHERE name = 'Delicias de la Casa'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Chuzo Mixto', 'Chuzo mixto al carbón', 22000.00, id, '', true, 20, NOW(), NOW() FROM categories WHERE name = 'Delicias de la Casa'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Salchipapas La Sabrosota', 'Salchicha, tocineta, chorizo, queso, cerdo, pollo', 32000.00, id, '', true, 20, NOW(), NOW() FROM categories WHERE name = 'Delicias de la Casa'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Coca-Cola 1 Litro', 'Coca-Cola 1 litro', 8000.00, id, '', true, 2, NOW(), NOW() FROM categories WHERE name = 'Delicias de la Casa'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Combo Dos', 'Combo especial dos', 21000.00, id, '', true, 20, NOW(), NOW() FROM categories WHERE name = 'Delicias de la Casa'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Combo Tres', 'Combo especial tres', 30000.00, id, '', true, 25, NOW(), NOW() FROM categories WHERE name = 'Delicias de la Casa'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Picada Personal', 'Picada para una persona', 30000.00, id, '', true, 25, NOW(), NOW() FROM categories WHERE name = 'Delicias de la Casa'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Punta de Anca o Churrasco Plancha', 'Punta de anca o churrasco a la plancha', 35000.00, id, '', true, 25, NOW(), NOW() FROM categories WHERE name = 'Delicias de la Casa'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Picada Especial Dos Personas', 'Picada especial para dos personas', 48000.00, id, '', true, 30, NOW(), NOW() FROM categories WHERE name = 'Delicias de la Casa'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Premium-Burger', 'Doble carne artesanal 150gr, doble tocineta, doble queso, ensalada', 23000.00, id, '', true, 22, NOW(), NOW() FROM categories WHERE name = 'Delicias de la Casa'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Maicitos', 'Maicitos especiales', 22000.00, id, '', true, 15, NOW(), NOW() FROM categories WHERE name = 'Delicias de la Casa'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Nuggets', 'Nuggets de pollo', 12000.00, id, '', true, 12, NOW(), NOW() FROM categories WHERE name = 'Delicias de la Casa'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Adición Arepa con Queso', 'Arepa con queso extra', 3000.00, id, '', true, 5, NOW(), NOW() FROM categories WHERE name = 'Delicias de la Casa'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Combo Cuatro', 'Combo especial cuatro', 28000.00, id, '', true, 22, NOW(), NOW() FROM categories WHERE name = 'Delicias de la Casa'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Adición Papas 10K', 'Porción grande de papas fritas', 10000.00, id, '', true, 12, NOW(), NOW() FROM categories WHERE name = 'Delicias de la Casa'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Picada Súper 3 Personas', 'Picada súper para 3 personas', 63000.00, id, '', true, 35, NOW(), NOW() FROM categories WHERE name = 'Delicias de la Casa'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Entrada de Patacones', 'Patacones criollos', 10000.00, id, '', true, 10, NOW(), NOW() FROM categories WHERE name = 'Delicias de la Casa'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Pechuga Plancha', 'Pechuga de pollo a la plancha', 30000.00, id, '', true, 20, NOW(), NOW() FROM categories WHERE name = 'Delicias de la Casa'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Salchipapas Parche Amigos', 'Salchipapas para grupo', 80000.00, id, '', true, 30, NOW(), NOW() FROM categories WHERE name = 'Delicias de la Casa'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Entrada de Empanadas 7x1000', 'Empanadas - 7 por $10.000', 10000.00, id, '', true, 12, NOW(), NOW() FROM categories WHERE name = 'Delicias de la Casa'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Súper-Dog', 'Perro caliente súper especial', 21000.00, id, '', true, 15, NOW(), NOW() FROM categories WHERE name = 'Delicias de la Casa'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Combo Cinco', 'Salchipapas para 2 personas + Coca-Cola', 30000.00, id, '', true, 20, NOW(), NOW() FROM categories WHERE name = 'Delicias de la Casa'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Butifarras', 'Butifarras tradicionales', 10000.00, id, '', true, 12, NOW(), NOW() FROM categories WHERE name = 'Delicias de la Casa'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Salchipapas Súper Especial', 'Salchipapas súper especial', 63000.00, id, '', true, 25, NOW(), NOW() FROM categories WHERE name = 'Delicias de la Casa'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Picada de El Pueblo', 'Picada grande para compartir', 80000.00, id, '', true, 35, NOW(), NOW() FROM categories WHERE name = 'Delicias de la Casa'
ON CONFLICT DO NOTHING;

-- ============================================
-- LICORES
-- ============================================
INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), '1/2 Ron Caldas', 'Media botella Ron Caldas', 38000.00, id, '', true, 2, NOW(), NOW() FROM categories WHERE name = 'Licores'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), '1/2 Aguardiente Tapa Roja', 'Media botella aguardiente tapa roja', 35000.00, id, '', true, 2, NOW(), NOW() FROM categories WHERE name = 'Licores'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), '1/4 Aguardiente Rojo', 'Cuarto aguardiente tapa roja', 25000.00, id, '', true, 2, NOW(), NOW() FROM categories WHERE name = 'Licores'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), '1/4 Ron Caldas', 'Cuarto de Ron Caldas', 28000.00, id, '', true, 2, NOW(), NOW() FROM categories WHERE name = 'Licores'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), '1/2 Aguardiente Tapa Azul', 'Media botella aguardiente tapa azul', 35000.00, id, '', true, 2, NOW(), NOW() FROM categories WHERE name = 'Licores'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), '1/4 Aguardiente Verde', 'Cuarto aguardiente verde', 25000.00, id, '', true, 2, NOW(), NOW() FROM categories WHERE name = 'Licores'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), '1/4 Ron Medellín', 'Cuarto de Ron Medellín', 24000.00, id, '', true, 2, NOW(), NOW() FROM categories WHERE name = 'Licores'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), '1/4 Aguardiente Azul', 'Cuarto aguardiente tapa azul', 25000.00, id, '', true, 2, NOW(), NOW() FROM categories WHERE name = 'Licores'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), '1/2 Aguardiente Tapa Verde', 'Media botella aguardiente tapa verde', 35000.00, id, '', true, 2, NOW(), NOW() FROM categories WHERE name = 'Licores'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Aguardiente Litro', 'Botella de aguardiente 1 litro', 95000.00, id, '', true, 2, NOW(), NOW() FROM categories WHERE name = 'Licores'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), '1/2 Ron Medellín', 'Media botella Ron Medellín', 38000.00, id, '', true, 2, NOW(), NOW() FROM categories WHERE name = 'Licores'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Litro Caldas', 'Botella Ron Caldas 1 litro', 85000.00, id, '', true, 2, NOW(), NOW() FROM categories WHERE name = 'Licores'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Botella Vino', 'Botella de vino', 50000.00, id, '', true, 2, NOW(), NOW() FROM categories WHERE name = 'Licores'
ON CONFLICT DO NOTHING;

-- ============================================
-- PANADERÍA
-- ============================================
INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Pastel de Pollo', 'Pastel de hojaldre con pollo', 5000.00, id, '', true, 10, NOW(), NOW() FROM categories WHERE name = 'Panadería'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Palito de Queso', 'Palito de queso horneado', 4000.00, id, '', true, 8, NOW(), NOW() FROM categories WHERE name = 'Panadería'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Pollo y Champiñones', 'Pastel de pollo y champiñones', 5500.00, id, '', true, 12, NOW(), NOW() FROM categories WHERE name = 'Panadería'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Pollo y Verduras', 'Pastel de pollo y verduras', 5500.00, id, '', true, 12, NOW(), NOW() FROM categories WHERE name = 'Panadería'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Ranchero', 'Pastel ranchero', 5500.00, id, '', true, 12, NOW(), NOW() FROM categories WHERE name = 'Panadería'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Pastel de Jamón y Queso', 'Pastel de jamón y queso', 4500.00, id, '', true, 10, NOW(), NOW() FROM categories WHERE name = 'Panadería'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Pastel de Arequipe', 'Pastel dulce de arequipe', 4000.00, id, '', true, 8, NOW(), NOW() FROM categories WHERE name = 'Panadería'
ON CONFLICT DO NOTHING;

INSERT INTO products (id, name, description, price, category_id, image_url, available, preparation_time, created_at, updated_at)
SELECT gen_random_uuid(), 'Pastel de Guayaba', 'Pastel dulce de guayaba', 4000.00, id, '', true, 8, NOW(), NOW() FROM categories WHERE name = 'Panadería'
ON CONFLICT DO NOTHING;

-- ============================================
-- VERIFICACIÓN
-- ============================================
-- Para verificar la inserción:
SELECT c.name as categoria, COUNT(p.id) as total_productos
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.name
ORDER BY c.order_index;
