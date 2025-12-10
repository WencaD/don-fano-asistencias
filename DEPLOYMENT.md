# 🚀 Guía de Despliegue - Sistema de Asistencias

## 📋 Opciones de Deployment

### Opción 1: Railway.app (RECOMENDADO) ⭐

**Ventajas:**
- ✅ Gratis hasta $5 USD/mes de créditos
- ✅ Base de datos MySQL incluida
- ✅ Deploy automático desde GitHub
- ✅ SSL/HTTPS automático
- ✅ Muy fácil de configurar

**Pasos:**

1. **Crear cuenta en Railway**
   - Ve a https://railway.app
   - Regístrate con GitHub

2. **Crear nuevo proyecto**
   - Click en "New Project"
   - Selecciona "Deploy from GitHub repo"
   - Conecta tu repositorio `don-fano-asistencias`

3. **Agregar base de datos MySQL**
   - En el proyecto, click en "+ New"
   - Selecciona "Database" → "MySQL"
   - Railway creará automáticamente la DB

4. **Configurar variables de entorno**
   - En tu servicio Node.js, ve a "Variables"
   - Agrega las siguientes variables (Railway te da las de MySQL automáticamente):
   ```
   NODE_ENV=production
   JWT_SECRET=tu_secreto_super_seguro_aqui
   ```
   - Railway automáticamente configura: `DATABASE_URL`, `MYSQL_URL`, etc.

5. **Actualizar código para Railway** (ya está configurado en el proyecto)

6. **Deploy automático**
   - Railway hace deploy automático al hacer push a GitHub
   - Obtendrás una URL como: `https://tu-proyecto.up.railway.app`

---

### Opción 2: Render.com

**Ventajas:**
- ✅ Plan gratuito permanente
- ✅ Base de datos PostgreSQL/MySQL gratuita
- ✅ Deploy desde GitHub
- ✅ SSL gratis

**Pasos:**

1. **Crear cuenta**
   - Ve a https://render.com
   - Regístrate con GitHub

2. **Crear Web Service**
   - New → Web Service
   - Conecta tu repo de GitHub
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Crear base de datos**
   - New → MySQL (o PostgreSQL)
   - Copia las credenciales

4. **Variables de entorno**
   ```
   DB_HOST=tu-db-host
   DB_USER=tu-user
   DB_PASSWORD=tu-password
   DB_NAME=tu-database
   DB_DIALECT=mysql
   JWT_SECRET=tu-secreto
   PORT=10000
   NODE_ENV=production
   ```

---

### Opción 3: Vercel + PlanetScale (Base de datos separada)

**Solo para el frontend estático:**
- Vercel para servir archivos HTML/CSS/JS
- Necesitarías otro servicio para el backend (Railway/Render)

---

## 🔧 Preparación del Proyecto

### 1. Verificar archivos necesarios

✅ `.gitignore` - Para no subir node_modules ni .env
✅ `package.json` - Con engines de Node
✅ `.env.example` - Ejemplo de variables de entorno

### 2. Modificar config/db.js para producción

El archivo ya está configurado para leer variables de entorno.

### 3. Subir a GitHub

```bash
git init
git add .
git commit -m "Initial commit - Sistema de asistencias"
git branch -M main
git remote add origin https://github.com/WencaD/don-fano-asistencias.git
git push -u origin main
```

---

## 📊 Configuración de Base de Datos en Producción

### Railway (Automático)
Railway te da estas variables automáticamente:
- `MYSQL_URL` - URL completa de conexión
- `MYSQLHOST` - Host
- `MYSQLPORT` - Puerto
- `MYSQLDATABASE` - Nombre de la base de datos
- `MYSQLUSER` - Usuario
- `MYSQLPASSWORD` - Contraseña

### Render
Debes copiar manualmente las credenciales que te dan.

---

## 🗄️ Migrar Base de Datos

### Opción A: Exportar desde local e importar

```bash
# Exportar desde tu MySQL local
mysqldump -u root -p asistencias_db > backup.sql

# Importar a Railway/Render (usando Railway CLI o conexión remota)
mysql -h HOST -u USER -p DATABASE < backup.sql
```

### Opción B: Usar init.js y seed-data.js

Conectarte a la DB de producción y ejecutar:
```bash
node init.js
node seed-data.js
```

---

## 🔐 Configuración de CORS para Producción

Actualiza tu `index.js` si necesitas restringir CORS:

```javascript
app.use(cors({
  origin: ['https://tu-dominio.railway.app', 'https://tu-dominio-personalizado.com'],
  credentials: true
}));
```

---

## 📱 Acceso desde Móvil

Una vez desplegado, tu app estará disponible en:
- `https://tu-proyecto.up.railway.app` (Railway)
- `https://tu-proyecto.onrender.com` (Render)

Podrás acceder desde cualquier dispositivo con internet.

---

## 💰 Costos

### Railway
- **Gratis**: $5 USD en créditos mensuales
- **Suficiente para**: ~500 horas/mes de uptime
- **Ideal para**: Proyectos pequeños y medianos

### Render
- **Gratis**: Plan gratuito permanente
- **Limitación**: El servicio se "duerme" después de 15 min de inactividad
- **Primer request**: Puede tardar ~30 segundos en "despertar"

---

## 🚦 Siguiente Paso

**RECOMENDACIÓN:** Usa **Railway** por facilidad y porque incluye MySQL.

1. Ve a https://railway.app
2. Conecta tu GitHub
3. Deploy tu repo
4. Agrega MySQL desde Railway
5. ¡Listo! Tu app estará en línea 24/7

---

## 📞 Soporte

Si tienes problemas:
- Railway Docs: https://docs.railway.app
- Render Docs: https://render.com/docs
- Discord Railway: https://discord.gg/railway

---

**¿Necesitas ayuda con algún paso específico? ¡Pregúntame!** 🚀
