# ✅ Checklist Rápido de Deployment

Guía ultra-rápida para desplegar en Railway + Vercel.

---

## 📦 Antes de Empezar

✅ Código en GitHub: https://github.com/angie756/cafe-limon
✅ Frontend build generado: `frontend/dist/`
✅ Backend Dockerfile listo
✅ Railway conectado con GitHub
✅ Vercel conectado con GitHub

---

## 🚂 Railway (Backend) - 5 Pasos

### 1️⃣ Crear PostgreSQL
- Click **+ New** → **Database** → **PostgreSQL**

### 2️⃣ Crear Servicio Backend
- Click **+ New** → **GitHub Repo** → `angie756/cafe-limon`
- **Settings** → Root Directory: `backend`

### 3️⃣ Configurar Variables
```bash
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=<genera-con: openssl rand -base64 32>
SPRING_PROFILES_ACTIVE=prod
PORT=8080
FRONTEND_URL=https://TEMPORAL-actualizaremos-despues.com
```

### 4️⃣ Generar Dominio
- **Settings** → **Networking** → **Generate Domain**
- Copia la URL (ej: `cafe-limon-abc123.up.railway.app`)

### 5️⃣ Verificar
```bash
curl https://TU-BACKEND.railway.app/actuator/health
# Debe retornar: {"status":"UP"}
```

---

## 🌐 Vercel (Frontend) - 4 Pasos

### 1️⃣ Crear Proyecto
- **Add New** → **Project** → `angie756/cafe-limon`

### 2️⃣ Configurar Build
```
Framework: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
```

### 3️⃣ Agregar Variables (Production + Preview + Development)
```bash
VITE_API_URL=https://TU-BACKEND.railway.app/api
VITE_WS_URL=https://TU-BACKEND.railway.app
VITE_ENV=production
VITE_APP_NAME=Café Limón
VITE_ENABLE_LOGGER=false
```

### 4️⃣ Deploy
- Click **Deploy**
- Copia la URL (ej: `cafe-limon.vercel.app`)

---

## 🔄 Actualizar CORS

Vuelve a **Railway** → Backend → Variables:
```bash
FRONTEND_URL=https://cafe-limon.vercel.app
```
(Usa TU URL de Vercel)

---

## ✅ Verificación Final

- [ ] Backend health: `https://TU-BACKEND.railway.app/actuator/health`
- [ ] Frontend carga: `https://TU-FRONTEND.vercel.app`
- [ ] Login funciona: admin / admin123
- [ ] Menú se carga
- [ ] Pedido se crea
- [ ] Cocina recibe notificación

---

## 🆘 Si algo falla

1. **Backend no inicia**: Railway → Deployments → View Logs
2. **Frontend error 404**: Vercel → Redeploy
3. **CORS error**: Verifica `FRONTEND_URL` en Railway = URL de Vercel
4. **"Failed to fetch"**: Verifica `VITE_API_URL` en Vercel = URL de Railway

---

## 📚 Guías Detalladas

- **Paso a paso completo**: [DEPLOYMENT-NOW.md](DEPLOYMENT-NOW.md)
- **Variables de entorno**: [VARIABLES-ENTORNO.md](VARIABLES-ENTORNO.md)
- **Guía general**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Quick deploy**: [QUICK-DEPLOY.md](QUICK-DEPLOY.md)

---

**Tiempo estimado: 10-15 minutos total** ⏱️
