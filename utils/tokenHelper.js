// Utilidad para generación y validación de tokens JWT
const jwt = require("jsonwebtoken");

class TokenHelper {
  constructor() {
    this.secret = process.env.JWT_SECRET || "supersecretkey";
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
