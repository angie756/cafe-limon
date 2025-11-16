# Inicio Rápido - Café Limón

## Para Iniciar AHORA MISMO

### Backend (Spring Boot)

```bash
cd /Users/felix.garcia/Documents/Projects/myProjects/Asys/Coffe/backend

# Abrir en IntelliJ IDEA (RECOMENDADO)
open -a "IntelliJ IDEA" .

# O abrir en VS Code
code .
```

**En el IDE:**
1. Esperar a que cargue el proyecto Maven
2. Habilitar "Annotation Processing" en Settings
3. Click derecho en `CafeLimonApplication.java` > Run
4. El backend iniciará en http://localhost:8080

### Frontend (React + Vite)

```bash
cd /Users/felix.garcia/Documents/Projects/myProjects/Asys/Coffe/frontend

# Limpiar procesos anteriores
pkill -f "vite" 2>/dev/null || true

# Iniciar
npm run dev
```

El frontend iniciará en **http://localhost:5173**

---

## Verificar que Funciona

1. **Backend**: http://localhost:8080/swagger-ui.html
2. **Frontend**: http://localhost:5173

---

## Problemas Comunes

### Backend no compila
```bash
# Solución: Abrir en IntelliJ IDEA
brew install --cask intellij-idea-ce
open -a "IntelliJ IDEA" /Users/felix.garcia/Documents/Projects/myProjects/Asys/Coffe/backend
```

### Frontend da error de WebSocket
```bash
# Limpiar y reiniciar
cd frontend
pkill -f "vite"
rm -rf node_modules/.vite
npm run dev
```

---

## Variables de Entorno

Ya están configuradas en:
- Frontend: `.env.development`, `.env.qa`, `.env.production`
- Backend: `application-dev.yml`, `application-qa.yml`, `application-prod.yml`

---

## Documentación Completa

Ver: `docs/PROYECTO_COMPLETO.md`

---

## Configuración MCP Navegador

Ver: `docs/MCP_BROWSER_SETUP.md`

Para que Claude Code pueda controlar un navegador automáticamente.

---

**¡Todo listo! Solo abre los proyectos en un IDE y ejecuta.**
