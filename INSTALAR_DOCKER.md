# 🐳 Instalar Docker en macOS

## Opción 1: Docker Desktop (Recomendado - Interfaz Gráfica)

### Instalar con Homebrew
```bash
brew install --cask docker
```

### O Descargar Manualmente
1. Ir a https://www.docker.com/products/docker-desktop/
2. Descargar Docker Desktop para Mac
3. Instalar el .dmg
4. Abrir Docker Desktop
5. Esperar a que Docker se inicie (ícono de ballena en la barra superior)

### Verificar instalación
```bash
docker --version
docker-compose --version
```

---

## Opción 2: Colima (Alternativa Ligera - CLI)

```bash
# Instalar Colima
brew install colima docker docker-compose

# Iniciar Colima
colima start

# Verificar
docker --version
docker-compose --version
```

---

## 🚀 Después de Instalar Docker

### Levantar Café Limón

```bash
cd /Users/felix.garcia/Documents/Projects/myProjects/Asys/Coffe

# Construir y levantar servicios
docker-compose up -d --build
```

### Ver logs
```bash
docker-compose logs -f
```

### Verificar que esté corriendo
```bash
docker-compose ps
```

Deberías ver:
```
NAME                  STATUS              PORTS
cafe-limon-db        Up (healthy)        0.0.0.0:5432->5432/tcp
cafe-limon-backend   Up (healthy)        0.0.0.0:8080->8080/tcp
```

### Probar el backend
```bash
curl http://localhost:8080/actuator/health
```

---

## ⚡ Comandos Rápidos

```bash
# Iniciar
docker-compose up -d

# Detener
docker-compose stop

# Ver logs
docker-compose logs -f backend

# Reiniciar
docker-compose restart

# Eliminar todo (incluye volúmenes)
docker-compose down -v
```

---

## 🎯 URLs Disponibles

Una vez levantado:
- **Backend API:** http://localhost:8080
- **Swagger UI:** http://localhost:8080/swagger-ui.html
- **H2 Console:** http://localhost:8080/h2-console (solo dev)
- **Frontend:** http://localhost:5173 (ejecutar con `npm run dev`)

---

## 📊 Base de Datos

- **Host:** localhost
- **Puerto:** 5432
- **Database:** cafe_limon_dev
- **Usuario:** postgres
- **Password:** postgres123

Conectarse con cliente PostgreSQL:
```bash
psql -h localhost -U postgres -d cafe_limon_dev
```

O con DBeaver, pgAdmin, etc.

---

## 🔧 Solución de Problemas

### Docker no se encuentra
```bash
# Verificar si Docker está instalado
which docker

# Si no está, instalar:
brew install --cask docker
```

### Error "Cannot connect to the Docker daemon"
```bash
# Iniciar Docker Desktop
open -a Docker

# O si usas Colima:
colima start
```

### Puerto 8080 ya en uso
```bash
# Ver qué usa el puerto
lsof -i :8080

# Matar el proceso
kill -9 <PID>

# O cambiar puerto en docker-compose.yml:
# ports:
#   - "9090:8080"
```

### Reconstruir desde cero
```bash
# Detener y borrar todo
docker-compose down -v

# Borrar imágenes
docker rmi $(docker images -q cafe-limon*)

# Construir de nuevo
docker-compose up -d --build
```

---

**¡Todo listo! Una vez instalado Docker, ejecuta `docker-compose up -d` y el sistema completo estará funcionando! 🚀**
