# Guía para Generar Token de GitHub y Hacer Push

## ✅ Estado Actual

- ✅ Usuario configurado: `angie756`
- ✅ Email configurado: `angiemelissa.gutierrezquintana@gmail.com`
- ✅ Todos los commits actualizados con el nuevo autor
- ✅ Repositorio remoto conectado: `https://github.com/angie756/cafe-limon.git`

---

## 🔑 Paso 1: Generar Personal Access Token en GitHub

### 1.1 Ir a GitHub Settings

1. Abre tu navegador y ve a: https://github.com
2. Haz login con tu cuenta: **angie756**
3. Click en tu foto de perfil (esquina superior derecha)
4. Click en **Settings** (Configuración)

### 1.2 Acceder a Developer Settings

1. En el menú lateral izquierdo, scroll hasta el final
2. Click en **Developer settings** (última opción)

### 1.3 Crear Personal Access Token (Classic)

1. Click en **Personal access tokens**
2. Click en **Tokens (classic)**
3. Click en el botón **Generate new token** → **Generate new token (classic)**

### 1.4 Configurar el Token

**Name (Nombre del token):**
```
Token para Cafe Limon - Desarrollo
```

**Expiration (Expiración):**
```
90 days (o "No expiration" si prefieres que no expire)
```

**Select scopes (Permisos requeridos):**

Marca estas opciones:
- ✅ **repo** (acceso completo a repositorios privados)
  - ✅ repo:status
  - ✅ repo_deployment
  - ✅ public_repo
  - ✅ repo:invite
  - ✅ security_events

**NOTA:** Marcar "repo" marca automáticamente todos los sub-permisos.

### 1.5 Generar y Copiar el Token

1. Scroll hasta abajo
2. Click en el botón verde **Generate token**
3. **IMPORTANTE:** Verás un token que empieza con `ghp_...`
4. **Copia este token INMEDIATAMENTE** (solo se muestra una vez)
5. Guárdalo en un lugar seguro (por ejemplo, un administrador de contraseñas)

**Ejemplo de token:**
```
ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 🚀 Paso 2: Hacer Push al Repositorio

Una vez que tengas tu token, ejecuta estos comandos:

### Opción A: Push con Token en la URL (Más Fácil)

```bash
git push -u origin main
```

Cuando te pida usuario y contraseña:
- **Username:** angie756
- **Password:** [pega tu token ghp_xxxxxxx aquí]

### Opción B: Configurar Token en Git Credential Manager

```bash
# macOS: usa keychain
git config --global credential.helper osxkeychain

# Luego haz push
git push -u origin main

# Git te pedirá usuario y password:
# Username: angie756
# Password: ghp_xxxxxxxxxxxxxxxx
```

### Opción C: Usar SSH en lugar de HTTPS (Más Seguro)

Si prefieres usar SSH (recomendado para desarrollo):

```bash
# 1. Generar clave SSH
ssh-keygen -t ed25519 -C "angiemelissa.gutierrezquintana@gmail.com"

# 2. Copiar clave pública
cat ~/.ssh/id_ed25519.pub

# 3. Agregar en GitHub:
# Settings → SSH and GPG keys → New SSH key → Pegar clave

# 4. Cambiar URL remota a SSH
git remote set-url origin git@github.com:angie756/cafe-limon.git

# 5. Push
git push -u origin main
```

---

## 📋 Resumen de Comandos a Ejecutar

Una vez que tengas tu token de GitHub:

```bash
# 1. Verificar configuración
git config --list | grep -E "user.name|user.email"
# Debe mostrar: angie756 y angiemelissa.gutierrezquintana@gmail.com

# 2. Verificar remoto
git remote -v
# Debe mostrar: https://github.com/angie756/cafe-limon.git

# 3. Hacer push (te pedirá usuario y token)
git push -u origin main

# 4. También subir el tag
git push origin v1.0.0
```

---

## 🔐 Seguridad del Token

**IMPORTANTE:**
- ❌ NO compartas tu token con nadie
- ❌ NO lo subas a ningún repositorio
- ❌ NO lo pongas en archivos de código
- ✅ Guárdalo en un administrador de contraseñas seguro
- ✅ Si se compromete, revócalo inmediatamente en GitHub

**Revocar token comprometido:**
1. GitHub → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Buscar tu token → Click en **Delete**
4. Generar un nuevo token

---

## ❓ Problemas Comunes

### Error: "Authentication failed"
- Verifica que estés usando el token (no tu password de GitHub)
- Verifica que el token tenga permisos "repo"
- Genera un nuevo token si es necesario

### Error: "Repository not found"
- Verifica que el repositorio exista: https://github.com/angie756/cafe-limon
- Verifica que estés usando el usuario correcto (angie756)

### Error: "Permission denied"
- Verifica que tu cuenta tenga permisos de escritura en el repo
- Si es un repo privado, asegúrate de que el token tenga permisos "repo"

---

## ✅ Verificación Final

Después del push exitoso:

```bash
# Ver repositorio en GitHub
https://github.com/angie756/cafe-limon

# Verificar commits
git log --oneline

# Verificar que se subió todo
git status
```

---

## 📞 Ayuda Adicional

Si tienes problemas, verifica:
1. Que creaste el repositorio en GitHub (debe existir)
2. Que el token tiene permisos "repo"
3. Que el nombre de usuario es correcto (angie756)

**Documentación oficial de GitHub:**
- Tokens: https://docs.github.com/es/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
- SSH: https://docs.github.com/es/authentication/connecting-to-github-with-ssh

---

**¿Listo para hacer push?** 🚀

Cuando tengas tu token, solo ejecuta:
```bash
git push -u origin main
```
