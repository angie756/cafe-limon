# Guía de Seguridad - Variables de Entorno

## 🔐 Principios de Seguridad

**NUNCA subir secretos al repositorio de Git:**
- ❌ NO subir archivos `.env` con valores reales
- ❌ NO hardcodear API keys, tokens, o passwords en el código
- ✅ Solo versionar archivos `.env.example` como plantillas
- ✅ Usar variables de entorno en producción (Railway, Vercel)

---

## 📂 Archivos de Configuración

### ✅ Archivos que SÍ están en el repo (seguros)

```
frontend/.env.example           # Plantilla para desarrollo
frontend/.env.production.example # Plantilla para producción
backend/.env.example            # Plantilla para backend
.gitignore                      # Excluye archivos sensibles
```

### ❌ Archivos que NO deben estar en el repo (ignorados por git)

```
frontend/.env                   # Variables locales
frontend/.env.development       # Configuración de desarrollo
frontend/.env.production        # Configuración de producción real
frontend/.env.local            # Overrides locales
backend/.env                   # Variables del backend
*.env                          # Cualquier otro .env
```

---

## 🛠️ Configuración por Ambiente

### 1️⃣ Desarrollo Local

**Frontend:**
```bash
cd frontend

# Copiar plantilla
cp .env.example .env.development

# Editar valores para desarrollo local
# VITE_API_URL=http://localhost:8080/api
# VITE_WS_URL=http://localhost:8080
```

**Backend:**

El backend usa `application.yml` con valores por defecto seguros para desarrollo:
```yaml
datasource:
  url: jdbc:postgresql://localhost:5432/cafe_limon_dev
  username: postgres
  password: postgres

jwt:
  secret: ${JWT_SECRET:cafe-limon-super-secret-key-change-in-production-2025}
```

**NOTA:** Estos defaults solo funcionan en desarrollo. En producción DEBES usar variables de entorno.

---

### 2️⃣ Producción (Railway + Vercel)

**IMPORTANTE:** En producción NO se usan archivos `.env`. Las variables se configuran directamente en las plataformas.

#### Backend en Railway

Ir a Railway → Tu Proyecto → Variables → Agregar:

```bash
# Base de Datos (Railway la proporciona automáticamente)
DATABASE_URL=${{Postgres.DATABASE_URL}}  # Auto-generada

# JWT Secret (GENERAR UNO NUEVO Y SEGURO)
JWT_SECRET=<genera-un-secreto-aleatorio-de-32-caracteres>

# CORS
FRONTEND_URL=https://tu-app.vercel.app

# Spring
SPRING_PROFILES_ACTIVE=prod
PORT=8080
```

**Generar JWT_SECRET seguro:**
```bash
# Opción 1: OpenSSL
openssl rand -base64 32

# Opción 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Opción 3: Python
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

#### Frontend en Vercel

Ir a Vercel → Tu Proyecto → Settings → Environment Variables → Agregar:

```bash
VITE_API_URL=https://tu-backend.up.railway.app/api
VITE_WS_URL=https://tu-backend.up.railway.app
VITE_ENV=production
```

**NOTA:** Vercel requiere que vuelvas a desplegar después de cambiar variables de entorno.

---

## 🔍 Verificación de Seguridad

### Antes de hacer commit, verifica:

```bash
# 1. Ver qué archivos se van a subir
git status

# 2. Verificar que no hay archivos .env siendo trackeados
git ls-files | grep ".env"
# Debería mostrar SOLO:
# - frontend/.env.example
# - frontend/.env.production.example
# - backend/.env.example

# 3. Ver diferencias antes de commit
git diff

# 4. Buscar secretos accidentalmente agregados
git diff | grep -i "secret\|password\|key\|token"
```

### Después de clonar el repo:

```bash
# 1. Crear tus archivos .env locales (NO se suben al repo)
cp frontend/.env.example frontend/.env.development
cp backend/.env.example backend/.env

# 2. Editar con tus valores locales
nano frontend/.env.development
nano backend/.env

# 3. Verificar que .gitignore los excluye
git status  # No deberían aparecer los archivos .env
```

---

## 🚨 Qué hacer si subiste secretos accidentalmente

Si subiste credenciales o secretos al repo por error:

### 1. Cambiar INMEDIATAMENTE las credenciales comprometidas

```bash
# Backend (Railway)
# - Regenerar JWT_SECRET
# - Cambiar password de base de datos si aplica
```

### 2. Limpiar el historial de Git

```bash
# Opción A: Si fue en el último commit (no pusheado)
git reset --soft HEAD~1
git reset HEAD <archivo-con-secretos>
git checkout -- <archivo-con-secretos>

# Opción B: Si ya hiciste push (MÁS COMPLICADO)
# Considerar usar: git-filter-repo o BFG Repo-Cleaner
# Ver: https://docs.github.com/es/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository
```

### 3. Forzar push (con cuidado)

```bash
git push --force origin main
```

**ADVERTENCIA:** `git push --force` puede causar problemas si otros desarrolladores ya clonaron el repo.

---

## ✅ Checklist de Seguridad

Antes de desplegar a producción:

- [ ] Archivos `.env` están en `.gitignore`
- [ ] Solo archivos `.env.example` están en el repo
- [ ] `git ls-files | grep ".env"` no muestra archivos con secretos
- [ ] JWT_SECRET generado aleatoriamente (mínimo 32 caracteres)
- [ ] Passwords de base de datos cambiados de los defaults
- [ ] CORS configurado solo para el dominio del frontend
- [ ] Variables de entorno configuradas en Railway/Vercel (no en archivos)
- [ ] Credenciales por defecto cambiadas (admin/admin123 → nuevas passwords)
- [ ] `application.yml` no tiene secretos hardcodeados

---

## 📚 Recursos Adicionales

- [OWASP - Configuration Management](https://owasp.org/www-project-top-ten/2017/A6_2017-Security_Misconfiguration)
- [12 Factor App - Config](https://12factor.net/config)
- [GitHub - Removing Sensitive Data](https://docs.github.com/es/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [Railway Docs - Environment Variables](https://docs.railway.app/develop/variables)
- [Vercel Docs - Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

---

## 🆘 Contacto

Si descubres una vulnerabilidad de seguridad, por favor NO la reportes públicamente. Contacta directamente a los responsables del proyecto.

**Desarrollado para Café Limón - Politécnico ASYS © 2025**
