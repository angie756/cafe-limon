# 🚀 Quick Start - Café Limón

## ⚡ Inicio Rápido (3 Pasos)

```bash
# 1. Iniciar servicios
docker-compose up -d

# 2. Cargar datos (usuarios, productos, mesas)
docker cp database/setup-complete.sql cafe-limon-db:/tmp/
docker exec cafe-limon-db psql -U postgres -d cafe_limon_dev -f /tmp/setup-complete.sql
docker cp database/seed-menu-complete.sql cafe-limon-db:/tmp/
docker exec cafe-limon-db psql -U postgres -d cafe_limon_dev -f /tmp/seed-menu-complete.sql

# 3. Iniciar frontend
cd frontend && npm install && npm run dev
```

**Resultado**: Sistema completo con 151 productos cargados!

---

## 📋 URLs del Sistema

| Servicio | URL | Descripción |
|----------|-----|-------------|
| **Frontend** | http://localhost:5173 | Interfaz de usuario |
| **Login** | http://localhost:5173/login | Página de inicio de sesión |
| **Menú Digital (Mesa 3)** | http://localhost:5173/menu/3 | Menú para escanear QR |
| **Generador QR** | http://localhost:5173/qr-generator.html | Generar códigos QR para mesas |
| **Backend API** | http://localhost:8080/api | API REST |
| **Swagger UI** | http://localhost:8080/swagger-ui.html | Documentación API |
| **PostgreSQL** | localhost:5432 | Base de datos |

---

## 🔑 Credenciales de Prueba

### Admin
```
Usuario: admin
Password: admin123
```

### Cocina
```
Usuario: cocina
Password: cocina123
```

### Base de Datos
```
Host: localhost
Puerto: 5432
Database: cafe_limon_dev
Usuario: postgres
Password: postgres
```

---

## 📊 Estado del Sistema

Después de cargar los datos:
- ✅ **2 usuarios** (admin + cocina)
- ✅ **151 productos** en 7 categorías
- ✅ **10 mesas** configuradas
- ✅ **Generador QR** funcionando

---

## 🎯 Probar el Sistema

### 1. Menú QR (Cliente)
```
http://localhost:5173/menu?table=M01
```

### 2. Panel Admin
```
http://localhost:5173/admin
```

### 3. Panel Cocina
```
http://localhost:5173/kitchen
```

### 4. API - Crear Pedido
```bash
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "tableId": "uuid-de-mesa",
    "customerName": "Juan Pérez",
    "items": [
      {
        "productId": "uuid-de-producto",
        "quantity": 2
      }
    ]
  }'
```

---

## 📦 Comandos Docker Esenciales

### Iniciar
```bash
docker-compose up -d
```

### Ver Logs
```bash
# Todos los servicios
docker-compose logs -f

# Solo backend
docker-compose logs -f backend

# Solo PostgreSQL
docker-compose logs -f postgres
```

### Detener
```bash
docker-compose stop
```

### Reiniciar
```bash
docker-compose restart
```

### Eliminar Todo
```bash
docker-compose down -v
```

### Reconstruir
```bash
docker-compose down -v
docker-compose up -d --build
```

---

## 🐛 Troubleshooting Rápido

### Backend no inicia
```bash
docker-compose logs backend
```

### Puerto ocupado
```bash
# Ver qué usa el puerto 8080
lsof -i :8080

# Matar proceso
kill -9 <PID>
```

### Limpiar Docker
```bash
docker system prune -a -f --volumes
```

### Base de datos corrupta
```bash
docker-compose down -v
docker-compose up -d
```

---

## 📂 Estructura de Archivos Clave

```
Coffe/
├── backend/
│   ├── src/main/resources/
│   │   ├── application.yml              # Config principal
│   │   ├── application-prod.yml         # Config producción
│   │   └── data-init.sql                # Datos iniciales
│   └── Dockerfile                       # Docker backend
├── frontend/
│   ├── src/
│   │   ├── pages/MenuPage.jsx           # Menú QR
│   │   ├── contexts/CartContext.jsx     # Carrito
│   │   └── services/api.js              # Cliente API
│   └── .env.development                 # Variables frontend
├── docker-compose.yml                   # Orquestación
└── PROYECTO_COMPLETO.md                 # Documentación completa
```

---

## 🔗 Flujo Típico de Desarrollo

### 1. Levantar Backend con Docker
```bash
docker-compose up -d
```

### 2. Ejecutar Frontend en Local
```bash
cd frontend
npm run dev
```

### 3. Hacer Cambios en Código

### 4. Ver Logs
```bash
docker-compose logs -f backend
```

### 5. Reconstruir Backend si es necesario
```bash
docker-compose up -d --build backend
```

---

## 📊 Verificar Estado

```bash
# Estado de contenedores
docker-compose ps

# Health check backend
curl http://localhost:8080/actuator/health

# Listar mesas
curl http://localhost:8080/api/tables

# Listar categorías
curl http://localhost:8080/api/categories/active
```

---

## 🎨 Categorías Disponibles

1. Bebidas Calientes ☕
2. Bebidas Frías 🥤
3. Helados 🍦
4. Cerveza Internacional 🍺
5. Cocteles 🍹
6. Tragos 🥃
7. Cerveza Nacional 🍻
8. Coca Cola 🥤
9. Repostería 🍰
10. Gaseosas 🥤
11. Delicias de la Casa 🍽️
12. Dulces y Mecatos 🍬
13. Licores 🍾
14. Panadería 🥐
15. Postobón 🥤

---

## 🔄 Workflow de Pedido

```
1. Cliente escanea QR → /menu?table=M01
2. Selecciona productos
3. Confirma pedido
4. Backend crea pedido
5. WebSocket notifica cocina
6. Cocina prepara
7. Actualiza estado
8. Cliente recibe notificación
```

---

## 💡 Tips Útiles

### Ver Base de Datos
```bash
docker-compose exec postgres psql -U postgres -d cafe_limon_dev

# Dentro de psql:
\dt              # Listar tablas
\d+ orders       # Ver estructura de tabla
SELECT * FROM orders LIMIT 10;
```

### Acceder al Contenedor Backend
```bash
docker-compose exec backend sh
```

### Ver Variables de Entorno
```bash
docker-compose exec backend env | grep DB
```

---

## 📝 Notas Importantes

1. **Frontend NO está en Docker** - Se ejecuta con `npm run dev`
2. **Backend y PostgreSQL SÍ están en Docker**
3. **Datos se inicializan automáticamente** al crear la BD
4. **Volúmenes persisten los datos** entre reinicios
5. **Health checks pueden tardar 30-60s** en pasar

---

## 🆘 Ayuda Rápida

### ¿No funciona el backend?
```bash
docker-compose down
docker-compose up -d
docker-compose logs -f backend
```

### ¿Necesitas datos frescos?
```bash
docker-compose down -v
docker-compose up -d
```

### ¿Puerto ocupado?
```bash
lsof -i :8080
lsof -i :5432
```

---

## 📚 Documentación Completa

Para más detalles, ver:
- **[PROYECTO_COMPLETO.md](./PROYECTO_COMPLETO.md)** - Documentación completa
- **[DOCKER_README.md](./DOCKER_README.md)** - Guía Docker detallada
- **[FLUJO_QR.md](./FLUJO_QR.md)** - Flujo del sistema QR

---

**¡Listo para desarrollar! 🚀**
