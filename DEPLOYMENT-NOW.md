# Guía de Despliegue - Vercel y Railway AHORA

Ya que Vercel y Railway están conectados con GitHub, sigue estos pasos para completar el deployment.

---

## ✅ Estado Actual

- ✅ Código subido a: https://github.com/angie756/cafe-limon
- ✅ Frontend build generado: `frontend/dist/` (455 bytes index.html, 375KB JS)
- ✅ Backend con Dockerfile listo
- ✅ Vercel conectado con GitHub
- ✅ Railway conectado con GitHub

---

## 🚀 Paso 1: Desplegar Backend en Railway (5 minutos)

### 1.1 Crear Base de Datos PostgreSQL

1. En Railway Dashboard, click **+ New**
2. Click **Database** → **PostgreSQL**
3. Railway creará automáticamente la base de datos
4. Anota el nombre (ej: "Postgres")

### 1.2 Configurar Servicio del Backend

Si aún no has creado el servicio del backend:

1. Click **+ New** → **GitHub Repo**
2. Selecciona: `angie756/cafe-limon`
3. Railway detectará automáticamente el `railway.json`

### 1.3 Configurar Variables de Entorno

En Railway, ve a tu servicio backend → **Variables** → Agregar:

```bash
# === IMPORTANTE: Railway proporciona DATABASE_URL automáticamente ===
# Solo agrega estas variables:

# 1. JWT Secret (GENERA UNO NUEVO)
JWT_SECRET=<copia-el-secret-que-generaremos-abajo>

# 2. Spring Profile
SPRING_PROFILES_ACTIVE=prod

# 3. Puerto (Railway lo asigna automáticamente, pero puedes especificar)
PORT=8080

# 4. Frontend URL (la obtendrás de Vercel en el Paso 2)
FRONTEND_URL=https://tu-app.vercel.app

# 5. Database URL (Railway Reference Variable)
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

### 1.4 Generar JWT Secret Seguro

Ejecuta en tu terminal:

```bash
# Opción 1: OpenSSL
openssl rand -base64 32

# Opción 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copia el resultado y úsalo como `JWT_SECRET`.

### 1.5 Configurar Root Directory

1. Ve a tu servicio backend → **Settings**
2. En **Root Directory**, pon: `backend`
3. Click **Save**

### 1.6 Generar Dominio Público

1. Ve a **Settings** → **Networking**
2. Click **Generate Domain**
3. Railway te dará una URL como: `cafe-limon-backend-production.up.railway.app`
4. **COPIA ESTA URL** - la necesitarás para Vercel

### 1.7 Verificar Deployment

1. Ve a **Deployments** en Railway
2. Espera a que el build termine (toma ~3-5 minutos)
3. Verifica los logs:
   - Busca: "Started CafeLimonApplication"
   - Si ves errores de base de datos, verifica que `DATABASE_URL` esté configurada

### 1.8 Probar Backend

Abre en tu navegador:

```bash
# Health check
https://TU-BACKEND.up.railway.app/actuator/health

# Debería retornar: {"status":"UP"}
```

---

## 🌐 Paso 2: Desplegar Frontend en Vercel (3 minutos)

### 2.1 Configurar Proyecto

Si aún no has configurado el proyecto en Vercel:

1. En Vercel Dashboard, click **Add New...** → **Project**
2. Selecciona: `angie756/cafe-limon`
3. Vercel detectará automáticamente Vite

### 2.2 Configurar Build Settings

En la configuración del proyecto:

```bash
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 2.3 Configurar Environment Variables

En Vercel → Tu Proyecto → **Settings** → **Environment Variables**

Agrega las siguientes variables (para **Production**, **Preview**, y **Development**):

```bash
# URL del backend de Railway (usa la URL que copiaste en Paso 1.6)
VITE_API_URL=https://cafe-limon-backend-production.up.railway.app/api

# WebSocket URL (misma URL base)
VITE_WS_URL=https://cafe-limon-backend-production.up.railway.app

# Environment
VITE_ENV=production

# App name
VITE_APP_NAME=Café Limón

# Disable logger en producción
VITE_ENABLE_LOGGER=false
```

**IMPORTANTE:** Reemplaza `cafe-limon-backend-production.up.railway.app` con TU URL real de Railway.

### 2.4 Deploy

1. Click **Deploy**
2. Vercel empezará a hacer el build (~1-2 minutos)
3. Una vez completado, Vercel te dará una URL como:
   - `cafe-limon.vercel.app` o
   - `cafe-limon-angie756.vercel.app`

### 2.5 Copiar URL de Vercel

Copia la URL completa de Vercel (ej: `https://cafe-limon.vercel.app`)

---

## 🔄 Paso 3: Actualizar CORS en Railway

Ahora que tienes la URL de Vercel, actualiza el backend:

1. Ve a Railway → Tu servicio backend → **Variables**
2. Actualiza o agrega:
   ```bash
   FRONTEND_URL=https://cafe-limon.vercel.app
   ```
   (usa TU URL real de Vercel)

3. Railway reiniciará automáticamente el backend (~1 minuto)

---

## ✅ Paso 4: Verificar Todo Funciona

### 4.1 Probar Backend

```bash
# 1. Health check
curl https://TU-BACKEND.up.railway.app/actuator/health

# 2. Login (debe retornar token)
curl -X POST https://TU-BACKEND.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# 3. Obtener menú
curl https://TU-BACKEND.up.railway.app/api/products
```

### 4.2 Probar Frontend

1. Abre: `https://TU-FRONTEND.vercel.app`
2. Verifica que carga correctamente
3. Intenta login: admin / admin123
4. Verifica que el menú se carga
5. Crea un pedido de prueba

### 4.3 Verificar WebSocket

1. Login como "cocina" / "cocina123"
2. En otra pestaña, crea un pedido como cliente
3. Verifica que la cocina recibe el pedido en tiempo real

---

## 🐛 Troubleshooting

### Error: "Failed to fetch" en frontend

**Causa:** Frontend no puede conectarse al backend.

**Solución:**
1. Verifica que `VITE_API_URL` en Vercel tenga la URL correcta del backend
2. Verifica que el backend esté corriendo en Railway (Deployments → Logs)
3. Verifica que `FRONTEND_URL` en Railway sea la URL de Vercel

### Error: CORS en consola del navegador

**Causa:** CORS no configurado correctamente.

**Solución:**
1. Ve a Railway → Variables
2. Asegúrate que `FRONTEND_URL` sea exactamente la URL de Vercel (con https://)
3. Railway reiniciará automáticamente

### Backend no inicia en Railway

**Soluciones:**
1. Verifica logs: Railway → Deployments → View Logs
2. Busca errores de conexión a base de datos
3. Verifica que `DATABASE_URL` esté configurada: `${{Postgres.DATABASE_URL}}`
4. Verifica que Root Directory sea: `backend`

### Frontend muestra página en blanco

**Soluciones:**
1. Vercel → Deployments → View Function Logs
2. Verifica que Build Settings estén correctos:
   - Root Directory: `frontend`
   - Output Directory: `dist`
3. Redeploy manualmente: Vercel → Deployments → ... → Redeploy

---

## 📋 Checklist Final

Antes de compartir la app:

- [ ] Backend responde en: https://TU-BACKEND.up.railway.app/actuator/health
- [ ] Frontend carga en: https://TU-FRONTEND.vercel.app
- [ ] Login funciona (admin / admin123)
- [ ] Menú se carga correctamente
- [ ] Pedidos se crean exitosamente
- [ ] Cocina recibe notificaciones en tiempo real
- [ ] No hay errores CORS en consola
- [ ] Variables de entorno configuradas en ambas plataformas
- [ ] JWT_SECRET es un valor aleatorio (no el default)

---

## 🔐 Seguridad Post-Deployment

**IMPORTANTE - Hacer INMEDIATAMENTE después del primer deploy:**

### 1. Cambiar Contraseñas de Usuarios

Las contraseñas por defecto son:
- admin / admin123
- cocina / cocina123

**Cómo cambiarlas:**

Opción A: Conectarte a PostgreSQL en Railway
```sql
-- Generar hash BCrypt de nueva password (online: bcrypt-generator.com)
UPDATE users SET password = '$2a$10$NUEVO_HASH_AQUI' WHERE username = 'admin';
UPDATE users SET password = '$2a$10$NUEVO_HASH_AQUI' WHERE username = 'cocina';
```

Opción B: Crear endpoint temporal de cambio de password (recomendado para después)

### 2. Verificar JWT_SECRET

```bash
# Railway → Variables
# Asegúrate que JWT_SECRET NO sea el default
# Debe ser algo como: Xp9K2m...random...Y8hT
```

---

## 📊 Monitoreo

### Logs en Railway

```bash
# Ver logs en tiempo real
Railway → Tu servicio → Deployments → View Logs

# Filtrar errores
Busca: "ERROR", "Exception", "Failed"
```

### Logs en Vercel

```bash
# Ver logs de funciones
Vercel → Deployments → Tu deploy → View Function Logs
```

---

## 🎉 URLs Finales

Una vez completado, tendrás:

```bash
# Frontend (Vercel)
https://cafe-limon.vercel.app

# Backend (Railway)
https://cafe-limon-backend-production.up.railway.app

# Base de Datos (Railway - privada)
Solo accesible desde el backend
```

---

## 💰 Costos

**Railway:**
- Plan gratuito: $5 crédito mensual
- Tu app usa: ~$3-4/mes (backend + PostgreSQL)
- **Total: GRATIS** (dentro del crédito)

**Vercel:**
- Plan hobby: 100% gratis
- Bandwidth: 100GB/mes
- **Total: GRATIS**

---

## 🔄 Actualizaciones Futuras

Cada vez que hagas push a GitHub:

```bash
git add .
git commit -m "Descripción del cambio"
git push origin main
```

**Vercel y Railway redesplegarán automáticamente** (~2-3 minutos)

---

## 📞 Soporte

- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app
- **Proyecto:** https://github.com/angie756/cafe-limon/issues

---

**¡Listo para producción!** 🚀

Tu Sistema de Auto-Pedido de Café Limón está ahora en línea y accesible desde cualquier lugar del mundo.
