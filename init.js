// Script de inicialización de base de datos (ejecutar una sola vez)
const sequelize = require("./config/db");
const User = require("./models/User");
const Worker = require("./models/Worker");
const bcrypt = require("bcrypt");

require("./models/associations");

async function resetear() {
  try {
    console.log("🔥 INICIANDO LIMPIEZA TOTAL DE BD...");
    
    // Borrar y recrear todas las tablas limpiamente (¡Esto borra todos los datos!)
    await sequelize.sync({ force: true }); 
    console.log("✅ Tablas creadas.");

    // ===============================================
    // ✅ CORRECCIÓN DE SEGURIDAD: HASHEAR LA CONTRASEÑA
    // ===============================================
    const plaintextPassword = "123456";
    
    // Generamos el hash seguro (costo 10)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(plaintextPassword, saltRounds); 

    // CREAR ADMIN con HASH de contraseña seguro
    await User.create({
      id: 1, 
      nombre: "Administrador Principal",
      username: "admin",
      email: "admin@donfano.com",
      password_hash: hashedPassword, // ⬅️ USAMOS EL HASH SEGURO
      role: "ADMIN" 
    });
    
    // Aquí puedes agregar más Workers o Shifts por defecto si lo necesitas

    console.log("==================================");
    console.log("🎉 SISTEMA LISTO PARA INICIAR.");
    console.log(`👉 Login: admin / ${plaintextPassword}`);
    console.log("==================================");
    process.exit();
  } catch (e) {
    console.error("❌ ERROR CRÍTICO AL SINCRONIZAR:", e.message);
    process.exit(1);
  }
}

resetear();