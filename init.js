// init.js - EJECUTAR UNA SOLA VEZ
const sequelize = require("./config/db");
const User = require("./models/User");
const Worker = require("./models/Worker");
require("./models/associations");

async function resetear() {
  try {
    console.log("🔥 INICIANDO LIMPIEZA TOTAL DE BD...");
    
    // Borrar y recrear todas las tablas limpiamente (soluciona UnknownConstraintError)
    await sequelize.sync({ force: true }); 
    console.log("✅ Tablas creadas.");

    // CREAR ADMIN con contraseña de texto plano para consistencia
    await User.create({
      id: 1, 
      nombre: "Administrador Principal",
      username: "admin",
      email: "admin@donfano.com",
      password_hash: "123456", // Contraseña de texto plano
      role: "ADMIN" 
    });

    console.log("==================================");
    console.log("🎉 SISTEMA LISTO PARA INICIAR.");
    console.log("👉 Login: admin / 123456");
    console.log("==================================");
    process.exit();
  } catch (e) {
    console.error("❌ ERROR CRÍTICO AL SINCRONIZAR:", e.message);
    process.exit(1);
  }
}

resetear();