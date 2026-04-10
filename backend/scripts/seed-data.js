// Script para crear admin inicial en la base de datos
const sequelize = require("../config/db");
const User = require("../models/User");
const bcrypt = require("bcrypt");

require("../models/associations");

async function seedData() {
  try {
    console.log("Inicializando base de datos...");

    await sequelize.sync();

    // Verificar si el admin ya existe
    let admin = await User.findOne({ where: { username: "admin" } });
    
    if (admin) {
      console.log("Admin ya existe en la BD");
      process.exit(0);
      return;
    }

    // Crear admin si no existe
    const adminPassword = await bcrypt.hash("123456", 10);
    admin = await User.create({
      nombre: "Administrador Principal",
      username: "admin",
      email: "admin@donfano.com",
      password_hash: adminPassword,
      role: "ADMIN"
    });

    console.log("Administrador creado");
    console.log("\nCredenciales de acceso:");
    console.log("Usuario: admin");
    console.log("Contraseña: 123456");
    console.log("Email: admin@donfano.com");
    console.log("\nAhora puedes agregar trabajadores en MySQL Workbench.");

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

seedData();
