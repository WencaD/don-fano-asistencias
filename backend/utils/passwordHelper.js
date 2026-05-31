// Encriptación de contraseñas con bcrypt
const bcrypt = require("bcryptjs");

class PasswordHelper {
  constructor(saltRounds = 10) {
    this.saltRounds = saltRounds;
  }

  async hash(plainPassword) {
    return await bcrypt.hash(plainPassword, this.saltRounds);
  }

  async compare(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = new PasswordHelper();
