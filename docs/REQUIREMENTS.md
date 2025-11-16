# Requerimientos del Sistema - Café Limón

> Especificación detallada de requerimientos funcionales y no funcionales

**Proyecto**: Sistema de Auto Pedido mediante QR
**Cliente**: Café Limón - El Carmen de Viboral, Antioquia
**Desarrolladora**: Angie Melissa Gutierrez Quintana
**Institución**: Politécnico ASYS
**Fecha**: 2025

---

## 📋 Tabla de Contenidos

1. [Contexto del Proyecto](#contexto-del-proyecto)
2. [Problemática](#problemática)
3. [Objetivos](#objetivos)
4. [Requerimientos Funcionales](#requerimientos-funcionales)
5. [Requerimientos No Funcionales](#requerimientos-no-funcionales)
6. [Casos de Uso](#casos-de-uso)
7. [Historias de Usuario](#historias-de-usuario)
8. [Restricciones y Supuestos](#restricciones-y-supuestos)
9. [Criterios de Aceptación](#criterios-de-aceptación)

---

## 🎯 Contexto del Proyecto

### Descripción de la Empresa

**Café Limón** es un emprendimiento colombiano ubicado en El Carmen de Viboral (Carrera 30 # 29-60), reconocido por:

- Ambiente acogedor y compromiso con la calidad del café artesanal
- Enfoque en sabores auténticos del Oriente Antioqueño
- Apoyo a pequeños productores locales de café
- Promoción de la cultura cafetera regional

### Situación Actual

El proceso de atención es **completamente manual**:

1. Cliente llega y se sienta en una mesa
2. Espera a que el mesero llegue a tomar el pedido
3. Mesero anota el pedido en papel
4. Mesero lleva el pedido a cocina/barra
5. Personal de cocina prepara el pedido
6. Mesero sirve cuando está listo

### Problemas Identificados

❌ **Tiempos de espera prolongados**
❌ **Dependencia total del personal disponible**
❌ **Errores en la transcripción de pedidos**
❌ **Falta de visibilidad del estado del pedido**
❌ **Ineficiencia en la gestión de múltiples mesas**
❌ **Mayor carga operativa para el personal**
❌ **Experiencia del cliente puede ser inconsistente**

---

## ❓ Problemática

### Formulación del Problema

> ¿Cómo implementar de manera eficiente un **sistema de auto pedido basado en códigos QR** en Café Limón, que permita optimizar la atención al cliente, reducir los tiempos de espera y mejorar la gestión de pedidos dentro del establecimiento, garantizando al mismo tiempo la usabilidad, seguridad y protección de los datos de los usuarios?

---

## 🎯 Objetivos

### Objetivo General

Diseñar e implementar un sistema de auto pedido basado en códigos QR para Café Limón, con el fin de optimizar los procesos de atención al cliente, reducir los tiempos de espera y mejorar la gestión de pedidos dentro del establecimiento, integrando herramientas tecnológicas que fortalezcan la eficiencia operativa y la experiencia del usuario.

### Objetivos Específicos

1. **Analizar** el proceso actual de atención y toma de pedidos en Café Limón para identificar las oportunidades de mejora mediante la digitalización.

2. **Diseñar** la arquitectura y funcionalidades del sistema de auto pedido basado en códigos QR, definiendo los requisitos funcionales y no funcionales.

3. **Desarrollar e implementar** el prototipo del sistema, permitiendo a los clientes visualizar el menú, realizar pedidos y recibir notificaciones desde sus dispositivos móviles.

4. **Probar y validar** el correcto funcionamiento del sistema, garantizando su usabilidad, estabilidad y seguridad en el manejo de datos.

5. **Documentar** el proceso de desarrollo, implementación y resultados obtenidos, siguiendo buenas prácticas de ingeniería de software y asegurando la posibilidad de futuras mejoras o ampliaciones.

---

## ⚙️ Requerimientos Funcionales

### RF-001: Gestión de Códigos QR

**Prioridad**: Alta
**Actor**: Administrador

**Descripción**:
El sistema debe permitir la generación y gestión de códigos QR únicos para cada mesa del establecimiento.

**Criterios de Aceptación**:
- [ ] Generar código QR único por mesa (formato: `cafe-limon.app/menu/{table-id}`)
- [ ] El QR debe poder descargarse en formato PNG (alta resolución para impresión)
- [ ] El QR debe redirigir al menú digital con el contexto de la mesa
- [ ] Permitir regenerar QR si es necesario
- [ ] Permitir activar/desactivar mesas

**Mockup/Referencia**: Ver Anexo 2 - Ilustración 2

---

### RF-002: Visualización del Menú Digital

**Prioridad**: Alta
**Actor**: Cliente

**Descripción**:
El cliente debe poder visualizar el menú completo de productos organizados por categorías.

**Criterios de Aceptación**:
- [ ] Mostrar productos agrupados por categorías (Cafés, Bebidas, Postres, etc.)
- [ ] Cada producto debe mostrar:
  - Nombre
  - Descripción breve
  - Precio
  - Imagen (si disponible)
  - Tiempo estimado de preparación
  - Estado de disponibilidad
- [ ] Filtrar por categorías
- [ ] Búsqueda de productos por nombre
- [ ] Indicar productos NO disponibles temporalmente
- [ ] Diseño responsive (optimizado para móviles)
- [ ] Carga rápida (< 2 segundos)

---

### RF-003: Carrito de Compras

**Prioridad**: Alta
**Actor**: Cliente

**Descripción**:
El cliente debe poder agregar productos a un carrito antes de confirmar el pedido.

**Criterios de Aceptación**:
- [ ] Agregar productos al carrito
- [ ] Modificar cantidad de productos
- [ ] Eliminar productos del carrito
- [ ] Agregar notas especiales por producto (ej: "sin azúcar", "extra caliente")
- [ ] Ver subtotal por producto
- [ ] Ver total general del pedido
- [ ] Vaciar carrito completo
- [ ] Persistencia del carrito (no se pierde si recarga la página)

---

### RF-004: Creación de Pedido

**Prioridad**: Alta
**Actor**: Cliente

**Descripción**:
El cliente debe poder confirmar y enviar su pedido a la cocina.

**Criterios de Aceptación**:
- [ ] Solicitar nombre del cliente (opcional)
- [ ] Confirmar mesa detectada automáticamente desde el QR
- [ ] Mostrar resumen completo antes de confirmar
- [ ] Validar que haya al menos 1 producto en el carrito
- [ ] Generar número de pedido único (formato: `ORD-YYYYMMDD-NNN`)
- [ ] Mostrar confirmación visual tras crear el pedido
- [ ] Redirigir a página de seguimiento del pedido
- [ ] Enviar notificación a cocina en tiempo real

---

### RF-005: Tracking de Pedido en Tiempo Real

**Prioridad**: Alta
**Actor**: Cliente

**Descripción**:
El cliente debe poder ver el estado actual de su pedido en tiempo real.

**Criterios de Aceptación**:
- [ ] Mostrar número de pedido
- [ ] Mostrar estado actual:
  - 🔵 Pendiente (recibido)
  - 🟡 En preparación
  - 🟢 Listo para recoger/servir
  - ⚪ Entregado
- [ ] Mostrar hora de creación del pedido
- [ ] Mostrar tiempo estimado de preparación
- [ ] Actualización automática vía WebSocket (sin refrescar)
- [ ] Notificación visual y sonora cuando cambia a "Listo"
- [ ] Ver detalle de productos ordenados

---

### RF-006: Panel de Cocina

**Prioridad**: Alta
**Actor**: Personal de Cocina

**Descripción**:
El personal de cocina debe tener una vista de todos los pedidos activos.

**Criterios de Aceptación**:
- [ ] Listar todos los pedidos pendientes y en preparación
- [ ] Ordenar por antigüedad (más antiguos primero)
- [ ] Mostrar por cada pedido:
  - Número de pedido
  - Mesa
  - Productos y cantidades
  - Notas especiales
  - Tiempo transcurrido desde creación
  - Estado actual
- [ ] Actualización automática en tiempo real (WebSocket)
- [ ] Botones para cambiar estado:
  - "Iniciar preparación" (Pendiente → En preparación)
  - "Marcar como listo" (En preparación → Listo)
- [ ] Alerta sonora cuando llega un nuevo pedido
- [ ] Contador de pedidos pendientes visible
- [ ] Vista optimizada para tablet

---

### RF-007: Notificaciones en Tiempo Real

**Prioridad**: Alta
**Actores**: Cliente, Cocina

**Descripción**:
El sistema debe enviar notificaciones automáticas cuando cambia el estado de un pedido.

**Criterios de Aceptación**:
- [ ] Cliente recibe notificación cuando:
  - Pedido es confirmado
  - Pedido pasa a "En preparación"
  - Pedido está "Listo"
- [ ] Cocina recibe notificación cuando:
  - Nuevo pedido es creado
- [ ] Notificaciones vía WebSocket (tiempo real)
- [ ] Notificaciones visuales (toast/alert)
- [ ] Notificaciones sonoras (opcional, activable por usuario)
- [ ] No requiere refresco de página

---

### RF-008: Gestión de Productos (Admin)

**Prioridad**: Alta
**Actor**: Administrador

**Descripción**:
El administrador debe poder gestionar el catálogo de productos.

**Criterios de Aceptación**:
- [ ] **Crear producto**:
  - Nombre (requerido)
  - Descripción
  - Precio (requerido)
  - Categoría (requerido)
  - Imagen (URL o upload)
  - Tiempo de preparación (minutos)
  - Estado (disponible/no disponible)
- [ ] **Editar producto**: Modificar cualquier campo
- [ ] **Eliminar producto**: Soft delete (no se borra físicamente)
- [ ] **Cambiar disponibilidad**: Toggle rápido (disponible/no disponible)
- [ ] Listar todos los productos con paginación
- [ ] Filtrar por categoría
- [ ] Buscar por nombre
- [ ] Subir imagen de producto

---

### RF-009: Gestión de Categorías (Admin)

**Prioridad**: Media
**Actor**: Administrador

**Descripción**:
El administrador debe poder gestionar las categorías de productos.

**Criterios de Aceptación**:
- [ ] Crear categoría (nombre, descripción, icono, orden)
- [ ] Editar categoría
- [ ] Eliminar categoría (solo si no tiene productos)
- [ ] Reordenar categorías (drag & drop o input numérico)
- [ ] Activar/desactivar categoría

---

### RF-010: Gestión de Mesas (Admin)

**Prioridad**: Alta
**Actor**: Administrador

**Descripción**:
El administrador debe poder gestionar las mesas del establecimiento.

**Criterios de Aceptación**:
- [ ] Crear mesa (número, capacidad)
- [ ] Generar código QR para la mesa
- [ ] Descargar QR en PNG de alta calidad
- [ ] Editar información de mesa
- [ ] Activar/desactivar mesa
- [ ] Ver lista de todas las mesas
- [ ] Ver pedidos activos por mesa

---

### RF-011: Historial de Pedidos (Admin)

**Prioridad**: Media
**Actor**: Administrador

**Descripción**:
El administrador debe poder consultar el historial completo de pedidos.

**Criterios de Aceptación**:
- [ ] Ver todos los pedidos (activos y completados)
- [ ] Filtrar por:
  - Fecha (rango)
  - Estado
  - Mesa
- [ ] Buscar por número de pedido
- [ ] Ver detalles completos de cada pedido
- [ ] Exportar a CSV/Excel (opcional)
- [ ] Paginación (20 pedidos por página)

---

### RF-012: Reportes y Estadísticas (Admin)

**Prioridad**: Baja
**Actor**: Administrador

**Descripción**:
El administrador debe poder ver estadísticas y reportes del negocio.

**Criterios de Aceptación**:
- [ ] Dashboard con métricas principales:
  - Pedidos de hoy
  - Ingresos del día
  - Tiempo promedio de preparación
  - Productos más vendidos
- [ ] Gráficos de ventas por período
- [ ] Productos más/menos vendidos
- [ ] Horarios pico de pedidos
- [ ] Reporte por fecha (rango seleccionable)

---

### RF-013: Autenticación de Usuarios (Admin/Cocina)

**Prioridad**: Alta
**Actores**: Administrador, Personal de Cocina

**Descripción**:
El sistema debe autenticar a usuarios con roles específicos.

**Criterios de Aceptación**:
- [ ] Login con username y password
- [ ] Autenticación mediante JWT
- [ ] Roles: ADMIN, KITCHEN
- [ ] Permisos diferenciados por rol
- [ ] Logout (invalidar token)
- [ ] Token con expiración (24 horas)
- [ ] Refresh token automático antes de expirar

---

### RF-014: Integración con Impresora de Cocina

**Prioridad**: Media
**Actor**: Sistema (automático)

**Descripción**:
El sistema debe poder enviar pedidos a una impresora térmica en cocina (opcional).

**Criterios de Aceptación**:
- [ ] Imprimir ticket cuando se crea un pedido
- [ ] Formato del ticket:
  - Número de pedido
  - Mesa
  - Fecha y hora
  - Lista de productos con cantidades
  - Notas especiales destacadas
- [ ] Configuración de IP de impresora
- [ ] Manejo de errores si impresora no disponible (no debe bloquear el pedido)

---

## 🔒 Requerimientos No Funcionales

### RNF-001: Usabilidad

**Categoría**: UX/UI

**Descripción**:
El sistema debe ser intuitivo y fácil de usar sin necesidad de capacitación.

**Métricas**:
- [ ] Cliente debe poder realizar un pedido en menos de 2 minutos
- [ ] Interfaz con diseño minimalista y limpio
- [ ] Tamaño de fuente legible en móviles (min 16px)
- [ ] Botones con área de toque adecuada (min 44x44px)
- [ ] Mensajes de error claros y orientativos
- [ ] Navegación intuitiva (máximo 3 clicks para cualquier acción)

---

### RNF-002: Performance

**Categoría**: Rendimiento

**Descripción**:
El sistema debe responder rápidamente a las interacciones del usuario.

**Métricas**:
- [ ] Tiempo de carga inicial: < 2 segundos (3G)
- [ ] Tiempo de respuesta API: < 200ms (p95)
- [ ] First Contentful Paint: < 1.5s
- [ ] Time to Interactive: < 3.5s
- [ ] Lighthouse Performance Score: > 90
- [ ] Actualización de estado en tiempo real: < 500ms

---

### RNF-003: Disponibilidad

**Categoría**: Confiabilidad

**Descripción**:
El sistema debe estar disponible durante el horario de operación del café.

**Métricas**:
- [ ] Uptime: 99% en horario de operación (8am - 8pm)
- [ ] Tiempo de recuperación ante fallas: < 5 minutos
- [ ] Sistema debe funcionar offline parcialmente (mostrar menú en caché)

---

### RNF-004: Escalabilidad

**Categoría**: Capacidad

**Descripción**:
El sistema debe soportar el crecimiento del negocio.

**Métricas**:
- [ ] Soportar hasta 50 usuarios concurrentes
- [ ] Soportar hasta 20 mesas
- [ ] Manejar hasta 100 pedidos por día
- [ ] Base de datos escalable para 1 año de histórico
- [ ] Arquitectura preparada para múltiples sucursales (futuro)

---

### RNF-005: Seguridad

**Categoría**: Seguridad de la Información

**Descripción**:
El sistema debe proteger los datos de usuarios y cumplir con la normativa colombiana.

**Cumplimiento Normativo**:
- **Ley 1581 de 2012**: Protección de datos personales
- **Ley 1266 de 2008**: Habeas Data
- **Ley 527 de 1999**: Comercio electrónico
- **Decreto 1078 de 2015**: Sector TIC

**Medidas de Seguridad**:
- [ ] HTTPS obligatorio en producción
- [ ] Contraseñas hasheadas con BCrypt (factor ≥ 12)
- [ ] Tokens JWT con expiración
- [ ] Sanitización de inputs (prevención XSS)
- [ ] Prepared Statements (prevención SQL Injection)
- [ ] CORS configurado restrictivamente
- [ ] Rate limiting en API (prevención DDoS)
- [ ] Headers de seguridad HTTP configurados
- [ ] Logs de auditoría para acciones críticas

**Protección de Datos Personales**:
- [ ] Minimización de datos (solo lo necesario)
- [ ] Consentimiento informado (Política de Privacidad)
- [ ] Derecho de acceso (ver pedido con código)
- [ ] No almacenar datos sensibles innecesarios

---

### RNF-006: Compatibilidad

**Categoría**: Dispositivos y Navegadores

**Descripción**:
El sistema debe funcionar en múltiples dispositivos y navegadores.

**Compatibilidad**:

**Navegadores** (últimas 2 versiones):
- [ ] Chrome (Android/Desktop)
- [ ] Safari (iOS/macOS)
- [ ] Firefox
- [ ] Edge

**Dispositivos**:
- [ ] Smartphones (iOS 13+, Android 8+)
- [ ] Tablets (iPad, Android tablets)
- [ ] Desktop (1280x720 min)

**Orientación**:
- [ ] Portrait (principal)
- [ ] Landscape (secundaria)

---

### RNF-007: Mantenibilidad

**Categoría**: Código y Documentación

**Descripción**:
El código debe ser fácil de mantener y extender.

**Prácticas**:
- [ ] Código documentado (JSDoc, Javadoc)
- [ ] Nombres descriptivos de variables y funciones
- [ ] Arquitectura modular y desacoplada
- [ ] Tests unitarios (> 80% coverage)
- [ ] Tests de integración para flujos críticos
- [ ] README detallado
- [ ] Guía de contribución
- [ ] Conventional Commits en Git
- [ ] Code reviews antes de merge

---

### RNF-008: Accesibilidad

**Categoría**: WCAG 2.1

**Descripción**:
El sistema debe ser accesible para personas con discapacidades.

**Estándares**:
- [ ] WCAG 2.1 Level AA compliance
- [ ] Contraste de colores adecuado (min 4.5:1)
- [ ] Navegación por teclado funcional
- [ ] Etiquetas ARIA en elementos interactivos
- [ ] Textos alternativos en imágenes
- [ ] Formularios con labels asociados
- [ ] Mensajes de error accesibles

---

## 📖 Casos de Uso

### CU-001: Cliente Realiza Pedido

**Actor Principal**: Cliente
**Precondiciones**: Cliente ha escaneado el QR de la mesa
**Postcondiciones**: Pedido creado y enviado a cocina

**Flujo Principal**:

1. Cliente escanea código QR en la mesa
2. Sistema carga menú digital de la mesa
3. Cliente navega por categorías y productos
4. Cliente agrega productos al carrito
5. Cliente puede agregar notas especiales a productos
6. Cliente revisa el carrito y total
7. Cliente confirma el pedido
8. Sistema genera número de pedido único
9. Sistema envía notificación a cocina
10. Sistema muestra confirmación al cliente
11. Sistema redirige a página de seguimiento

**Flujos Alternativos**:

- **3a**: Si no hay productos disponibles:
  - Sistema muestra mensaje "Menú temporalmente no disponible"

- **7a**: Si el carrito está vacío:
  - Sistema muestra error "Agrega al menos un producto"

- **8a**: Si hay error al crear pedido:
  - Sistema muestra error y permite reintentar

---

### CU-002: Cocina Prepara Pedido

**Actor Principal**: Personal de Cocina
**Precondiciones**: Nuevo pedido ha sido creado
**Postcondiciones**: Pedido marcado como listo

**Flujo Principal**:

1. Sistema notifica a cocina de nuevo pedido (sonido + visual)
2. Personal de cocina ve pedido en pantalla
3. Personal de cocina lee detalles (productos, notas, mesa)
4. Personal de cocina marca pedido como "En preparación"
5. Sistema actualiza estado y notifica al cliente
6. Personal de cocina prepara el pedido
7. Personal de cocina marca pedido como "Listo"
8. Sistema envía notificación al cliente (alerta sonora)

**Flujos Alternativos**:

- **6a**: Si falta algún producto:
  - Personal puede marcar producto como "No disponible"
  - Sistema notifica al cliente y sugiere alternativas

---

### CU-003: Administrador Gestiona Menú

**Actor Principal**: Administrador
**Precondiciones**: Administrador autenticado
**Postcondiciones**: Menú actualizado

**Flujo Principal**:

1. Administrador accede al panel de administración
2. Administrador selecciona "Gestión de Productos"
3. Administrador crea/edita/elimina productos
4. Administrador sube imagen del producto
5. Administrador establece precio y disponibilidad
6. Administrador guarda cambios
7. Sistema valida datos
8. Sistema actualiza menú
9. Cambios se reflejan instantáneamente en frontend

---

## 📝 Historias de Usuario

### HU-001: Como cliente, quiero escanear un QR para ver el menú

**Como** cliente del Café Limón
**Quiero** escanear un código QR en mi mesa
**Para** ver el menú digital sin esperar a que venga un mesero

**Criterios de Aceptación**:
- ✅ El QR debe estar visible en la mesa
- ✅ Al escanear, se abre el menú en el navegador móvil
- ✅ No requiere instalación de app
- ✅ Carga en menos de 2 segundos

**Prioridad**: Alta
**Estimación**: 3 puntos

---

### HU-002: Como cliente, quiero agregar productos a un carrito

**Como** cliente
**Quiero** agregar múltiples productos a un carrito antes de confirmar
**Para** hacer un pedido completo de una sola vez

**Criterios de Aceptación**:
- ✅ Puedo agregar/quitar productos
- ✅ Puedo cambiar cantidades
- ✅ Veo el total actualizado en tiempo real
- ✅ Puedo agregar notas especiales

**Prioridad**: Alta
**Estimación**: 5 puntos

---

### HU-003: Como cliente, quiero ver el estado de mi pedido en tiempo real

**Como** cliente
**Quiero** ver cuándo mi pedido está listo
**Para** no tener que preguntar constantemente al personal

**Criterios de Aceptación**:
- ✅ Veo el estado actual (Pendiente/En preparación/Listo)
- ✅ Recibo notificación cuando cambia de estado
- ✅ Recibo alerta sonora cuando está listo
- ✅ No tengo que refrescar la página

**Prioridad**: Alta
**Estimación**: 8 puntos

---

### HU-004: Como personal de cocina, quiero ver todos los pedidos pendientes

**Como** personal de cocina
**Quiero** ver una lista de todos los pedidos activos
**Para** organizarme y priorizar mi trabajo

**Criterios de Aceptación**:
- ✅ Veo pedidos ordenados por antigüedad
- ✅ Veo detalles completos (productos, notas, mesa)
- ✅ Puedo marcar pedidos como "En preparación" y "Listo"
- ✅ Escucho alerta cuando llega un nuevo pedido

**Prioridad**: Alta
**Estimación**: 8 puntos

---

### HU-005: Como administrador, quiero gestionar el menú

**Como** administrador
**Quiero** agregar, editar y eliminar productos del menú
**Para** mantener el catálogo actualizado

**Criterios de Aceptación**:
- ✅ Puedo crear productos con imagen, precio, descripción
- ✅ Puedo editar información de productos existentes
- ✅ Puedo marcar productos como no disponibles temporalmente
- ✅ Los cambios se reflejan inmediatamente en el menú público

**Prioridad**: Alta
**Estimación**: 13 puntos

---

## ⚠️ Restricciones y Supuestos

### Restricciones

**Técnicas**:
- ❗ Debe funcionar en red local del café (internet no garantizado)
- ❗ Presupuesto limitado (usar tecnologías gratuitas/open source)
- ❗ No requiere pasarela de pago (pago en efectivo/datáfono)

**Legales**:
- ❗ Cumplimiento de Ley 1581/2012 (Protección de datos Colombia)
- ❗ No se pueden almacenar datos de tarjetas de crédito

**Organizacionales**:
- ❗ Personal con conocimientos básicos de tecnología
- ❗ Proyecto debe completarse en 6 meses (trabajo de grado)

### Supuestos

- ✓ Clientes tienen smartphones con cámara y navegador web
- ✓ Hay conexión WiFi estable en el café
- ✓ El café cuenta con tablet para cocina
- ✓ El café tiene acceso a impresora térmica (opcional)
- ✓ Los productos no cambian radicalmente de precio a diario

---

## ✅ Criterios de Aceptación del Proyecto

### Funcionales

- [x] Cliente puede realizar pedido completo sin intervención de mesero
- [x] Cocina recibe pedidos en tiempo real
- [x] Cliente recibe notificación cuando pedido está listo
- [x] Administrador puede gestionar menú completo
- [x] Sistema genera códigos QR para mesas

### Técnicos

- [x] Lighthouse Performance Score > 90
- [x] Tests unitarios con coverage > 80%
- [x] Sin errores críticos de seguridad (OWASP Top 10)
- [x] Compatible con Chrome/Safari móvil (últimas 2 versiones)
- [x] API documentada con Swagger/OpenAPI

### De Negocio

- [x] Reducción de tiempo de atención en al menos 30%
- [x] Reducción de errores en pedidos en al menos 50%
- [x] Satisfacción del cliente medida > 4/5 estrellas
- [x] Sistema usado por al menos 70% de los clientes

### Documentación

- [x] README completo con instrucciones de instalación
- [x] Documentación de arquitectura
- [x] Guía de desarrollo para futuros desarrolladores
- [x] Manual de usuario para administradores

---

## 📊 Matriz de Priorización

| ID | Requerimiento | Prioridad | Complejidad | Dependencias |
|----|--------------|-----------|-------------|--------------|
| RF-001 | Códigos QR | Alta | Baja | Ninguna |
| RF-002 | Menú Digital | Alta | Media | RF-001 |
| RF-003 | Carrito | Alta | Media | RF-002 |
| RF-004 | Crear Pedido | Alta | Alta | RF-003 |
| RF-005 | Tracking | Alta | Alta | RF-004 |
| RF-006 | Panel Cocina | Alta | Alta | RF-004 |
| RF-007 | Notificaciones | Alta | Alta | RF-004, RF-006 |
| RF-008 | Gestión Productos | Alta | Media | RF-013 |
| RF-009 | Gestión Categorías | Media | Baja | RF-013 |
| RF-010 | Gestión Mesas | Alta | Media | RF-013 |
| RF-011 | Historial | Media | Baja | RF-013 |
| RF-012 | Reportes | Baja | Media | RF-013 |
| RF-013 | Autenticación | Alta | Media | Ninguna |
| RF-014 | Impresora | Media | Alta | RF-004 |

---

## 📅 Roadmap de Implementación

### Fase 1: MVP (Mínimo Producto Viable) - 6 semanas

**Semana 1-2**: Setup e Infraestructura
- [x] Configuración de repositorios
- [x] Setup de base de datos
- [x] Configuración de entornos (dev/prod)
- [x] CI/CD básico

**Semana 3-4**: Funcionalidades Core
- [ ] RF-002: Menú digital
- [ ] RF-003: Carrito
- [ ] RF-004: Crear pedido
- [ ] RF-001: Generación de QR

**Semana 5-6**: Panel de Cocina y Notificaciones
- [ ] RF-006: Panel de cocina
- [ ] RF-007: WebSockets y notificaciones
- [ ] RF-005: Tracking básico

### Fase 2: Administración - 4 semanas

**Semana 7-8**: Panel de Admin
- [ ] RF-013: Autenticación
- [ ] RF-008: Gestión de productos
- [ ] RF-010: Gestión de mesas

**Semana 9-10**: Funcionalidades Secundarias
- [ ] RF-009: Gestión de categorías
- [ ] RF-011: Historial de pedidos
- [ ] Mejoras de UX

### Fase 3: Optimización y Deploy - 4 semanas

**Semana 11-12**: Testing y Calidad
- [ ] Tests E2E completos
- [ ] Optimización de performance
- [ ] Seguridad (penetration testing)
- [ ] Accesibilidad (WCAG audit)

**Semana 13-14**: Deploy y Documentación
- [ ] Deploy a producción
- [ ] Migración de datos iniciales
- [ ] Capacitación de usuarios
- [ ] Documentación final

### Fase 4: Mejoras Opcionales (Post-MVP)

- [ ] RF-012: Reportes y estadísticas
- [ ] RF-014: Integración con impresora
- [ ] Pasarela de pago online
- [ ] App móvil nativa (iOS/Android)
- [ ] Multi-sucursal

---

## 📚 Referencias Normativas

### Legislación Colombiana

1. **Ley 1581 de 2012** - Protección de Datos Personales
   - Artículos aplicables: 4, 5, 6, 7, 8
   - Principios de finalidad, libertad, veracidad, transparencia

2. **Ley 1266 de 2008** - Habeas Data
   - Derecho de acceso, rectificación, actualización

3. **Ley 527 de 1999** - Comercio Electrónico
   - Validez de transacciones digitales

4. **Decreto 1078 de 2015** - Sector TIC
   - Estándares técnicos y seguridad

5. **Ley 1480 de 2011** - Estatuto del Consumidor
   - Protección de derechos del consumidor

### Estándares Internacionales

- **ISO 27001**: Gestión de seguridad de la información
- **WCAG 2.1**: Accesibilidad web
- **OWASP**: Seguridad en aplicaciones web
- **OpenAPI 3.0**: Documentación de APIs

---

**Documento vivo**: Este documento se actualiza según evoluciona el proyecto.

**Última actualización**: 2025-01-13
**Versión**: 1.0.0
**Responsable**: Angie Melissa Gutierrez Quintana
**Aprobado por**: Juan Guillermo Henao (Asesor Técnico)
