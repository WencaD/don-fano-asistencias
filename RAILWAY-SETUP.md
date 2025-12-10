# 🚀 GUÍA RÁPIDA DE DEPLOYMENT

## ✅ Tu código ya está en GitHub!

Repositorio: https://github.com/WencaD/don-fano-asistencias

---

## 🎯 DEPLOYMENT EN RAILWAY (OPCIÓN RECOMENDADA)

### Paso 1: Crear cuenta en Railway
1. Ve a **https://railway.app**
2. Click en "Login" → "Login with GitHub"
3. Autoriza Railway a acceder a tus repositorios

### Paso 2: Crear nuevo proyecto
1. En el dashboard de Railway, click en **"New Project"**
2. Selecciona **"Deploy from GitHub repo"**
3. Busca y selecciona **"don-fano-asistencias"**
4. Railway iniciará el deploy automáticamente

### Paso 3: Agregar base de datos MySQL
1. En tu proyecto, click en el botón **"+ New"** (esquina superior derecha)
2. Selecciona **"Database"**
3. Elige **"Add MySQL"**
4. Railway creará automáticamente la base de datos

### Paso 4: Conectar la base de datos al servicio
1. Click en tu servicio de Node.js (don-fano-asistencias)
2. Ve a la pestaña **"Variables"**
3. Railway ya habrá agregado automáticamente las variables de MySQL:
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLDATABASE`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`

4. Agrega manualmente estas variables adicionales:
   ```
   JWT_SECRET=tu_secreto_super_seguro_cambiar_por_uno_random
   NODE_ENV=production
   ```

### Paso 5: Actualizar config/db.js (IMPORTANTE)
Railway usa nombres diferentes para las variables. Necesitas actualizar tu archivo `config/db.js`:

```javascript
require('dotenv').config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.MYSQLDATABASE || process.env.DB_NAME,
  process.env.MYSQLUSER || process.env.DB_USER,
  process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
  {
    host: process.env.MYSQLHOST || process.env.DB_HOST,
    port: process.env.MYSQLPORT || 3306,
    dialect: 'mysql',
    logging: false,
    timezone: '-05:00',
  }
);

module.exports = sequelize;
```

Haz este cambio en tu código local, commitea y pushea:
```bash
git add config/db.js
git commit -m "fix: Actualizar config DB para Railway"
git push origin main
```

Railway hará redeploy automáticamente.

### Paso 6: Inicializar la base de datos
Una vez que el deploy esté exitoso:

1. En Railway, click en tu servicio de Node.js
2. Ve a la pestaña **"Settings"**
3. Scroll hasta **"Custom Start Command"** (opcional si quieres ejecutar comandos)
4. O conéctate por SSH para ejecutar:
   ```bash
   node init.js
   node seed-data.js
   node create-admin.js
   ```

O usa Railway CLI:
```bash
npm install -g @railway/cli
railway login
railway run node init.js
railway run node create-admin.js
```

### Paso 7: Obtener tu URL pública
1. En tu servicio, ve a **"Settings"**
2. En la sección **"Domains"**, click en **"Generate Domain"**
3. Railway te dará una URL como: `https://tu-proyecto.up.railway.app`

---

## 🌐 ALTERNATIVA: DEPLOYMENT EN RENDER

### Paso 1: Crear cuenta
1. Ve a **https://render.com**
2. Regístrate con GitHub

### Paso 2: Crear Web Service
1. Dashboard → **"New +"** → **"Web Service"**
2. Conecta tu repo: **don-fano-asistencias**
3. Configuración:
   - **Name:** asistencias-don-fano
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

### Paso 3: Crear base de datos MySQL
1. Dashboard → **"New +"** → **"MySQL"**
2. Configuración:
   - **Name:** asistencias-db
   - **Plan:** Free
3. Copia las credenciales que te dan

### Paso 4: Variables de entorno
En tu Web Service, ve a **"Environment"** y agrega:
```
DB_HOST=<Internal Database URL from MySQL service>
DB_USER=<MySQL username>
DB_PASSWORD=<MySQL password>
DB_NAME=<MySQL database name>
DB_DIALECT=mysql
JWT_SECRET=tu_secreto_super_seguro
PORT=10000
NODE_ENV=production
```

### Paso 5: Deploy
Click en **"Create Web Service"**
Render hará el deploy automático.

---

## 📊 COMPARACIÓN

| Característica | Railway | Render |
|---------------|---------|--------|
| **Precio** | $5 USD/mes gratis | Plan Free permanente |
| **Uptime** | 24/7 | Se duerme tras 15 min inactividad |
| **MySQL Incluido** | ✅ Sí | ✅ Sí (PostgreSQL más común) |
| **Deploy Automático** | ✅ Sí | ✅ Sí |
| **SSL/HTTPS** | ✅ Gratis | ✅ Gratis |
| **Facilidad** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

**RECOMENDACIÓN:** Railway para tu caso.

---

## 🔧 COMANDOS ÚTILES

```bash
# Ver logs en Railway CLI
railway logs

# Conectarse a la base de datos Railway
railway connect

# Ejecutar comando en producción
railway run node init.js
```

---

## 📱 ACCESO A TU APP

Una vez desplegado:
- **URL Pública:** `https://tu-proyecto.up.railway.app`
- **Admin:** `https://tu-proyecto.up.railway.app/admin/admin-dashboard.html`
- **Empleado:** `https://tu-proyecto.up.railway.app/empleado/empleado-dashboard.html`
- **Scanner QR:** `https://tu-proyecto.up.railway.app/empleado/scanner.html`

---

## ❓ ¿NECESITAS AYUDA?

1. **Errores de deploy:** Revisa los logs en Railway/Render
2. **Base de datos no conecta:** Verifica las variables de entorno
3. **App no carga:** Asegúrate de que `npm start` funciona localmente

---

**¡Tu app estará disponible 24/7 en internet!** 🎉
