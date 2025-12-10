// Script para resetear contraseña de usuario
const User = require("./models/User");
const bcrypt = require("bcrypt");
const sequelize = require("./config/db");

(async () => {
  try {
    await sequelize.sync();

    const username = "admin";
    const newPassword = "123456";

    const user = await User.findOne({ where: { username } });

    if (!user) {
      console.log("No existe el usuario admin.");
      process.exit();
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    user.password_hash = hashed;
    await user.save();

    console.log("✔ Contraseña reseteada correctamente");
    console.log("Usuario:", username);
    console.log("Nueva contraseña:", newPassword);

    process.exit();
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
})();
