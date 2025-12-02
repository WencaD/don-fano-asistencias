// create-admin.js - SOLUCIÓN DE EMERGENCIA
const User = require("./models/User");
const sequelize = require("./config/db");
require("./models/associations");

async function crearAdmin() {
  try {
    await sequelize.sync(); 

    const adminUsername = "admin";
    const defaultPasswordHash = 'DONFANO_ADMIN_PASS_PLAINTEXT'; // <-- Hash simple de emergencia

    const existeAdmin = await User.findOne({ where: { username: adminUsername } });

    if (existeAdmin) {
      console.log("✔ Usuario ADMIN ya existe. No se requiere creación.");
      console.log("Usuario:", existeAdmin.username);
      process.exit();
      return;
    }

    // Crear usuario con el hash de emergencia
    const admin = await User.create({
      nombre: "Administrador Principal",
      username: adminUsername,
      email: "admin@donfano.com",
      password_hash: defaultPasswordHash, // <-- Guardamos el hash de emergencia
      role: "ADMIN"
    });

    console.log("✔ Usuario ADMIN creado CORRECTAMENTE con hash simple:");
    console.log("Usuario:", admin.username);
    console.log("Contraseña temporal:", defaultPasswordHash); // <-- Contraseña temporal
    
    process.exit();
  } catch (error) {
    console.error("Error al conectar o crear admin:", error);
    process.exit(1);
  }
}

crearAdmin();