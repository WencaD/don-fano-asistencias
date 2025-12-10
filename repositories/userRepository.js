// Repositorio para acceso a datos de usuarios
const User = require("../models/User");

class UserRepository {
  async findById(id, attributes = null) {
    return await User.findByPk(id, attributes ? { attributes } : {});
  }

  async findByUsername(username) {
    return await User.findOne({ where: { username } });
  }

  async findByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  async findAll(options = {}) {
    return await User.findAll(options);
  }

  async create(userData, transaction = null) {
    return await User.create(userData, transaction ? { transaction } : {});
  }

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
