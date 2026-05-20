// Generación y validación de tokens JWT
const jwt = require("jsonwebtoken");

class TokenHelper {
  constructor() {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET no está definido en .env. Agrega una clave secreta segura.');
    }
    this.secret    = process.env.JWT_SECRET;
    this.expiresIn = process.env.JWT_EXPIRES_IN || "8h";
  }

  generate(payload) {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  verify(token) {
    return jwt.verify(token, this.secret);
  }

  generateQRToken() {
    return "qr_" + Math.random().toString(36).substring(2, 12);
  }
}

module.exports = new TokenHelper();
