# 📱 Guía de Productos y QR - Café Limón

## 📋 Resumen

Se ha creado un script completo de SQL con **más de 100 productos** organizados en 7 categorías:
- ☕ Bebidas Calientes (24 productos)
- 🥤 Bebidas Frías (21 productos)
- 🥃 Tragos (14 productos)
- 🍰 Repostería (9 productos)
- ⭐ Delicias de la Casa (39 productos)
- 🍷 Licores (13 productos)
- 🥐 Panadería (8 productos)

---

## 🗄️ Cómo Cargar los Productos en la Base de Datos

### Opción 1: PostgreSQL CLI

```bash
# Conectar a la base de datos
psql -U postgres -d cafe_limon

# Ejecutar el script
\i /ruta/completa/Coffe/database/seed-menu-complete.sql

# Verificar la carga
SELECT c.name as categoria, COUNT(p.id) as total_productos
FROM categories c
LEFT JOIN products p ON c.id = p.category_id
GROUP BY c.name
ORDER BY c.order_index;
```

### Opción 2: DBeaver o pgAdmin

1. Abrir DBeaver o pgAdmin
2. Conectar a la base de datos `cafe_limon`
3. Abrir el archivo `database/seed-menu-complete.sql`
4. Ejecutar el script completo (Ctrl+Enter o botón Run)
5. Verificar en la tabla `products` que se hayan insertado todos los productos

### Opción 3: Docker (si usas Docker Compose)

```bash
# Copiar el script al contenedor
docker cp database/seed-menu-complete.sql cafe_limon_db:/tmp/

# Ejecutar dentro del contenedor
docker exec -it cafe_limon_db psql -U postgres -d cafe_limon -f /tmp/seed-menu-complete.sql
```

---

## 📝 Notas Importantes sobre el Script SQL

1. **Imágenes**: Por defecto, las URLs de imágenes están vacías (`''`). Puedes:
   - Dejarlas vacías por ahora
   - Agregarlas manualmente después
   - Actualizar el script con URLs reales

2. **Precios**: Todos los precios están en pesos colombianos (COP) como especificaste

3. **Tiempo de Preparación**: Se han asignado tiempos estimados a cada producto

4. **Disponibilidad**: Todos los productos están marcados como `available = true`

5. **Seguridad**: El script usa `ON CONFLICT DO NOTHING` para evitar duplicados

---

## 🎯 Generador de Códigos QR

### Acceder al Generador

Hay 3 formas de acceder al generador de QR:

#### **Opción 1: Directamente desde el navegador (Recomendado)**

```bash
# Asegúrate de que el servidor de desarrollo esté corriendo
cd frontend
npm run dev

# Luego abre en tu navegador:
http://localhost:5173/qr-generator.html
```

#### **Opción 2: Abrir el archivo HTML directamente**

1. Ve a `frontend/public/qr-generator.html`
2. Haz doble clic en el archivo
3. Se abrirá en tu navegador predeterminado

#### **Opción 3: Desde VS Code (con Live Server)**

1. Instala la extensión "Live Server" en VS Code
2. Haz clic derecho en `qr-generator.html`
3. Selecciona "Open with Live Server"

---

## 📲 Cómo Probar desde tu Celular

### Método 1: Usando tu IP Local (Ambos en la misma Red WiFi)

1. **Obtén tu IP local:**

   **En Mac/Linux:**
   ```bash
   ifconfig | grep "inet "
   # Busca algo como: 192.168.1.X
   ```

   **En Windows:**
   ```bash
   ipconfig
   # Busca "Dirección IPv4": 192.168.1.X
   ```

2. **Asegúrate de que el backend y frontend estén corriendo:**

   ```bash
   # Terminal 1 - Backend
   cd backend
   ./mvnw spring-boot:run

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

3. **Accede desde tu celular:**

   En el navegador de tu celular, ve a:
   ```
   http://TU-IP-LOCAL:5173/menu/3
   ```

   Ejemplo:
   ```
   http://192.168.1.10:5173/menu/3
   ```

### Método 2: Generar QR y Escanearlo

1. **Abre el generador de QR:**
   ```
   http://localhost:5173/qr-generator.html
   ```

2. **Configura:**
   - **Número de Mesa**: 3 (o el número que quieras)
   - **Ambiente**: Personalizado
   - **URL Personalizada**: `http://TU-IP-LOCAL:5173`

3. **Haz clic en "Generar Código QR"**

4. **Escanea el QR con tu celular** usando:
   - La cámara nativa (iOS/Android)
   - Una app de lector QR

5. **Se abrirá el menú directamente en tu celular**

### Método 3: Usar ngrok (Sin necesidad de estar en la misma red)

1. **Instala ngrok:**
   ```bash
   # Mac (con Homebrew)
   brew install ngrok

   # O descarga desde: https://ngrok.com/download
   ```

2. **Expón tu frontend:**
   ```bash
   ngrok http 5173
   ```

3. **Copia la URL que te da ngrok** (algo como: `https://abc123.ngrok.io`)

4. **Genera el QR:**
   - Abre `http://localhost:5173/qr-generator.html`
   - Selecciona "Ambiente: Personalizado"
   - Pega la URL de ngrok
   - Número de mesa: 3
   - Genera QR

5. **Escanea con tu celular** - ¡Funcionará desde cualquier lugar!

---

## 🐛 Solución de Problemas

### El menú aparece vacío ("No se encontraron productos")

**Causa:** La base de datos no tiene productos o el endpoint no es accesible

**Solución:**
```bash
# 1. Verifica que el backend esté corriendo
curl http://localhost:8080/api/menu

# 2. Si devuelve error, carga los productos
psql -U postgres -d cafe_limon -f database/seed-menu-complete.sql

# 3. Reinicia el backend
```

### Error 403 Forbidden

**Causa:** El endpoint `/menu` o `/tables/:id/menu` requiere autenticación

**Solución:** Ya se implementó un fallback en el código que intenta primero el endpoint de la mesa, y si falla, usa el endpoint público `/menu`.

### No puedo acceder desde el celular

**Verificaciones:**
1. ¿Están ambos dispositivos en la misma red WiFi?
2. ¿El firewall de tu computadora está bloqueando las conexiones?
3. ¿Usaste la IP correcta? (192.168.x.x, NO 127.0.0.1)

**Solución en Mac:**
```bash
# Permitir conexiones entrantes
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add $(which node)
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblockapp $(which node)
```

### El QR no se escanea

**Solución:**
1. Asegúrate de que haya buena iluminación
2. Mantén el celular estable
3. Intenta con otra app de QR
4. Aumenta el tamaño del QR en el generador

---

## 🖼️ Agregar Imágenes a los Productos

Para agregar imágenes posteriormente, puedes ejecutar:

```sql
UPDATE products
SET image_url = 'https://tu-servidor.com/imagenes/tinto-tradicional.jpg'
WHERE name = 'Tinto Tradicional';
```

O crear un script de actualización masiva:

```sql
-- Ejemplo: Actualizar múltiples productos
UPDATE products SET image_url = 'URL_DE_IMAGEN' WHERE name = 'Café Americano';
UPDATE products SET image_url = 'URL_DE_IMAGEN' WHERE name = 'Café Latte';
-- ... etc
```

---

## 📱 Códigos QR para Mesas

### Mesas Sugeridas para Generar

Genera QR para cada mesa de tu restaurante:
- Mesa 1, 2, 3, 4, 5... etc.
- Cada QR llevará a `/menu/NUMERO_DE_MESA`

### Impresión de QR

1. Genera los QR usando el generador
2. Descarga cada uno
3. Imprime en tamaño mínimo: 5cm x 5cm
4. Plastifica para mayor durabilidad
5. Pega en cada mesa

### Formato Recomendado

```
┌─────────────────────┐
│   [LOGO CAFÉ LIMÓN] │
│                     │
│    📱 ESCANEA       │
│    NUESTRO MENÚ     │
│                     │
│    [QR CODE]        │
│                     │
│    Mesa #3          │
└─────────────────────┘
```

---

## 🎨 Personalización del Generador

El archivo `qr-generator.html` es completamente personalizable:

```html
<!-- Cambiar colores del QR -->
color: {
    dark: '#000000',    // Color del QR (negro por defecto)
    light: '#ffffff'    // Fondo (blanco por defecto)
}

<!-- Cambiar tamaño -->
width: 300  // Tamaño en píxeles (300px por defecto)
```

---

## ✅ Checklist de Puesta en Producción

- [ ] Cargar productos en la base de datos
- [ ] Verificar que todos los productos se muestran en el menú
- [ ] Generar QR para todas las mesas
- [ ] Imprimir y laminar los QR
- [ ] Pegar QR en las mesas
- [ ] Probar escaneo desde diferentes celulares
- [ ] Agregar imágenes a los productos (opcional)
- [ ] Configurar dominio de producción
- [ ] Regenerar QR con URL de producción

---

## 🆘 Soporte

Si tienes problemas:

1. Revisa los logs del backend: `docker logs -f cafe_limon_backend`
2. Revisa los logs del frontend en la consola del navegador
3. Verifica la conexión a la base de datos
4. Asegúrate de que todos los servicios estén corriendo

---

**¡Listo!** Ahora tienes un menú digital completo con más de 100 productos y un sistema de QR funcionando. 🎉
