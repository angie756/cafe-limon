# Variables de Entorno - Railway y Vercel

Guía rápida de todas las variables de entorno necesarias para el deployment.

---

## 🚂 Railway (Backend)

Ve a: **Railway Dashboard → Tu Servicio Backend → Variables → Raw Editor**

Pega esto y reemplaza los valores:

```bash
# === Base de Datos (Railway Reference) ===
DATABASE_URL=${{Postgres.DATABASE_URL}}

# === JWT Secret (GENERA UNO NUEVO) ===
# Ejecuta: openssl rand -base64 32
JWT_SECRET=TU_SECRET_ALEATORIO_DE_32_CARACTERES_AQUI

# === Spring Configuration ===
SPRING_PROFILES_ACTIVE=prod

# === Puerto ===
PORT=8080

# === Frontend URL (URL de Vercel) ===
# Reemplaza con TU URL de Vercel después de desplegar
FRONTEND_URL=https://cafe-limon.vercel.app
```

### Ejemplo Completo:

```bash
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=Xp9K2mN5vR8wY6uT3qL0oP7sA4hF1gD9jK8mN2vR5wY
SPRING_PROFILES_ACTIVE=prod
PORT=8080
FRONTEND_URL=https://cafe-limon.vercel.app
```

**IMPORTANTE:**
- `DATABASE_URL`: Usa `${{Postgres.DATABASE_URL}}` exactamente así (Railway lo reemplaza automáticamente)
- `JWT_SECRET`: DEBE ser aleatorio (mínimo 32 caracteres)
- `FRONTEND_URL`: Usa TU URL de Vercel (obtenida en Paso 2 del deployment)

---

## 🌐 Vercel (Frontend)

Ve a: **Vercel Dashboard → Tu Proyecto → Settings → Environment Variables**

Agrega estas variables para **Production**, **Preview**, y **Development**:

```bash
# === Backend URLs (Railway) ===
# Reemplaza con TU URL de Railway
VITE_API_URL=https://cafe-limon-backend-production.up.railway.app/api
VITE_WS_URL=https://cafe-limon-backend-production.up.railway.app

# === Configuración de la App ===
VITE_ENV=production
VITE_APP_NAME=Café Limón
VITE_ENABLE_LOGGER=false
```

### Cómo agregar en Vercel:

1. Click **Add New** → **Environment Variable**
2. Para cada variable:
   - **Key:** Nombre de la variable (ej: `VITE_API_URL`)
   - **Value:** Valor correspondiente
   - **Environments:** Marca **Production**, **Preview**, **Development**
   - Click **Save**

**IMPORTANTE:**
- Reemplaza `cafe-limon-backend-production.up.railway.app` con TU URL de Railway
- NO incluyas `/api` en `VITE_WS_URL` (solo la URL base)
- Después de agregar variables, debes **Redeploy** en Vercel

---

## 🔄 Orden de Configuración

1. **Primero:** Configura variables en Railway (excepto `FRONTEND_URL`)
2. **Segundo:** Despliega backend en Railway y obtén la URL
3. **Tercero:** Configura variables en Vercel usando la URL de Railway
4. **Cuarto:** Despliega frontend en Vercel y obtén la URL
5. **Quinto:** Vuelve a Railway y actualiza `FRONTEND_URL` con la URL de Vercel

---

## 📋 Checklist de Variables

### Railway Backend:
- [ ] `DATABASE_URL=${{Postgres.DATABASE_URL}}`
- [ ] `JWT_SECRET=<aleatorio-32-chars>`
- [ ] `SPRING_PROFILES_ACTIVE=prod`
- [ ] `PORT=8080`
- [ ] `FRONTEND_URL=https://<tu-app>.vercel.app`

### Vercel Frontend:
- [ ] `VITE_API_URL=https://<tu-backend>.up.railway.app/api`
- [ ] `VITE_WS_URL=https://<tu-backend>.up.railway.app`
- [ ] `VITE_ENV=production`
- [ ] `VITE_APP_NAME=Café Limón`
- [ ] `VITE_ENABLE_LOGGER=false`

---

## 🛠️ Comandos Útiles para Generar Secretos

```bash
# Opción 1: OpenSSL (macOS/Linux)
openssl rand -base64 32

# Opción 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Opción 3: Python
python3 -c "import secrets; print(secrets.token_urlsafe(32))"

# Opción 4: Online
# https://generate-secret.vercel.app/32
```

---

## ⚠️ Errores Comunes

### Error: "DATABASE_URL is not defined"
**Causa:** Variable mal configurada en Railway.
**Solución:** Usa `${{Postgres.DATABASE_URL}}` exactamente así (con doble llave)

### Error: CORS blocked
**Causa:** `FRONTEND_URL` en Railway no coincide con URL de Vercel.
**Solución:**
1. Verifica que `FRONTEND_URL` en Railway sea exacta (con https://)
2. No incluyas `/` al final de la URL

### Error: "Failed to fetch" en frontend
**Causa:** `VITE_API_URL` apunta a URL incorrecta.
**Solución:**
1. Verifica que la URL de Railway sea correcta
2. Incluye `/api` al final de `VITE_API_URL`
3. Redeploy en Vercel después de cambiar variables

### Backend no inicia
**Causa:** JWT_SECRET demasiado corto o variables faltantes.
**Solución:**
1. JWT_SECRET debe tener mínimo 32 caracteres
2. Verifica que todas las variables estén configuradas
3. Ve a Railway Logs para ver el error específico

---

## 🔐 Seguridad

**NUNCA compartas estas variables:**
- ❌ NO subas a GitHub
- ❌ NO compartas en Discord/Slack
- ❌ NO las pongas en el código

**Solo configúralas en:**
- ✅ Railway Dashboard (variables de entorno)
- ✅ Vercel Dashboard (environment variables)
- ✅ Tu archivo local `.env` (para desarrollo, NO subir a git)

---

## 📸 Captura de Pantalla de Ejemplo

### Railway Variables:
```
+------------------------+--------------------------------------------+
| Variable               | Value                                      |
+------------------------+--------------------------------------------+
| DATABASE_URL           | ${{Postgres.DATABASE_URL}}                 |
| JWT_SECRET             | Xp9K2mN5vR8wY6uT3qL0oP7sA4hF1gD9jK...    |
| SPRING_PROFILES_ACTIVE | prod                                       |
| PORT                   | 8080                                       |
| FRONTEND_URL           | https://cafe-limon.vercel.app              |
+------------------------+--------------------------------------------+
```

### Vercel Variables:
```
+------------------------+--------------------------------------------+
| Variable               | Value                                      |
+------------------------+--------------------------------------------+
| VITE_API_URL           | https://cafe-limon...railway.app/api       |
| VITE_WS_URL            | https://cafe-limon...railway.app           |
| VITE_ENV               | production                                 |
| VITE_APP_NAME          | Café Limón                                 |
| VITE_ENABLE_LOGGER     | false                                      |
+------------------------+--------------------------------------------+
```

---

## ✅ Verificación Final

Una vez configuradas todas las variables:

```bash
# 1. Railway - Ver variables configuradas
Railway → Backend → Variables → Debería ver 5 variables

# 2. Vercel - Ver variables configuradas
Vercel → Settings → Environment Variables → Debería ver 5 variables

# 3. Probar conexión
curl https://TU-BACKEND.railway.app/actuator/health
# Debe retornar: {"status":"UP"}

# 4. Abrir frontend
https://TU-FRONTEND.vercel.app
# Debe cargar sin errores de consola
```

---

**¿Listo?** Sigue la guía completa en **DEPLOYMENT-NOW.md** para el proceso paso a paso.
