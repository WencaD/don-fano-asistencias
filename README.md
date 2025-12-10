## Sistema de Asistencias con QR - Pizzería Don Fano

Sistema de gestión de asistencias para empleados con tecnología QR dinámica.

### 🚀 Tecnologías

- **Backend:** Node.js + Express.js
- **Base de Datos:** MySQL + Sequelize ORM
- **Autenticación:** JWT + Bcrypt
- **Frontend:** HTML5, CSS3, JavaScript Vanilla
- **QR Dinámico:** Códigos regenerados cada 60 segundos

### 📋 Características

- ✅ Sistema de autenticación con roles (Admin/Empleado)
- ✅ Marcado de asistencias con QR dinámico
- ✅ Panel administrativo completo
- ✅ Dashboard de estadísticas en tiempo real
- ✅ Gestión de trabajadores y turnos
- ✅ Reportes y historial de asistencias

### 🏗️ Arquitectura

Ver [ARQUITECTURA.md](./ARQUITECTURA.md) para diagramas detallados del sistema.

### 🚀 Deploy

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para instrucciones de despliegue en Railway/Render.

### 📦 Instalación Local

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales de MySQL

# Inicializar base de datos
node init.js

# Crear datos de ejemplo (opcional)
node seed-data.js

# Crear usuario admin
node create-admin.js

# Iniciar servidor
npm start
```

### 🔐 Variables de Entorno Requeridas

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=asistencias_db
DB_DIALECT=mysql
JWT_SECRET=tu_secreto_jwt
PORT=3000
NODE_ENV=development
```

### 📱 Uso

1. **Acceso Admin:** `http://localhost:3000/admin/admin-dashboard.html`
2. **Acceso Empleado:** `http://localhost:3000/empleado/empleado-dashboard.html`
3. **Scanner QR:** `http://localhost:3000/empleado/scanner.html`

### 📊 API Endpoints

- `POST /api/auth/login` - Login
- `GET /api/workers/all` - Listar trabajadores
- `POST /api/assistance/mark` - Marcar asistencia
- `GET /api/qr/current` - Código QR actual
- Ver más en [ARQUITECTURA.md](./ARQUITECTURA.md)

### 👨‍💻 Desarrollo

```bash
npm run dev
```

### 📄 Licencia

ISC
