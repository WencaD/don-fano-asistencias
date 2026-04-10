// Script para crear usuario administrador
const User = require("../models/User");
const sequelize = require("../config/db");
const bcrypt = require("bcrypt");
require("../models/associations");

async function crearAdmin() {
  try {
    await sequelize.sync(); 

    const adminUsername = "admin";
    const tempPassword = 'DONFANO_ADMIN_PASS_PLAINTEXT';
    
    const existeAdmin = await User.findOne({ where: { username: adminUsername } });

    if (existeAdmin) {
      console.log("Usuario ADMIN ya existe.");
      console.log("Usuario:", existeAdmin.username);
      process.exit();
      return;
    }

    // Encriptar contraseña con bcrypt
    const defaultPasswordHash = await bcrypt.hash(tempPassword, 10);

    // Crear usuario admin
    const admin = await User.create({
      nombre: "Administrador Principal",
      username: adminUsername,
      email: "admin@donfano.com",
      password_hash: defaultPasswordHash,
      role: "ADMIN"
    });

    console.log("Usuario ADMIN creado:");
    console.log("Usuario:", admin.username);
    console.log("Contrase\u00f1a temporal:", tempPassword);
    
    process.exit();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

crearAdmin();