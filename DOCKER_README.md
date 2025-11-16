# 🐳 Docker - Café Limón

## 🚀 Inicio Rápido

### Levantar todo el sistema

```bash
# Desde la raíz del proyecto
docker-compose up -d
```

¡Eso es todo! El sistema completo estará corriendo en:
- **Backend:** http://localhost:8080
- **Swagger UI:** http://localhost:8080/swagger-ui.html
- **PostgreSQL:** localhost:5432
- **Frontend:** http://localhost:5173 (ejecutar manualmente con `npm run dev`)

---

## 📋 Comandos Útiles

### Ver logs en tiempo real
```bash
# Todos los servicios
docker-compose logs -f

# Solo backend
docker-compose logs -f backend

# Solo PostgreSQL
docker-compose logs -f postgres
```

### Detener servicios
```bash
# Detener
docker-compose stop

# Detener y eliminar contenedores
docker-compose down

# Detener, eliminar y borrar volúmenes (datos de DB)
docker-compose down -v
```

### Reiniciar servicios
```bash
# Reiniciar todo
docker-compose restart

# Reiniciar solo backend
docker-compose restart backend
```

### Reconstruir contenedores
```bash
# Reconstruir y levantar
docker-compose up -d --build

# Forzar reconstrucción sin caché
docker-compose build --no-cache backend
docker-compose up -d
```

### Ver estado de servicios
```bash
docker-compose ps
```

### Ejecutar comandos en contenedores
```bash
# Acceder a PostgreSQL
docker-compose exec postgres psql -U postgres -d cafe_limon_dev

# Ver logs de backend
docker-compose exec backend tail -f /app/logs/application.log
```

---

## 🔧 Estructura de Docker

### Servicios

#### 1. PostgreSQL (`postgres`)
- **Imagen:** postgres:16-alpine
- **Puerto:** 5432
- **Base de datos:** cafe_limon_dev
- **Usuario:** postgres
- **Contraseña:** postgres123
- **Volumen:** Datos persistentes en `postgres_data`
- **Script de inicialización:** `data-init.sql` se ejecuta automáticamente al crear la DB

#### 2. Backend (`backend`)
- **Build:** Dockerfile multi-stage
  - Stage 1: Compilación con Maven
  - Stage 2: Ejecución con JRE 17
- **Puerto:** 8080
- **Perfil Spring:** prod
- **Health check:** Verifica `/actuator/health` cada 30s
- **Dependencias:** Espera a que PostgreSQL esté saludable antes de iniciar

---

## 🛠️ Configuración

### Variables de Entorno

Puedes crear un archivo `.env` en la raíz del proyecto:

```env
# Base de datos
DB_HOST=postgres
DB_PORT=5432
DB_NAME=cafe_limon_dev
DB_USERNAME=postgres
DB_PASSWORD=postgres123

# Backend
JWT_SECRET=tu-super-secret-key-aqui
FRONTEND_URL=http://localhost:5173

# Spring
SPRING_PROFILES_ACTIVE=prod
```

Luego Docker Compose usará estas variables automáticamente.

### Personalizar docker-compose.yml

Si necesitas cambiar puertos o configuraciones:

```yaml
services:
  backend:
    ports:
      - "9090:8080"  # Cambiar puerto del backend
    environment:
      JAVA_OPTS: "-Xmx1g -Xms512m"  # Ajustar memoria
```

---

## 📊 Inicialización de Datos

El archivo `backend/src/main/resources/data-init.sql` se ejecuta automáticamente cuando se crea la base de datos por primera vez. Incluye:

- ✅ 15 categorías de productos
- ✅ Productos de ejemplo
- ✅ 5 mesas de ejemplo (M01-M05)
- ✅ Usuario admin (usuario: `admin`, password: `admin123`)
- ✅ Usuario cocina (usuario: `cocina`, password: `cocina123`)

### Re-inicializar datos

Si quieres borrar todo y empezar de cero:

```bash
# Detener y eliminar volúmenes
docker-compose down -v

# Levantar de nuevo (ejecutará el script de inicialización)
docker-compose up -d
```

---

## 🧪 Probar el Sistema

### 1. Verificar que todo esté corriendo

```bash
docker-compose ps
```

Deberías ver:
```
NAME                  STATUS              PORTS
cafe-limon-db        Up (healthy)        0.0.0.0:5432->5432/tcp
cafe-limon-backend   Up (healthy)        0.0.0.0:8080->8080/tcp
```

### 2. Verificar backend

```bash
curl http://localhost:8080/actuator/health
```

Debería responder:
```json
{"status":"UP"}
```

### 3. Probar Swagger UI

Abrir en navegador: http://localhost:8080/swagger-ui.html

### 4. Login y obtener JWT

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

### 5. Obtener mesas

```bash
curl http://localhost:8080/api/tables
```

### 6. Acceder al menú

```bash
curl http://localhost:8080/api/menu/table/{MESA_ID}
```

---

## 🐛 Troubleshooting

### El backend no inicia
```bash
# Ver logs detallados
docker-compose logs backend

# Verificar que PostgreSQL esté saludable
docker-compose ps postgres
```

### Cambios en el código no se reflejan
```bash
# Reconstruir imagen del backend
docker-compose up -d --build backend
```

### PostgreSQL no acepta conexiones
```bash
# Reiniciar PostgreSQL
docker-compose restart postgres

# Ver logs de PostgreSQL
docker-compose logs postgres
```

### Error "port already in use"
```bash
# Ver qué proceso usa el puerto 8080
lsof -i :8080

# Matar el proceso
kill -9 <PID>

# O cambiar el puerto en docker-compose.yml
```

### Borrar todo y empezar de cero
```bash
# Detener todo
docker-compose down -v

# Borrar imágenes
docker rmi $(docker images -q cafe-limon*)

# Levantar de nuevo
docker-compose up -d --build
```

---

## 📦 Producción

### Build optimizado para producción

```bash
# Construir imagen optimizada
docker-compose build --no-cache backend

# Etiquetarla
docker tag cafe-limon-backend:latest cafe-limon-backend:v1.0.0

# Subir a registry (ejemplo Docker Hub)
docker tag cafe-limon-backend:latest usuario/cafe-limon-backend:v1.0.0
docker push usuario/cafe-limon-backend:v1.0.0
```

### Despliegue en servidor

```bash
# Copiar archivos al servidor
scp docker-compose.yml usuario@servidor:/app/
scp -r backend usuario@servidor:/app/

# En el servidor
cd /app
docker-compose up -d
```

### Variables de entorno en producción

**IMPORTANTE:** Cambiar en el servidor:

```bash
# Crear .env en producción
DB_PASSWORD=contraseña-segura-produccion
JWT_SECRET=jwt-secret-super-seguro-produccion
FRONTEND_URL=https://cafelimon.com
```

---

## 🔒 Seguridad

### Cambiar contraseñas por defecto

En producción, **SIEMPRE** cambiar:
- Password de PostgreSQL
- JWT Secret
- Password de usuario admin en la base de datos

### Generar nuevo hash de password

```bash
# Usar bcrypt online o generar con Java
# Ejemplo de hash bcrypt para "nuevaPassword123":
# $2a$10$xyz...
```

Actualizar en `data-init.sql` antes de hacer el build.

---

## 📝 Notas

- El volumen `postgres_data` persiste los datos entre reinicios
- Los logs del backend se pueden ver con `docker-compose logs -f backend`
- El frontend NO está incluido en Docker, córrelo manualmente con `npm run dev`
- Para desarrollo, considera usar `docker-compose.dev.yml` con hot-reload

---

## ✅ Checklist Pre-producción

- [ ] Cambiar `DB_PASSWORD` en docker-compose.yml
- [ ] Cambiar `JWT_SECRET` en docker-compose.yml
- [ ] Cambiar password de admin en data-init.sql
- [ ] Configurar `FRONTEND_URL` con dominio real
- [ ] Configurar SSL/HTTPS (Nginx reverse proxy)
- [ ] Configurar backup automático de PostgreSQL
- [ ] Configurar límites de recursos (CPU, RAM)
- [ ] Configurar logging externo (ELK, Splunk, etc.)
- [ ] Probar health checks
- [ ] Documentar procedimiento de rollback

---

**¡Sistema Docker listo! 🎉**

Ejecuta `docker-compose up -d` y empieza a usar Café Limón.
