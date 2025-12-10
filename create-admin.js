// Script para crear usuario administrador de emergencia
const User = require("./models/User");
const sequelize = require("./config/db");
const bcrypt = require("bcrypt");
require("./models/associations");

async function crearAdmin() {
  try {
    await sequelize.sync(); 

    const adminUsername = "admin";
    const tempPassword = 'DONFANO_ADMIN_PASS_PLAINTEXT'; // ⬅️ Cambiar nombre a 'tempPassword' para claridad
    
    const existeAdmin = await User.findOne({ where: { username: adminUsername } });

    if (existeAdmin) {
      console.log("✔ Usuario ADMIN ya existe. No se requiere creación.");
      console.log("Usuario:", existeAdmin.username);
      process.exit();
      return;
    }

    // Hashear la contraseña de emergencia
    const defaultPasswordHash = await bcrypt.hash(tempPassword, 10); // ⬅️ Nuevo: Hashear

    // Crear usuario con el hash de emergencia
const admin = await User.create({
      nombre: "Administrador Principal",
      username: adminUsername,
      email: "admin@donfano.com",
      password_hash: defaultPasswordHash, // ⬅️ CORREGIDO: Guardamos el hash
      role: "ADMIN"
    });

    console.log("✔ Usuario ADMIN creado CORRECTAMENTE con hash seguro:");
    console.log("Usuario:", admin.username);
    console.log("Contraseña temporal:", tempPassword); // ⬅️ Mostrar la contraseña temporal original
    
    process.exit();
  } catch (error) {
    console.error("Error al conectar o crear admin:", error);
    process.exit(1);
  }
}

crearAdmin();