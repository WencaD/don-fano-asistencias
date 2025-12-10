// Servicio de autenticación de usuarios
const userRepository = require("../repositories/userRepository");
const passwordHelper = require("../utils/passwordHelper");
const tokenHelper = require("../utils/tokenHelper");

class AuthService {
  async login(username, password) {
    const user = await userRepository.findByUsername(username);
    
    if (!user) {
      throw new Error("Usuario o contraseña incorrecta");
    }

    const isPasswordValid = await passwordHelper.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      throw new Error("Contraseña incorrecta");
    }

    return user;
  }

  generateToken(user, workerId = null) {
    return tokenHelper.generate({
      id: user.id,
      role: user.role,
      workerId
    });
  }
}

module.exports = new AuthService();
