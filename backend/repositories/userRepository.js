// Repositorio para acceso a datos de usuarios en BD
const User = require("../models/User");

class UserRepository {
  // Busca usuario por ID
  async findById(id, attributes = null) {
    return await User.findByPk(id, attributes ? { attributes } : {});
  }

  // Busca usuario por nombre de usuario
  async findByUsername(username) {
    return await User.findOne({ where: { username } });
  }

  // Busca usuario por email
  async findByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  // Obtiene todos los usuarios
  async findAll(options = {}) {
    return await User.findAll(options);
  }

  // Crea nuevo usuario
  async create(userData, transaction = null) {
    return await User.create(userData, transaction ? { transaction } : {});
  }

  // Actualiza datos del usuario
  async update(id, userData) {
    const user = await this.findById(id);
    if (!user) return null;
    return await user.update(userData);
  }

  async delete(id) {
    const user = await this.findById(id);
    if (!user) return false;
    await user.destroy();
    return true;
  }
}

module.exports = new UserRepository();
