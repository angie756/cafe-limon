# Guía de Despliegue - Café Limón

## Resumen de Despliegue

- **Frontend**: Vercel (gratis ilimitado)
- **Backend + Base de Datos**: Railway (tier gratuito con $5 de crédito mensual)

## Tabla de Contenidos

1. [Preparación del Backend](#1-preparación-del-backend)
2. [Preparación del Frontend](#2-preparación-del-frontend)
3. [Despliegue del Backend en Railway](#3-despliegue-del-backend-en-railway)
4. [Despliegue del Frontend en Vercel](#4-despliegue-del-frontend-en-vercel)
5. [Verificación y Pruebas](#5-verificación-y-pruebas)
6. [Mantenimiento y Actualizaciones](#6-mantenimiento-y-actualizaciones)

---

## 1. Preparación del Backend

### 1.1 Crear Dockerfile

Ya está creado en `/backend/Dockerfile` con la siguiente configuración:
- Java 17
- Maven build multi-stage
- Puerto 8080 expuesto

### 1.2 Configurar application.properties para producción

El archivo `application-prod.properties` ya está configurado con variables de entorno:
- `DATABASE_URL`
- `JWT_SECRET`
- `FRONTEND_URL`

### 1.3 Verificar que el backend compile

```bash
cd backend
./mvnw clean package -DskipTests
```

Debe crear el archivo: `target/backend-0.0.1-SNAPSHOT.jar`

---

## 2. Preparación del Frontend

### 2.1 Crear archivo de configuración de Vercel

Ya está creado en `/frontend/vercel.json`

### 2.2 Configurar variables de entorno

Crear archivo `/frontend/.env.production`:

```env
VITE_API_URL=https://tu-backend.railway.app/api
VITE_WS_URL=https://tu-backend.railway.app
VITE_ENV=production
```

**NOTA**: Reemplazarás la URL después de desplegar el backend

### 2.3 Verificar que el frontend compile

```bash
cd frontend
npm run build
```

Debe crear el directorio `dist/`

---

## 3. Despliegue del Backend en Railway

### 3.1 Crear cuenta en Railway

1. Ve a [railway.app](https://railway.app)
2. Haz clic en "Start a New Project"
3. Conecta tu cuenta de GitHub

### 3.2 Inicializar repositorio Git (si no existe)

```bash
cd /Users/felix.garcia/Documents/Projects/myProjects/Asys/Coffe
git init
git add .
git commit -m "Initial commit for deployment"
```

### 3.3 Subir a GitHub

1. Crea un repositorio en GitHub llamado `cafe-limon`
2. Conecta tu repositorio local:

```bash
git remote add origin https://github.com/TU-USUARIO/cafe-limon.git
git branch -M main
git push -u origin main
```

### 3.4 Crear proyecto en Railway

1. En Railway, haz clic en "New Project"
2. Selecciona "Deploy from GitHub repo"
3. Selecciona el repositorio `cafe-limon`
4. Railway detectará automáticamente el Dockerfile

### 3.5 Agregar PostgreSQL

1. En tu proyecto de Railway, haz clic en "+ New"
2. Selecciona "Database" → "Add PostgreSQL"
3. Railway creará automáticamente la base de datos y te dará la URL de conexión

### 3.6 Configurar variables de entorno en Railway

En el servicio del backend (no la base de datos), ve a "Variables" y agrega:

```
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=tu-secreto-super-seguro-de-al-menos-32-caracteres-aqui
FRONTEND_URL=https://tu-frontend.vercel.app
PORT=8080
```

**IMPORTANTE**:
- Railway automáticamente expone `Postgres.DATABASE_URL` cuando vinculas la base de datos
- Genera un JWT_SECRET seguro (puedes usar: `openssl rand -base64 32`)

### 3.7 Configurar el Root Directory

1. En Railway, ve a "Settings" del servicio backend
2. En "Root Directory" escribe: `backend`
3. Guarda los cambios

### 3.8 Desplegar

1. Railway desplegará automáticamente
2. Espera a que el build termine (5-10 minutos la primera vez)
3. Una vez completado, haz clic en "Settings" → "Generate Domain"
4. Copia la URL generada (ejemplo: `cafe-limon-backend.up.railway.app`)

### 3.9 Inicializar la base de datos

Railway ejecutará automáticamente los scripts de `schema.sql` y `data.sql` la primera vez.

Para verificar:
1. Ve al servicio de PostgreSQL en Railway
2. Haz clic en "Data"
3. Deberías ver las tablas creadas

---

## 4. Despliegue del Frontend en Vercel

### 4.1 Actualizar variables de entorno

Edita `/frontend/.env.production` con la URL real del backend:

```env
VITE_API_URL=https://cafe-limon-backend.up.railway.app/api
VITE_WS_URL=https://cafe-limon-backend.up.railway.app
VITE_ENV=production
```

Haz commit de este cambio:

```bash
git add frontend/.env.production
git commit -m "Update production API URL"
git push
```

### 4.2 Crear cuenta en Vercel

1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en "Sign Up"
3. Conecta con GitHub

### 4.3 Importar proyecto

1. En Vercel, haz clic en "Add New..." → "Project"
2. Selecciona el repositorio `cafe-limon`
3. Configura el proyecto:

```
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 4.4 Configurar variables de entorno en Vercel

En "Environment Variables" agrega:

```
VITE_API_URL=https://cafe-limon-backend.up.railway.app/api
VITE_WS_URL=https://cafe-limon-backend.up.railway.app
VITE_ENV=production
```

### 4.5 Desplegar

1. Haz clic en "Deploy"
2. Vercel construirá y desplegará automáticamente (2-3 minutos)
3. Una vez completado, obtendrás una URL (ejemplo: `cafe-limon.vercel.app`)

### 4.6 Actualizar CORS en el backend

1. Ve a Railway → Variables del servicio backend
2. Actualiza `FRONTEND_URL` con la URL real de Vercel:

```
FRONTEND_URL=https://cafe-limon.vercel.app
```

3. El servicio se redesplegar automáticamente

---

## 5. Verificación y Pruebas

### 5.1 Verificar Backend

Prueba estos endpoints:

```bash
# Health check
curl https://cafe-limon-backend.up.railway.app/api/health

# Login (debería devolver un token)
curl -X POST https://cafe-limon-backend.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Obtener menú
curl https://cafe-limon-backend.up.railway.app/api/menu
```

### 5.2 Verificar Frontend

1. Abre `https://cafe-limon.vercel.app` en el navegador
2. Intenta hacer login con:
   - Usuario: `admin`
   - Contraseña: `admin123`
3. Verifica que se cargue el menú
4. Intenta crear un pedido

### 5.3 Verificar WebSocket

1. En la aplicación desplegada, inicia sesión como admin
2. Abre otra pestaña como usuario de cocina
3. Crea un pedido desde la primera pestaña
4. Verifica que la segunda pestaña reciba la notificación en tiempo real

---

## 6. Mantenimiento y Actualizaciones

### 6.1 Actualizar el Backend

```bash
# 1. Hacer cambios en el código
# 2. Commit y push
git add .
git commit -m "Update backend: descripción del cambio"
git push

# Railway redesplegar automáticamente
```

### 6.2 Actualizar el Frontend

```bash
# 1. Hacer cambios en el código
# 2. Commit y push
git add .
git commit -m "Update frontend: descripción del cambio"
git push

# Vercel redesplegar automáticamente
```

### 6.3 Ver logs

**Backend (Railway):**
1. Ve a tu proyecto en Railway
2. Haz clic en el servicio del backend
3. Ve a la pestaña "Deployments"
4. Haz clic en el deployment activo → "View Logs"

**Frontend (Vercel):**
1. Ve a tu proyecto en Vercel
2. Haz clic en el deployment
3. Ve a "Functions" o "Build Logs"

### 6.4 Rollback

**Railway:**
1. Ve a "Deployments"
2. Encuentra un deployment anterior que funcionaba
3. Haz clic en los tres puntos → "Redeploy"

**Vercel:**
1. Ve a "Deployments"
2. Encuentra un deployment anterior
3. Haz clic en los tres puntos → "Promote to Production"

---

## 7. Costos y Límites

### Railway (Tier Gratuito)
- $5 de crédito mensual
- Aproximadamente 500 horas de ejecución al mes
- 1 GB de RAM
- PostgreSQL incluido (1 GB de almacenamiento)

**NOTA**: Si excedes el límite, el servicio se pausará hasta el siguiente mes.

### Vercel (Tier Gratuito)
- Despliegues ilimitados
- 100 GB de ancho de banda/mes
- Sin límite de builds
- Dominio personalizado gratis

---

## 8. Dominios Personalizados (Opcional)

### Frontend (Vercel)

1. Ve a tu proyecto en Vercel → "Settings" → "Domains"
2. Agrega tu dominio (ejemplo: `cafelimon.com`)
3. Configura los DNS según las instrucciones de Vercel

### Backend (Railway)

1. Ve a tu servicio en Railway → "Settings" → "Domains"
2. Agrega tu dominio (ejemplo: `api.cafelimon.com`)
3. Configura los DNS según las instrucciones de Railway

---

## 9. Seguridad

### 9.1 Variables de entorno sensibles

NUNCA hagas commit de:
- `.env.production` con valores reales
- JWT secrets
- Credenciales de base de datos

Usa `.gitignore` para excluirlas.

### 9.2 Cambiar credenciales por defecto

Antes de producción, cambia:

```sql
-- En Railway PostgreSQL, ejecuta:
UPDATE users SET password = '$2a$10$NUEVO_HASH' WHERE username = 'admin';
```

Genera un nuevo hash con BCrypt.

### 9.3 HTTPS

Tanto Railway como Vercel proveen HTTPS automáticamente.

---

## 10. Monitoreo

### Railway
- Dashboard muestra uso de CPU, RAM y tráfico
- Alertas cuando te acercas al límite de crédito

### Vercel
- Analytics integrado
- Métricas de rendimiento (Core Web Vitals)

---

## 11. Solución de Problemas Comunes

### Backend no inicia
- Revisa los logs en Railway
- Verifica que las variables de entorno estén configuradas
- Asegúrate que DATABASE_URL esté conectado

### Frontend no se conecta al backend
- Verifica CORS: `FRONTEND_URL` debe coincidir con la URL de Vercel
- Revisa la consola del navegador para errores
- Verifica que VITE_API_URL sea correcta

### Base de datos vacía
- Ve a Railway → PostgreSQL → Data
- Ejecuta manualmente los scripts SQL si es necesario

### WebSocket no funciona
- Asegúrate que WS_URL esté configurado correctamente
- Verifica que no haya bloqueadores de popups/websockets en el navegador

---

## 12. Comandos Útiles de Referencia

```bash
# Backend - Build local
cd backend
./mvnw clean package -DskipTests

# Backend - Ejecutar localmente
java -jar target/backend-0.0.1-SNAPSHOT.jar

# Frontend - Build local
cd frontend
npm run build

# Frontend - Preview del build
npm run preview

# Ver logs de Railway (requiere CLI)
railway logs

# Ver deployments de Vercel (requiere CLI)
vercel ls
```

---

## 13. Recursos Adicionales

- [Documentación de Railway](https://docs.railway.app)
- [Documentación de Vercel](https://vercel.com/docs)
- [Spring Boot deployment best practices](https://spring.io/guides/gs/spring-boot-docker/)
- [Vite production build](https://vitejs.dev/guide/build.html)

---

## Contacto y Soporte

Para problemas específicos de la aplicación, revisa:
- `/backend/README.md` - Documentación del backend
- `/frontend/README.md` - Documentación del frontend
- Tests: 420 tests totales con 90%+ de cobertura
