const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

let serviceAccount = null;
const keyPath = path.join(__dirname, 'firebase-service-account.json');

if (fs.existsSync(keyPath)) {
  serviceAccount = require(keyPath);
} else if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  try {
    let jsonStr = process.env.FIREBASE_SERVICE_ACCOUNT_JSON.trim();
    // Eliminar comillas simples o dobles que a veces envuelven la variable en Vercel
    if (jsonStr.startsWith("'") && jsonStr.endsWith("'")) {
      jsonStr = jsonStr.slice(1, -1);
    }
    if (jsonStr.startsWith('"') && jsonStr.endsWith('"')) {
      jsonStr = jsonStr.slice(1, -1);
    }
    serviceAccount = JSON.parse(jsonStr);
  } catch (err) {
    console.error("Error al parsear FIREBASE_SERVICE_ACCOUNT_JSON desde las variables de entorno:", err.message);
  }
}

if (admin.apps.length === 0) {
  if (serviceAccount) {
    if (serviceAccount.private_key) {
      serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
    }
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin SDK inicializado usando credenciales de cuenta de servicio.");
  } else {
    // Inicialización por defecto (útil en entornos GCP/Firebase Hosting o con variables por defecto de GCP)
    try {
      admin.initializeApp();
      console.log("Firebase Admin SDK inicializado por defecto.");
    } catch (error) {
      console.warn("Advertencia: No se pudo inicializar Firebase de forma automática. Provee un archivo firebase-service-account.json o la variable FIREBASE_SERVICE_ACCOUNT_JSON.");
    }
  }
} else {
  console.log("Firebase Admin SDK ya estaba inicializado.");
}

const db = admin.apps.length > 0 ? admin.firestore() : null;
const auth = admin.apps.length > 0 ? admin.auth() : null;

module.exports = { db, auth, admin };

