# ClientesApp — Frontend React + Vite

Aplicación frontend para gestionar clientes, conectada a un backend Spring Boot en `http://localhost:8080`.

---

## 📁 Estructura del proyecto

```
clientes-app/
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.jsx               # Entrada principal
    ├── App.jsx                # Rutas con React Router
    ├── styles/
    │   └── global.css         # Estilos globales (dark theme)
    ├── services/
    │   └── clienteService.js  # Axios: getClientes, createCliente, updateCliente, deleteCliente
    ├── components/
    │   ├── Navbar.jsx         # Barra de navegación
    │   ├── ClienteRow.jsx     # Fila reutilizable de la tabla
    │   ├── Toast.jsx          # Notificaciones de éxito/error
    │   └── ConfirmDialog.jsx  # Modal de confirmación para eliminar
    └── pages/
        ├── ClientesPage.jsx   # Listado de clientes (con búsqueda)
        └── ClienteFormPage.jsx # Formulario crear/editar
```

---

## 🚀 Cómo ejecutar el proyecto

### Requisitos previos
- Node.js 18+ instalado → [https://nodejs.org](https://nodejs.org)
- El backend Spring Boot corriendo en Docker en `http://localhost:8080`

### Pasos

**1. Entra a la carpeta del proyecto**
```bash
cd clientes-app
```

**2. Instala las dependencias**
```bash
npm install
```

**3. Inicia el servidor de desarrollo**
```bash
npm run dev
```

**4. Abre el navegador en**
```
http://localhost:5173
```

---

## 🔌 Configuración del proxy (CORS)

El archivo `vite.config.js` incluye un proxy para evitar problemas de CORS durante desarrollo:

```js
proxy: {
  '/clientes': {
    target: 'http://localhost:8080',
    changeOrigin: true,
  }
}
```

Esto redirige todas las peticiones a `/clientes` hacia el backend automáticamente.

> Si tu backend usa CORS configurado correctamente (`@CrossOrigin` en Spring Boot), el proxy es opcional.

---

## 🔑 Endpoints esperados del backend

| Método | Ruta              | Descripción              |
|--------|-------------------|--------------------------|
| GET    | `/clientes`       | Listar todos los clientes |
| POST   | `/clientes`       | Crear un cliente nuevo    |
| PUT    | `/clientes/{id}`  | Actualizar un cliente     |
| DELETE | `/clientes/{id}`  | Eliminar un cliente       |

### Estructura JSON esperada

```json
{
  "id": 1,
  "nombre": "María García",
  "direccion": "Av. Reforma 123",
  "telefono": "+502 5555 1234"
}
```

---

## ✨ Funcionalidades

- ✅ Listado de clientes con tabla animada
- ✅ Búsqueda en tiempo real (nombre, dirección, teléfono)
- ✅ Crear cliente con validación de formulario
- ✅ Editar cliente (precarga datos del servidor)
- ✅ Eliminar cliente con modal de confirmación
- ✅ Mensajes de éxito / error (Toast notifications)
- ✅ Manejo de errores con try/catch y mensajes amigables
- ✅ Navegación con React Router
- ✅ Diseño dark mode responsivo
- ✅ Estados de carga (spinner) y vacío

---

## 🛠 Construir para producción

```bash
npm run build
```

Los archivos se generan en la carpeta `/dist`.

---

## ⚙️ Cambiar la URL del backend

Si tu backend corre en otra URL, edita `src/services/clienteService.js`:

```js
const BASE_URL = 'http://TU_URL:TU_PUERTO'
```
