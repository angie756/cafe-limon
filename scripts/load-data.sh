#!/bin/bash

# Script para cargar todos los datos en la base de datos
# Café Limón - Sistema de Pedidos

set -e  # Salir si hay algún error

echo "🚀 Iniciando carga de datos..."
echo ""

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar que Docker esté corriendo
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker no está corriendo"
    exit 1
fi

# Verificar que el contenedor de PostgreSQL esté corriendo
if ! docker ps | grep -q cafe-limon-db; then
    echo "❌ Error: El contenedor cafe-limon-db no está corriendo"
    echo "💡 Ejecuta: docker-compose up -d"
    exit 1
fi

echo -e "${BLUE}📋 Paso 1/4: Copiando archivos SQL al contenedor...${NC}"
docker cp database/setup-complete.sql cafe-limon-db:/tmp/
docker cp database/seed-menu-complete.sql cafe-limon-db:/tmp/
echo -e "${GREEN}✅ Archivos copiados${NC}"
echo ""

echo -e "${BLUE}📋 Paso 2/4: Cargando configuración inicial (usuarios, mesas, categorías)...${NC}"
docker exec cafe-limon-db psql -U postgres -d cafe_limon_dev -f /tmp/setup-complete.sql > /dev/null 2>&1
echo -e "${GREEN}✅ Configuración cargada${NC}"
echo ""

echo -e "${BLUE}📋 Paso 3/4: Cargando productos completos (151 productos)...${NC}"
docker exec cafe-limon-db psql -U postgres -d cafe_limon_dev -f /tmp/seed-menu-complete.sql > /dev/null 2>&1
echo -e "${GREEN}✅ Productos cargados${NC}"
echo ""

echo -e "${BLUE}📋 Paso 4/4: Verificando datos...${NC}"
RESULT=$(docker exec cafe-limon-db psql -U postgres -d cafe_limon_dev -t -c "
SELECT
  'Usuarios: ' || COUNT(*) FROM users
UNION ALL
SELECT 'Productos: ' || COUNT(*) FROM products
UNION ALL
SELECT 'Categorías: ' || COUNT(*) FROM categories
UNION ALL
SELECT 'Mesas: ' || COUNT(*) FROM tables;
")

echo "$RESULT"
echo ""

echo -e "${GREEN}✅ ¡Datos cargados exitosamente!${NC}"
echo ""
echo -e "${YELLOW}📝 Credenciales:${NC}"
echo "   Admin: admin / admin123"
echo "   Cocina: cocina / cocina123"
echo ""
echo -e "${YELLOW}🌐 URLs:${NC}"
echo "   Frontend: http://localhost:5173"
echo "   Menú: http://localhost:5173/menu/3"
echo "   QR Generator: http://localhost:5173/qr-generator.html"
echo "   Login: http://localhost:5173/login"
echo ""
echo -e "${BLUE}💡 Tip: Si el frontend no está corriendo, ejecuta:${NC}"
echo "   cd frontend && npm run dev"
echo ""
