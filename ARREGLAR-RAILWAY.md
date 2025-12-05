# Guía Rápida - Arreglar Railway

## El problema
Railway necesita las variables de entorno correctamente configuradas.

## Solución en 3 pasos:

### 1. Ve a tu proyecto Railway:
https://railway.app/project/[tu-proyecto-id]

### 2. Haz clic en tu servicio "don-fano-asistencias"

### 3. Ve a "Variables" y verifica que tengas TODAS estas:

**IMPORTANTE: Usa las referencias de MySQL así:**

```
NODE_ENV=production
PORT=3000
DB_HOST=${{MySQL.MYSQLHOST}}
DB_USER=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}
DB_NAME=${{MySQL.MYSQLDATABASE}}
DB_PORT=${{MySQL.MYSQLPORT}}
JWT_SECRET=un-secreto-largo-y-aleatorio-minimo-32-caracteres
```

### 4. Guarda y Railway hará redeploy automático

### 5. Espera 1-2 minutos y prueba tu URL:
https://don-fano-asistencias-production.up.railway.app

---

## Si sigue sin funcionar:

Ejecuta en tu terminal:
```powershell
railway logs --follow
```

Y copia el error que te muestre.
