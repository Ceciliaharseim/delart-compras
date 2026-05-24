# Del'art — Sistema de Compras y Proveedores

## Cómo subir a Railway (paso a paso)

### 1. Crear cuenta en Railway
- Ve a **railway.app**
- Haz clic en "Start a New Project" → "Login with GitHub"
- Si no tienes GitHub, créalo gratis en github.com primero

### 2. Subir la app
- En Railway, haz clic en **"New Project"**
- Selecciona **"Deploy from GitHub repo"**
- Si es la primera vez, autoriza Railway para acceder a GitHub
- Sube esta carpeta como repositorio en GitHub:
  - Ve a github.com → "New repository" → nombre: `delart-compras`
  - Arrastra todos estos archivos al repositorio
- Vuelve a Railway y selecciona ese repositorio

### 3. Listo
- Railway desplegará la app automáticamente
- Te dará una URL tipo: `delart-compras.up.railway.app`
- Abre esa URL en el teléfono → agrégala a la pantalla de inicio

## Usuarios de acceso
| Usuario | Contraseña |
|---------|-----------|
| maria | delart2026 |
| compras | delart2026 |

*(Puedes cambiar las contraseñas editando server.js antes de subir)*

## Funcionalidades
- ✅ Resumen con alertas de pagos pendientes
- ✅ Pedidos con estado (en camino / parcial / completo / pagado)
- ✅ Recepciones acumulativas — los kg se suman con cada entrega
- ✅ Pagos con datos bancarios del proveedor disponibles al pagar
- ✅ Proveedores con datos de transferencia + botón copiar cuenta
- ✅ Insumos — lista maestra editable
- ✅ Comparador de precios — se alimenta automáticamente de los pedidos
- ✅ Funciona como app en iPhone y Android (PWA)
