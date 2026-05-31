// Generación y validación de tokens JWT
const jwt = require("jsonwebtoken");

class TokenHelper {
  constructor() {
    if (!process.env.JWT_SECRET) {
      console.warn('ADVERTENCIA: JWT_SECRET no está definido. Usando clave de respaldo temporaria.');
    }
    this.secret    = process.env.JWT_SECRET || "worksync_secret_fallback_key_123_change_in_production";
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
