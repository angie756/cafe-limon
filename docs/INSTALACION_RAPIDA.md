# Guía de Instalación Rápida - Café Limón

> Instrucciones paso a paso para tener el sistema funcionando en menos de 5 minutos

## ✅ Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

- [x] **Docker Desktop** - [Descargar aquí](https://www.docker.com/products/docker-desktop/)
- [x] **Git** - [Descargar aquí](https://git-scm.com/downloads)

**Verificar instalación:**
```bash
docker --version  # Debe mostrar: Docker version 20.x.x o superior
git --version     # Debe mostrar: git version 2.x.x o superior
```

## 🚀 Instalación en 3 Pasos

### Paso 1: Clonar el Repositorio

```bash
# Navegar a la carpeta donde quieres el proyecto
cd ~/Documents/Projects

# Clonar el repositorio
git clone https://github.com/tu-usuario/cafe-limon.git

# Entrar a la carpeta
cd cafe-limon
```

### Paso 2: Iniciar los Servicios con Docker

```bash
# Levantar todos los servicios (backend, frontend, base de datos)
docker compose up -d

# Esperar ~30 segundos mientras se descargan e inician los contenedores
```

**Salida esperada:**
```
✔ Network coffe_default  Created
✔ Container cafe-limon-db      Started
✔ Container cafe-limon-backend Started
```

### Paso 3: Inicializar la Base de Datos

```bash
# Ejecutar el script de setup completo
docker exec -it cafe-limon-db psql -U postgres -d cafe_limon_dev -f /docker-entrypoint-initdb.d/setup-complete.sql
```

**Salida esperada:**
```
DROP TABLE
DROP TABLE
...
INSERT 0 2   (usuarios)
INSERT 0 15  (categorías)
INSERT 0 151 (productos)
INSERT 0 6   (mesas)
```

## ✨ ¡Listo! Verificar Instalación

### 1. Verificar que los servicios estén corriendo

```bash
docker compose ps
```

**Debe mostrar:**
```
NAME                 STATUS              PORTS
cafe-limon-backend   Up (healthy)        0.0.0.0:8080->8080/tcp
cafe-limon-db        Up (healthy)        0.0.0.0:5432->5432/tcp
```

### 2. Verificar Backend

```bash
# Test simple del API
curl http://localhost:8080/api/products
```

Si responde con JSON de productos, ¡el backend funciona! ✅

### 3. Abrir el Frontend

**Opción A: Con Docker (Recomendado para producción)**
```bash
# El frontend NO está dockerizado por defecto
# Ir a la sección "Modo Desarrollo" más abajo
```

**Opción B: Sin Docker (Desarrollo)**
```bash
# Ir a la carpeta frontend
cd frontend

# Instalar dependencias (solo la primera vez)
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

**Abrir en el navegador:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080

## 🧪 Probar el Sistema

### Test 1: Menú de Cliente

1. Abrir: http://localhost:5173/menu/2
2. ✅ Debes ver el menú con 151 productos
3. ✅ Debes ver 15 categorías en la parte superior
4. ✅ Al hacer clic en "Todos" se agrupan por categoría

### Test 2: Login de Administrador

1. Abrir: http://localhost:5173/login
2. Usuario: `admin`
3. Contraseña: `admin123`
4. Click en "Iniciar Sesión"
5. ✅ Debes ver el panel de administración

### Test 3: Panel de Cocina

1. Abrir: http://localhost:5173/login
2. Usuario: `cocina`
3. Contraseña: `cocina123`
4. Click en "Iniciar Sesión"
5. ✅ Debes ver el panel de cocina (vacío si no hay pedidos)

### Test 4: Crear un Pedido Completo

**Como Cliente:**
1. Ir a: http://localhost:5173/menu/2
2. Buscar "Tinto Tradicional"
3. Click en "Agregar" (2 veces)
4. Click en "Ver Carrito (2)"
5. Click en "Confirmar Pedido"
6. ✅ Guardar el ID del pedido que aparece

**Como Cocina:**
1. Login como `cocina/cocina123`
2. ✅ Debes ver el pedido en "Pendientes"
3. Click en "Iniciar Preparación"
4. ✅ El pedido pasa a "En Preparación"
5. Click en "Marcar como Listo"
6. ✅ El pedido pasa a "Listos"

**Como Admin:**
1. Login como `admin/admin123`
2. ✅ Debes ver el pedido en "Pedidos Recientes"
3. Verificar que muestra "Mesa 2"
4. Click en "Marcar Entregado"
5. ✅ El estado cambia a "ENTREGADO"
6. ✅ "Ingresos Hoy" se actualiza

## 🎯 URLs de Acceso Rápido

| Servicio | URL | Credenciales |
|----------|-----|--------------|
| **Frontend** | http://localhost:5173 | N/A |
| **Menu Mesa 2** | http://localhost:5173/menu/2 | N/A (público) |
| **Login Admin** | http://localhost:5173/login | admin / admin123 |
| **Login Cocina** | http://localhost:5173/login | cocina / cocina123 |
| **Backend API** | http://localhost:8080 | N/A |
| **API Products** | http://localhost:8080/api/products | N/A (público) |
| **PostgreSQL** | localhost:5432 | postgres / postgres |

## 🛠️ Comandos Útiles

### Ver Logs en Tiempo Real

```bash
# Todos los servicios
docker compose logs -f

# Solo backend
docker compose logs -f backend

# Solo base de datos
docker compose logs -f database
```

### Detener el Sistema

```bash
# Detener todos los servicios
docker compose down

# Detener Y eliminar la base de datos (CUIDADO)
docker compose down -v
```

### Reiniciar un Servicio

```bash
# Reiniciar backend
docker compose restart backend

# Reiniciar base de datos
docker compose restart database
```

### Reconstruir Imágenes

```bash
# Si cambias código del backend
docker compose up -d --build backend

# Si cambias todo
docker compose up -d --build
```

## 🐛 Solución de Problemas Comunes

### Problema 1: "port is already allocated"

**Error:** `bind: address already in use`

**Solución:**
```bash
# Verificar qué está usando el puerto 8080
lsof -i :8080

# Matar el proceso (reemplazar PID)
kill -9 PID

# O cambiar el puerto en docker-compose.yml
ports:
  - "8081:8080"  # Usar 8081 en vez de 8080
```

### Problema 2: Backend no inicia

**Error:** `Backend container exited with code 1`

**Solución:**
```bash
# Ver logs del error
docker compose logs backend

# Verificar que PostgreSQL está corriendo
docker compose ps database

# Reiniciar ambos servicios
docker compose restart database backend
```

### Problema 3: Base de datos vacía

**Síntoma:** El menú no muestra productos

**Solución:**
```bash
# Re-ejecutar el script de setup
docker exec -it cafe-limon-db psql -U postgres -d cafe_limon_dev -f /docker-entrypoint-initdb.d/setup-complete.sql

# Verificar que se crearon los productos
docker exec -it cafe-limon-db psql -U postgres -d cafe_limon_dev -c "SELECT COUNT(*) FROM products;"
# Debe mostrar: 151
```

### Problema 4: Frontend no carga

**Síntoma:** Página en blanco o "Cannot GET /"

**Solución:**
```bash
# Verificar que el backend está corriendo
curl http://localhost:8080/api/products

# Si no responde, verificar logs
docker compose logs backend

# Reiniciar frontend
cd frontend
npm run dev
```

### Problema 5: Docker no encuentra el archivo

**Error:** `ERROR: Cannot locate specified Dockerfile`

**Solución:**
```bash
# Verificar que estás en la carpeta correcta
pwd
# Debe mostrar: .../cafe-limon

# Verificar que existe docker-compose.yml
ls docker-compose.yml

# Si no existe, verificar que clonaste bien el repo
git pull origin main
```

## 📱 Modo Desarrollo vs Producción

### Desarrollo (Actual)

```bash
# Backend: Docker
docker compose up -d backend database

# Frontend: npm run dev
cd frontend
npm run dev
```

**Ventajas:**
- ✅ Hot reload en frontend
- ✅ DevTools habilitados
- ✅ Logs detallados

### Producción (Futuro)

```bash
# Todo en Docker
docker compose -f docker-compose.prod.yml up -d

# O build separado
cd frontend
npm run build

cd backend
./mvnw clean package -DskipTests
```

## 🔄 Actualizar el Proyecto

```bash
# Pull latest changes
git pull origin main

# Reconstruir servicios
docker compose up -d --build

# Re-ejecutar setup de BD (si hay cambios en esquema)
docker exec -it cafe-limon-db psql -U postgres -d cafe_limon_dev -f /docker-entrypoint-initdb.d/setup-complete.sql
```

## 📚 Próximos Pasos

Después de la instalación:

1. **Leer la documentación completa**: [README.md](../README.md)
2. **Ver arquitectura del sistema**: [ARCHITECTURE.md](ARCHITECTURE.md)
3. **Explorar endpoints de API**: [API.md](API.md)
4. **Revisar base de datos**: [database/README.md](../database/README.md)

## 💡 Tips y Mejores Prácticas

### 1. Backup Regular

```bash
# Crear backup diario
docker exec cafe-limon-db pg_dump -U postgres cafe_limon_dev > backup_$(date +%Y%m%d).sql
```

### 2. Monitoreo de Logs

```bash
# Terminal 1: Logs de backend
docker compose logs -f backend

# Terminal 2: Logs de frontend
cd frontend && npm run dev
```

### 3. Limpiar Docker

```bash
# Limpiar contenedores detenidos
docker container prune

# Limpiar imágenes no usadas
docker image prune

# Limpiar todo (CUIDADO)
docker system prune -a
```

## 🆘 Obtener Ayuda

Si tienes problemas:

1. **Revisar logs**: `docker compose logs -f`
2. **Consultar documentación**: [docs/](.)
3. **Verificar issues**: [GitHub Issues](https://github.com/tu-usuario/cafe-limon/issues)
4. **Contactar soporte**: Crear un nuevo issue

---

**¿Funcionó todo?** 🎉

Si lograste completar todos los tests, ¡felicitaciones! El sistema está completamente funcional.

**Siguiente paso:** Explorar el [README principal](../README.md) para conocer todas las funcionalidades.
