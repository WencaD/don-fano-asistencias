// Utilitario para encriptación de contraseñas con bcrypt
const bcrypt = require("bcrypt");

class PasswordHelper {
  // Encripta contraseñas para almacenamiento seguro
  constructor(saltRounds = 10) {
    this.saltRounds = saltRounds;
  }

  // Convierte contraseña en texto a hash
  async hash(plainPassword) {
    return await bcrypt.hash(plainPassword, this.saltRounds);
  }

  // Compara contraseña en texto con hash almacenado
  async compare(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = new PasswordHelper();
