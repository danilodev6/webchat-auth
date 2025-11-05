# 💬 WebChat Auth

Una aplicación de chat en tiempo real con autenticación completa, construida con React, Express, Socket.IO y SQL.

![WebChat Demo](https://img.shields.io/badge/status-active-success.svg)
![Node Version](https://img.shields.io/badge/node-22.16.0-brightgreen.svg)
![Bun Version](https://img.shields.io/badge/bun-1.2.20-orange.svg)

## 🌟 Características

- ✅ **Autenticación completa** - Registro, login y gestión de sesiones
- 💬 **Chat en tiempo real** - Comunicación instantánea con Socket.IO
- 🔒 **Seguridad robusta** - Cookies HTTP-only, bcrypt, validación de tokens
- 🎨 **UI Moderna** - Interfaz responsive con Tailwind CSS v4
- 🚀 **Alta performance** - Backend optimizado con Bun
- 📱 **Mobile-friendly** - Diseño adaptativo para todos los dispositivos

## 🛠️ Stack Tecnológico

### Frontend
- **React 19** - Biblioteca UI
- **React Router 7** - Navegación
- **Socket.IO Client** - WebSockets
- **Tailwind CSS 4** - Estilos
- **Vite 7** - Build tool
- **TypeScript** - Tipado estático

### Backend
- **Node.js / Bun** - Runtime
- **Express** - Framework web
- **Socket.IO** - WebSockets
- **SQL** - Base de datos
- **JWT** - Autenticación
- **bcrypt** - Hash de contraseñas
- **TypeScript** - Tipado estático

## 📋 Requisitos Previos

- Node.js 22.16.0 o superior
- Bun 1.2.20 o superior (opcional, para desarrollo local)
- SQL 
- yarn o npm

## 🚀 Instalación Local

### 1. Clonar el repositorio

```bash
git clone https://github.com/danilodev6/webchat-auth.git
cd webchat-auth
```

### 2. Instalar dependencias

```bash
# Instalar dependencias del workspace
npm install

# O con Bun
bun install
```

### 3. Configurar variables de entorno

#### Backend (`server/.env`)

```env
PORT=3000
DATABASE_URL=postgresql://usuario:password@localhost:5432/webchat
JWT_SECRET=tu-secreto-jwt-super-seguro
SESSION_SECRET=tu-secreto-session-super-seguro
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

#### Frontend (`client/.env`)

```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

### 4. Configurar la base de datos

```bash
# Crear la base de datos
createdb webchat

# Ejecutar migraciones (si las tienes)
cd server
npm run migrate
```

### 5. Iniciar el proyecto

#### Opción 1: Desarrollo con workspaces

```bash
# Iniciar backend
cd server
bun run index.ts

# En otra terminal, iniciar frontend
cd client
npm run dev
```

#### Opción 2: Desarrollo con script root

```bash
npm run dev
```

La aplicación estará disponible en:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## 📦 Despliegue en Render

El proyecto incluye un archivo `render.yaml` para despliegue automático.

### 1. Conectar repositorio

- Ve a [Render](https://render.com)
- Conecta tu repositorio de GitHub
- Render detectará automáticamente el `render.yaml`

### 2. Configurar variables de entorno

#### Backend (webchat-backend)

```env
NODE_ENV=production
DATABASE_URL=<tu-postgres-url-de-render>
JWT_SECRET=<genera-un-secreto-seguro>
SESSION_SECRET=<genera-otro-secreto-seguro>
FRONTEND_URL=https://webchat-frontend-96ns.onrender.com
```

#### Frontend (webchat-frontend)

```env
VITE_API_URL=https://webchat-backend-d7v2.onrender.com
VITE_SOCKET_URL=https://webchat-backend-d7v2.onrender.com
```

### 3. Desplegar

```bash
git push origin main
```

Render automáticamente construirá y desplegará ambos servicios.

## 🏗️ Estructura del Proyecto

```
webchat-auth/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   ├── pages/         # Páginas de la aplicación
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # Servicios API
│   │   └── utils/         # Utilidades
│   ├── package.json
│   └── vite.config.ts
│
├── server/                # Backend Express
│   ├── routes/           # Rutas de la API
│   ├── middleware/       # Middlewares personalizados
│   ├── socket/           # Configuración Socket.IO
│   ├── models/           # Modelos de datos
│   ├── controllers/      # Controladores
│   └── index.ts          # Punto de entrada
│
├── render.yaml           # Configuración de Render
└── package.json          # Workspace root
```

## 🔐 Autenticación

El sistema utiliza:

- **JWT** para tokens de acceso
- **Cookies HTTP-only** para almacenamiento seguro
- **bcrypt** para hash de contraseñas
- **Sessions** con express-session
- **SameSite=None** para cookies cross-site en producción

### Flujo de Autenticación

1. Usuario se registra/inicia sesión
2. Backend valida credenciales y genera JWT
3. JWT se almacena en cookie HTTP-only
4. Cookie se envía automáticamente en cada request
5. Middleware valida el token en rutas protegidas

## 🔌 WebSockets (Socket.IO)

El chat utiliza Socket.IO para comunicación en tiempo real:

```javascript
// Cliente
socket.emit('message', { text: 'Hola!' });
socket.on('message', (data) => console.log(data));

// Servidor
io.on('connection', (socket) => {
  socket.on('message', (data) => {
    io.emit('message', data);
  });
});
```

## 🧪 Scripts Disponibles

### Root

```bash
npm run build       # Build del proyecto completo
```

### Frontend (client/)

```bash
npm run dev         # Iniciar servidor de desarrollo
npm run build       # Build de producción
npm run preview     # Preview del build
```

### Backend (server/)

```bash
bun run index.ts    # Iniciar servidor
npm start           # Alternativa con npm
```

## 📝 Licencia

Este proyecto está bajo la Licencia MIT.

## 👤 Autor

**Danilo**
- GitHub: [@danilodev6](https://github.com/danilodev6)

## 🤝 Contribuciones

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## ⭐ Agradecimientos

- [React](https://react.dev/)
- [Express](https://expressjs.com/)
- [Socket.IO](https://socket.io/)
- [Render](https://render.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

⌨️ con ❤️ por [danilodev6](https://github.com/danilodev6)
