const { db } = require("../config/firebase");
const bcrypt = require("bcryptjs");

async function seedFirebase() {
  try {
    if (!db) {
      console.error("❌ Firebase no está configurado. Agrega 'firebase-service-account.json' en backend/config/ antes de ejecutar este script.");
      process.exit(1);
    }

    console.log("Inicializando base de datos en Firebase Cloud Firestore...");

    // Verificar si el admin ya existe
    const snapshot = await db.collection("users").where("username", "==", "admin").limit(1).get();
    
    if (!snapshot.empty) {
      console.log("✅ El Administrador ya existe en Firebase Firestore.");
      process.exit(0);
    }

    // Crear admin si no existe
    const adminPassword = await bcrypt.hash("123456", 10);
    
    const adminData = {
      nombre: "Administrador Principal",
      username: "admin",
      email: "admin@donfano.com",
      password_hash: adminPassword,
      role: "ADMIN",
      activo: true
    };

    // Usamos 'admin-root' como ID de documento para el usuario administrador
    await db.collection("users").doc("admin-root").set(adminData);

    console.log("🚀 Administrador creado con éxito en Firestore.");
    console.log("\nCredenciales de acceso:");
    console.log("Usuario: admin");
    console.log("Contraseña: 123456");
    console.log("Email: admin@donfano.com");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error al poblar datos en Firebase:", error);
    process.exit(1);
  }
}

seedFirebase();
