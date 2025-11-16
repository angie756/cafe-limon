# Configuración MCP para Control de Navegador

Este documento explica cómo configurar un servidor MCP (Model Context Protocol) para que Claude Code pueda controlar un navegador web automáticamente.

## ¿Qué es MCP?

MCP (Model Context Protocol) es un protocolo que permite a Claude Code conectarse a herramientas externas y usarlas directamente. Para controlar un navegador, usaremos un servidor MCP con Puppeteer.

## Requisitos Previos

- Node.js 18+ instalado
- npm o yarn
- Claude Code CLI instalado

## Paso 1: Crear el Servidor MCP

Crea un nuevo directorio para tu servidor MCP:

```bash
mkdir mcp-browser-server
cd mcp-browser-server
npm init -y
```

## Paso 2: Instalar Dependencias

```bash
npm install @modelcontextprotocol/sdk puppeteer
```

## Paso 3: Crear el Servidor

Crea un archivo `server.js`:

```javascript
#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import puppeteer from "puppeteer";

let browser = null;
let page = null;

const server = new Server(
  {
    name: "browser-control",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Listar herramientas disponibles
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "browser_navigate",
        description: "Navegar a una URL en el navegador",
        inputSchema: {
          type: "object",
          properties: {
            url: {
              type: "string",
              description: "La URL a la que navegar",
            },
          },
          required: ["url"],
        },
      },
      {
        name: "browser_click",
        description: "Hacer clic en un elemento usando un selector CSS",
        inputSchema: {
          type: "object",
          properties: {
            selector: {
              type: "string",
              description: "Selector CSS del elemento a hacer clic",
            },
          },
          required: ["selector"],
        },
      },
      {
        name: "browser_type",
        description: "Escribir texto en un campo de entrada",
        inputSchema: {
          type: "object",
          properties: {
            selector: {
              type: "string",
              description: "Selector CSS del elemento input",
            },
            text: {
              type: "string",
              description: "Texto a escribir",
            },
          },
          required: ["selector", "text"],
        },
      },
      {
        name: "browser_screenshot",
        description: "Tomar una captura de pantalla de la página actual",
        inputSchema: {
          type: "object",
          properties: {
            path: {
              type: "string",
              description: "Ruta donde guardar la captura (opcional)",
            },
          },
        },
      },
      {
        name: "browser_get_text",
        description: "Obtener el texto de un elemento",
        inputSchema: {
          type: "object",
          properties: {
            selector: {
              type: "string",
              description: "Selector CSS del elemento",
            },
          },
          required: ["selector"],
        },
      },
      {
        name: "browser_close",
        description: "Cerrar el navegador",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
    ],
  };
});

// Manejar llamadas a herramientas
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    // Inicializar navegador si no existe
    if (!browser && name !== "browser_close") {
      browser = await puppeteer.launch({
        headless: false, // Cambiar a true para modo sin cabeza
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 800 });
    }

    switch (name) {
      case "browser_navigate":
        await page.goto(args.url, { waitUntil: "networkidle2" });
        return {
          content: [
            {
              type: "text",
              text: `Navegado a ${args.url}`,
            },
          ],
        };

      case "browser_click":
        await page.click(args.selector);
        return {
          content: [
            {
              type: "text",
              text: `Clic en ${args.selector}`,
            },
          ],
        };

      case "browser_type":
        await page.type(args.selector, args.text);
        return {
          content: [
            {
              type: "text",
              text: `Texto "${args.text}" escrito en ${args.selector}`,
            },
          ],
        };

      case "browser_screenshot":
        const screenshotPath = args.path || `screenshot-${Date.now()}.png`;
        const screenshot = await page.screenshot({
          path: screenshotPath,
          fullPage: true,
        });
        return {
          content: [
            {
              type: "text",
              text: `Captura guardada en ${screenshotPath}`,
            },
            {
              type: "image",
              data: screenshot.toString("base64"),
              mimeType: "image/png",
            },
          ],
        };

      case "browser_get_text":
        const text = await page.$eval(
          args.selector,
          (el) => el.textContent
        );
        return {
          content: [
            {
              type: "text",
              text: `Texto: ${text}`,
            },
          ],
        };

      case "browser_close":
        if (browser) {
          await browser.close();
          browser = null;
          page = null;
        }
        return {
          content: [
            {
              type: "text",
              text: "Navegador cerrado",
            },
          ],
        };

      default:
        throw new Error(`Herramienta desconocida: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Iniciar servidor
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Servidor MCP de navegador iniciado");
}

main().catch((error) => {
  console.error("Error fatal:", error);
  process.exit(1);
});
```

## Paso 4: Hacer el Script Ejecutable

```bash
chmod +x server.js
```

## Paso 5: Actualizar package.json

Agrega estos campos a tu `package.json`:

```json
{
  "type": "module",
  "bin": {
    "mcp-browser-server": "./server.js"
  },
  "scripts": {
    "start": "node server.js"
  }
}
```

## Paso 6: Instalar el Servidor Globalmente

```bash
npm install -g .
```

O publicarlo en npm:

```bash
npm publish
```

## Paso 7: Configurar Claude Code

Edita tu archivo de configuración de Claude Code (usualmente en `~/.config/claude/config.json` o similar):

```json
{
  "mcpServers": {
    "browser": {
      "command": "mcp-browser-server"
    }
  }
}
```

Si instalaste localmente en lugar de globalmente:

```json
{
  "mcpServers": {
    "browser": {
      "command": "node",
      "args": ["/ruta/completa/a/mcp-browser-server/server.js"]
    }
  }
}
```

## Paso 8: Reiniciar Claude Code

Reinicia Claude Code para que cargue el nuevo servidor MCP.

## Uso desde Claude Code

Una vez configurado, puedes pedirle a Claude Code que use el navegador:

**Ejemplo 1: Navegar a una página**
```
Claude, navega a https://kofee.web.app usando el navegador
```

**Ejemplo 2: Interactuar con la página**
```
Claude, abre https://google.com, escribe "Café Limón" en el buscador y haz clic en buscar
```

**Ejemplo 3: Tomar capturas**
```
Claude, abre la página de menú y toma una captura de pantalla
```

## Herramientas Disponibles

- `browser_navigate`: Navegar a una URL
- `browser_click`: Hacer clic en un elemento
- `browser_type`: Escribir en un campo de texto
- `browser_screenshot`: Tomar captura de pantalla
- `browser_get_text`: Obtener texto de un elemento
- `browser_close`: Cerrar el navegador

## Solución de Problemas

### El navegador no se abre

- Verifica que Puppeteer esté instalado correctamente
- En algunos sistemas Linux, necesitas instalar dependencias adicionales:
  ```bash
  sudo apt-get install -y chromium-browser
  ```

### Claude Code no encuentra el servidor

- Verifica la ruta en el archivo de configuración
- Asegúrate de que el script sea ejecutable (`chmod +x server.js`)
- Verifica los logs de Claude Code para errores

### Errores de permisos

- En macOS, puede que necesites dar permisos a Terminal/Claude Code para controlar otros aplicaciones
- Ir a Sistema > Privacidad y Seguridad > Accesibilidad

## Modo Sin Cabeza (Headless)

Para ejecutar el navegador sin interfaz gráfica (útil en servidores), cambia en `server.js`:

```javascript
browser = await puppeteer.launch({
  headless: true,  // Cambiar a true
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
```

## Extensiones Avanzadas

### Agregar esperas inteligentes

```javascript
case "browser_wait_for_selector":
  await page.waitForSelector(args.selector, { timeout: 5000 });
  return {
    content: [{
      type: "text",
      text: `Elemento ${args.selector} apareció`
    }]
  };
```

### Ejecutar JavaScript personalizado

```javascript
case "browser_eval":
  const result = await page.evaluate(args.code);
  return {
    content: [{
      type: "text",
      text: `Resultado: ${JSON.stringify(result)}`
    }]
  };
```

## Seguridad

**IMPORTANTE**: Este servidor da acceso completo al navegador. Solo úsalo en entornos confiables y nunca expongas el servidor a Internet sin autenticación adicional.

## Recursos Adicionales

- [Documentación MCP](https://modelcontextprotocol.io)
- [Documentación Puppeteer](https://pptr.dev)
- [Claude Code Docs](https://docs.claude.com/claude-code)

## Licencia

MIT
