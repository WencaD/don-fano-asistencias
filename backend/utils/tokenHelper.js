// Utilidad para generación y validación de tokens JWT
const jwt = require("jsonwebtoken");

class TokenHelper {
  // Maneja tokens JWT para autenticación
  constructor() {
    this.secret = process.env.JWT_SECRET || "supersecretkey";
    this.expiresIn = process.env.JWT_EXPIRES_IN || "8h";
  }

  // Genera nuevo token JWT con datos del usuario
  generate(payload) {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn });
  }

  // Valida y decodifica token JWT
  verify(token) {
    return jwt.verify(token, this.secret);
  }

  // Genera token para códigos QR
  generateQRToken() {
    return "qr_" + Math.random().toString(36).substring(2, 12);
  }
}

module.exports = new TokenHelper();
