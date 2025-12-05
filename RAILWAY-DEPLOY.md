# 🚀 Guía de Deploy en Railway - Don Fano Asistencias

## Paso 1: Preparar cuenta Railway

1. Ve a https://railway.app
2. Haz clic en **"Start a New Project"**
3. Inicia sesión con GitHub (te pedirá autorizar)

## Paso 2: Crear el proyecto

### Opción A: Deploy desde GitHub (Recomendado)

1. En Railway, haz clic en **"Deploy from GitHub repo"**
2. Selecciona el repositorio **"WencaD/don-fano-asistencias"**
3. Railway detectará automáticamente que es Node.js

### Opción B: Deploy desde CLI

```powershell
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Iniciar proyecto
railway init

# Deploy
railway up
```

## Paso 3: Agregar MySQL Database

1. En tu proyecto de Railway, haz clic en **"+ New"**
2. Selecciona **"Database"** → **"Add MySQL"**
3. Railway creará automáticamente la base de datos
4. Las variables de entorno se configurarán automáticamente:
   - `MYSQL_URL`
   - `MYSQL_HOST`
   - `MYSQL_PORT`
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`
   - `MYSQL_DATABASE`

## Paso 4: Configurar Variables de Entorno

En tu servicio de Railway (no en la base de datos):

1. Haz clic en tu servicio → **"Variables"**
2. Agrega estas variables:

### Variables requeridas:

```env
NODE_ENV=production
PORT=3000

# Estas se auto-generan al conectar MySQL, pero verifica:
DB_HOST=${{MySQL.MYSQL_HOST}}
DB_USER=${{MySQL.MYSQL_USER}}
DB_PASSWORD=${{MySQL.MYSQL_PASSWORD}}
DB_NAME=${{MySQL.MYSQL_DATABASE}}
DB_PORT=${{MySQL.MYSQL_PORT}}

# Genera un JWT secreto seguro
JWT_SECRET=genera-un-secreto-largo-y-aleatorio-aqui-min-32-caracteres
```

### Para generar JWT_SECRET seguro:
```powershell
# En PowerShell:
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

## Paso 5: Conectar MySQL al servicio

1. En Railway, haz clic en tu servicio principal
2. Ve a **"Settings"** → **"Service Variables"**
3. Haz clic en **"+ Variable Reference"**
4. Selecciona tu MySQL database y conecta las variables

## Paso 6: Inicializar la Base de Datos

Tienes 2 opciones:

### Opción A: Ejecutar init.js desde Railway CLI

```powershell
# Conectar a tu proyecto
railway link

# Ejecutar init.js
railway run node init.js

# Crear admin
railway run node create-admin.js
```

### Opción B: Usar Railway Database Client

1. En Railway, haz clic en tu MySQL database
2. Ve a **"Data"** → **"Query"**
3. Ejecuta manualmente las queries de creación de tablas

O copia los datos desde tu DB local:

```powershell
# Exportar datos locales
mysqldump -u root -p pizzeria > pizzeria_backup.sql

# Importar a Railway (usa las credenciales de Railway)
mysql -h containers-us-west-xxx.railway.app -u root -p railway < pizzeria_backup.sql
```

## Paso 7: Deploy!

Railway hará deploy automáticamente cuando:
- Hagas push a GitHub (si conectaste el repo)
- O ejecutes `railway up` desde CLI

### Ver logs:
```powershell
railway logs
```

### Ver URL de producción:
1. En Railway, haz clic en tu servicio
2. Ve a **"Settings"** → **"Domains"**
3. Railway te dará un dominio gratuito: `don-fano-xxx.up.railway.app`
4. Opcionalmente, puedes agregar tu dominio personalizado

## Paso 8: Verificar Deploy

1. Abre tu URL de Railway
2. Verifica que cargue el login
3. Prueba iniciar sesión con el admin creado
4. Revisa los logs si hay errores:

```powershell
railway logs --follow
```

## Paso 9 (Opcional): Configurar Dominio Personalizado

1. En Railway → Tu servicio → **"Settings"** → **"Domains"**
2. Haz clic en **"Custom Domain"**
3. Ingresa tu dominio: `pizzeria.tudominio.com`
4. En Cloudflare (o tu DNS):
   - Tipo: `CNAME`
   - Nombre: `pizzeria`
   - Contenido: `don-fano-xxx.up.railway.app`
   - Proxy: ✅ Activado

## 🔧 Troubleshooting

### Error de conexión a MySQL:
```powershell
# Verifica las variables
railway variables

# Prueba la conexión
railway run node -e "require('./config/db').authenticate().then(() => console.log('OK')).catch(e => console.error(e))"
```

### Tablas no existen:
```powershell
# Ejecutar init.js en Railway
railway run node init.js
```

### Puerto incorrecto:
Railway asigna el puerto automáticamente. Asegúrate que `index.js` use:
```javascript
const PORT = process.env.PORT || 3000;
```

## 📊 Costos

Railway ofrece:
- **$5 USD gratis** al mes (plan Hobby)
- Suficiente para:
  - 1 servicio web
  - 1 base de datos MySQL
  - ~500 horas de ejecución/mes

Después de eso:
- **$5 USD/mes** por servicio adicional
- **$0.000231/GB-hora** para base de datos

## 🎯 Comandos útiles Railway CLI

```powershell
# Ver estado
railway status

# Ver variables
railway variables

# Agregar variable
railway variables set JWT_SECRET=tu-secreto

# Ejecutar comando en Railway
railway run node create-admin.js

# Conectar a MySQL
railway connect MySQL

# Ver logs en tiempo real
railway logs --follow

# Abrir en navegador
railway open
```

## ✅ Checklist Pre-Deploy

- [ ] Código subido a GitHub
- [ ] `dotenv` instalado en package.json
- [ ] Variables de entorno configuradas en Railway
- [ ] MySQL database agregado en Railway
- [ ] Variables de DB conectadas al servicio
- [ ] `init.js` ejecutado en Railway
- [ ] Admin creado con `create-admin.js`
- [ ] URL de Railway probada en navegador

¡Tu aplicación estará en producción con HTTPS automático! 🚀
