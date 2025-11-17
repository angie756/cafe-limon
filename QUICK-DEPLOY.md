# Guía Rápida de Despliegue - 10 Minutos

## Pre-requisitos
- Cuenta de GitHub
- Cuenta de Railway (gratis): https://railway.app
- Cuenta de Vercel (gratis): https://vercel.com

---

## Paso 1: Preparar Repositorio Git (2 min)

```bash
cd /Users/felix.garcia/Documents/Projects/myProjects/Asys/Coffe

# Inicializar git si no existe
git init
git add .
git commit -m "Preparar para despliegue"

# Crear repo en GitHub y conectar
git remote add origin https://github.com/TU-USUARIO/cafe-limon.git
git branch -M main
git push -u origin main
```

---

## Paso 2: Desplegar Backend en Railway (5 min)

### 2.1 Crear Proyecto
1. Ir a https://railway.app
2. Login con GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Seleccionar `cafe-limon`

### 2.2 Agregar Base de Datos
1. En el proyecto, click "+ New" → "Database" → "PostgreSQL"
2. Railway crea automáticamente la BD

### 2.3 Configurar Variables de Entorno
En el servicio backend (NO en PostgreSQL), agregar en "Variables":

```
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=super-secreto-de-al-menos-32-caracteres-cambiame
FRONTEND_URL=https://cafe-limon.vercel.app
PORT=8080
```

### 2.4 Configurar Root Directory
1. Settings → Root Directory → `backend`
2. Save

### 2.5 Generar Dominio
1. Settings → Generate Domain
2. Copiar URL (ej: `cafe-limon.up.railway.app`)

---

## Paso 3: Desplegar Frontend en Vercel (3 min)

### 3.1 Crear .env.production
Crear `/frontend/.env.production` con:

```
VITE_API_URL=https://cafe-limon.up.railway.app/api
VITE_WS_URL=https://cafe-limon.up.railway.app
VITE_ENV=production
```

Hacer commit:
```bash
git add frontend/.env.production
git commit -m "Add production config"
git push
```

### 3.2 Desplegar en Vercel
1. Ir a https://vercel.com
2. Login con GitHub
3. "Add New..." → "Project"
4. Seleccionar `cafe-limon`
5. Configurar:
   - Framework Preset: `Vite`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

6. En Environment Variables agregar:
```
VITE_API_URL=https://cafe-limon.up.railway.app/api
VITE_WS_URL=https://cafe-limon.up.railway.app
VITE_ENV=production
```

7. Click "Deploy"

### 3.3 Copiar URL de Vercel
Ej: `cafe-limon.vercel.app`

### 3.4 Actualizar CORS
Volver a Railway → Variables del backend → Actualizar:
```
FRONTEND_URL=https://cafe-limon.vercel.app
```

---

## Paso 4: Verificar Despliegue

### Probar Backend
```bash
# Health check
curl https://TU-BACKEND.railway.app/api/health

# Login
curl -X POST https://TU-BACKEND.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Probar Frontend
1. Abrir `https://TU-FRONTEND.vercel.app`
2. Login: admin / admin123
3. Verificar menú se carga
4. Crear un pedido de prueba

---

## Usuarios por Defecto

### Admin
- Usuario: `admin`
- Contraseña: `admin123`

### Cocina
- Usuario: `cocina`
- Contraseña: `cocina123`

**IMPORTANTE**: Cambiar estas contraseñas en producción!

---

## Actualizar Aplicación

```bash
# Hacer cambios en el código
git add .
git commit -m "Descripción del cambio"
git push

# Railway y Vercel redesplegar automáticamente
```

---

## Costos

### Railway
- $5 crédito mensual GRATIS
- ~500 horas de ejecución/mes
- Incluye PostgreSQL

### Vercel
- GRATIS ilimitado
- 100 GB bandwidth/mes

---

## Problemas Comunes

### Backend no inicia
→ Ver logs en Railway → Deployments → View Logs

### Frontend no conecta
→ Verificar VITE_API_URL en Vercel → Settings → Environment Variables

### Base de datos vacía
→ Ir a Railway → PostgreSQL → Data → Verificar tablas

### CORS error
→ Verificar que FRONTEND_URL en Railway coincida con URL de Vercel

---

## Documentación Completa

Ver `DEPLOYMENT.md` para guía detallada con troubleshooting y configuración avanzada.
