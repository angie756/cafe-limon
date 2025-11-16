# 🚀 Configuración Completa - Café Limón

## ✅ Estado Actual del Sistema

- ✅ **Base de Datos**: PostgreSQL corriendo en Docker
- ✅ **Backend**: Spring Boot corriendo en puerto 8080
- ✅ **Frontend**: React + Vite corriendo en puerto 5173
- ✅ **Usuarios**: 2 usuarios configurados (admin y cocina)
- ✅ **Productos**: 151 productos cargados
- ✅ **Categorías**: 7 categorías activas
- ✅ **Mesas**: 10 mesas configuradas

---

## 🔐 Credenciales de Acceso

### **Usuario Administrador**
```
Usuario: admin
Password: admin123
```

### **Usuario Cocina**
```
Usuario: cocina
Password: cocina123
```

---

## 📊 Resumen de Productos por Categoría

| Categoría | Productos | Icono |
|-----------|-----------|-------|
| Bebidas Calientes | 48 | ☕ |
| Bebidas Frías | 21 | 🥤 |
| Tragos | 14 | 🥃 |
| Repostería | 8 | 🍰 |
| Delicias de la Casa | 39 | ⭐ |
| Licores | 13 | 🍷 |
| Panadería | 8 | 🥐 |
| **TOTAL** | **151** | |

---

## 🛠️ Cómo Iniciar el Sistema

### **1. Iniciar Base de Datos y Backend (Docker)**

```bash
# Asegúrate de estar en el directorio raíz del proyecto
cd /Users/felix.garcia/Documents/Projects/myProjects/Asys/Coffe

# Iniciar todo con Docker Compose
docker-compose up -d

# Verificar que todo esté corriendo
docker ps
```

Deberías ver algo como:
```
CONTAINER ID   IMAGE                  PORTS                    NAMES
9ef2e7b8c309   coffe-backend          0.0.0.0:8080->8080/tcp   cafe-limon-backend
e33ee0d8a778   postgres:16-alpine     0.0.0.0:5432->5432/tcp   cafe-limon-db
```

### **2. Iniciar Frontend**

```bash
# En una nueva terminal
cd frontend
npm install
npm run dev
```

Deberías ver:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

---

## 🌐 URLs de Acceso

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Frontend** | http://localhost:5173 | Aplicación principal |
| **Login** | http://localhost:5173/login | Página de login |
| **Menú (Mesa 3)** | http://localhost:5173/menu/3 | Menú digital mesa 3 |
| **Generador QR** | http://localhost:5173/qr-generator.html | Generador de códigos QR |
| **Backend API** | http://localhost:8080/api | API REST |
| **Swagger** | http://localhost:8080/swagger-ui.html | Documentación API |
| **Base de Datos** | localhost:5432 | PostgreSQL |

---

## 🔄 Resetear/Recargar Datos

Si necesitas resetear la base de datos:

```bash
# Ejecutar el script de configuración completa
docker exec cafe-limon-db psql -U postgres -d cafe_limon_dev -f /tmp/setup-complete.sql

# O desde tu máquina local
docker cp database/setup-complete.sql cafe-limon-db:/tmp/
docker exec cafe-limon-db psql -U postgres -d cafe_limon_dev -f /tmp/setup-complete.sql
```

Este script:
- ✅ Elimina usuarios existentes y los recrea
- ✅ Recrea todas las mesas
- ✅ Recrea todas las categorías
- ✅ Carga productos básicos

Para cargar TODOS los productos (151):
```bash
docker cp database/seed-menu-complete.sql cafe-limon-db:/tmp/
docker exec cafe-limon-db psql -U postgres -d cafe_limon_dev -f /tmp/seed-menu-complete.sql
```

---

## 📱 Probar desde el Celular

### **Método 1: Usando tu IP Local**

1. **Obtén tu IP local:**
   ```bash
   # Mac/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1

   # Windows
   ipconfig
   ```

   Busca algo como: `192.168.1.10` o `192.168.0.15`

2. **Asegúrate que el frontend esté corriendo:**
   ```bash
   cd frontend && npm run dev
   ```

3. **Desde tu celular, abre el navegador y ve a:**
   ```
   http://TU-IP-LOCAL:5173/menu/3

   Ejemplo: http://192.168.1.10:5173/menu/3
   ```

### **Método 2: Generar QR y Escanear**

1. **Abre el generador de QR:**
   ```
   http://localhost:5173/qr-generator.html
   ```

2. **Configura:**
   - **Número de Mesa**: 3
   - **Ambiente**: Personalizado
   - **URL Personalizada**: `http://TU-IP-LOCAL:5173`

3. **Genera el QR y escanéalo con tu celular**

---

## 🐛 Solución de Problemas Comunes

### **Problema: No puedo hacer login con admin/admin123**

**Causa**: Las contraseñas en la base de datos no coinciden.

**Solución**:
```bash
# Ejecutar el script de configuración
docker cp database/setup-complete.sql cafe-limon-db:/tmp/
docker exec cafe-limon-db psql -U postgres -d cafe_limon_dev -f /tmp/setup-complete.sql

# Reiniciar el backend
docker restart cafe-limon-backend
```

### **Problema: El menú aparece vacío**

**Causa**: No hay productos en la base de datos.

**Solución**:
```bash
# Cargar todos los productos
docker cp database/seed-menu-complete.sql cafe-limon-db:/tmp/
docker exec cafe-limon-db psql -U postgres -d cafe_limon_dev -f /tmp/seed-menu-complete.sql

# Verificar
docker exec cafe-limon-db psql -U postgres -d cafe_limon_dev -c "SELECT COUNT(*) FROM products;"
```

### **Problema: Error 403 Forbidden en /tables/3/menu**

**Causa**: El endpoint requiere autenticación pero ya tiene fallback.

**Solución**: El código ya tiene un fallback automático que usa `/menu` si `/tables/:id/menu` falla. Si sigues viendo el error, verifica que el backend esté corriendo:

```bash
curl http://localhost:8080/api/menu
```

### **Problema: QRCode is not defined**

**Causa**: La biblioteca de QR no se cargó correctamente.

**Solución**: Ya está arreglado. Si persiste:
1. Cierra el navegador completamente
2. Limpia el caché (Cmd+Shift+R en Mac, Ctrl+Shift+R en Windows)
3. Vuelve a abrir `http://localhost:5173/qr-generator.html`

### **Problema: No puedo acceder desde el celular**

**Verificaciones**:
1. ¿Están ambos dispositivos en la misma red WiFi?
2. ¿El firewall está bloqueando las conexiones?
3. ¿Usaste la IP correcta? (192.168.x.x, NO 127.0.0.1)

**Solución en Mac**:
```bash
# Permitir conexiones entrantes
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add $(which node)
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblockapp $(which node)
```

### **Problema: Backend no se conecta a la Base de Datos**

**Solución**:
```bash
# Verificar que PostgreSQL esté corriendo
docker ps | grep postgres

# Ver logs del backend
docker logs cafe-limon-backend

# Reiniciar servicios
docker-compose restart
```

---

## 🔍 Verificar que Todo Funciona

### **1. Verificar Base de Datos**
```bash
# Verificar conexión
docker exec cafe-limon-db psql -U postgres -d cafe_limon_dev -c "\dt"

# Contar registros
docker exec cafe-limon-db psql -U postgres -d cafe_limon_dev -c "
  SELECT
    'Usuarios' as tabla, COUNT(*) as total FROM users
  UNION ALL
  SELECT 'Productos', COUNT(*) FROM products
  UNION ALL
  SELECT 'Categorías', COUNT(*) FROM categories
  UNION ALL
  SELECT 'Mesas', COUNT(*) FROM tables;
"
```

Deberías ver:
```
   tabla    | total
------------+-------
 Usuarios   |     2
 Productos  |   151
 Categorías |    15
 Mesas      |    10
```

### **2. Verificar Backend**
```bash
# Health check
curl http://localhost:8080/actuator/health

# Obtener menú
curl http://localhost:8080/api/menu

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### **3. Verificar Frontend**

Abre en tu navegador:
- ✅ http://localhost:5173 → Debería mostrar la página principal
- ✅ http://localhost:5173/login → Página de login
- ✅ http://localhost:5173/menu/3 → Menú de la mesa 3 con productos
- ✅ http://localhost:5173/qr-generator.html → Generador de QR

---

## 📦 Estructura de Archivos Importantes

```
Coffe/
├── backend/
│   └── src/main/resources/
│       ├── application.yml          # Configuración principal
│       └── data-init.sql            # Script inicial (básico)
├── frontend/
│   ├── public/
│   │   └── qr-generator.html        # ✅ ARREGLADO
│   └── src/
│       ├── pages/MenuPage.jsx       # ✅ ARREGLADO (con fallback)
│       └── hooks/useMenu.js         # ✅ ARREGLADO
├── database/
│   ├── setup-complete.sql           # ✅ NUEVO - Configuración completa
│   └── seed-menu-complete.sql       # ✅ NUEVO - 151 productos
└── docs/
    ├── QR_Y_PRODUCTOS.md            # Guía de QR y productos
    └── CONFIGURACION_COMPLETA.md    # ✅ Este archivo
```

---

## 🎯 Checklist de Producción

- [ ] Cambiar contraseñas de usuarios
- [ ] Configurar dominio real
- [ ] Regenerar QR con URL de producción
- [ ] Configurar HTTPS
- [ ] Configurar respaldos de base de datos
- [ ] Agregar imágenes a los productos
- [ ] Imprimir y plastificar QR codes
- [ ] Pegar QR en las mesas
- [ ] Probar desde múltiples dispositivos
- [ ] Configurar monitoreo y logs

---

## 🆘 Soporte y Ayuda

### **Ver Logs**

```bash
# Backend
docker logs -f cafe-limon-backend

# Base de datos
docker logs -f cafe-limon-db

# Frontend (en la consola del navegador)
F12 → Console
```

### **Reiniciar Todo**

```bash
# Reiniciar servicios Docker
docker-compose restart

# O parar y volver a iniciar
docker-compose down
docker-compose up -d
```

### **Limpiar y Empezar de Nuevo**

```bash
# ⚠️ CUIDADO: Esto eliminará TODOS los datos

# Parar servicios
docker-compose down

# Eliminar volúmenes (datos)
docker volume rm coffe_postgres_data

# Volver a iniciar
docker-compose up -d

# Recargar datos
docker cp database/setup-complete.sql cafe-limon-db:/tmp/
docker exec cafe-limon-db psql -U postgres -d cafe_limon_dev -f /tmp/setup-complete.sql

docker cp database/seed-menu-complete.sql cafe-limon-db:/tmp/
docker exec cafe-limon-db psql -U postgres -d cafe_limon_dev -f /tmp/seed-menu-complete.sql
```

---

## 🎉 ¡Todo Listo!

Si seguiste esta guía, deberías tener:

- ✅ Sistema completamente funcional
- ✅ 151 productos cargados
- ✅ Usuarios admin y cocina funcionando
- ✅ Generador de QR funcionando
- ✅ Menú accesible desde el celular

**¡Disfruta tu sistema de Café Limón! ☕**

---

**Última actualización**: 2025-11-15
**Versión**: 1.0.0
