// Repositorio para acceso a datos de organizaciones en BD
const Organization = require("../models/Organization");

class OrganizationRepository {
  // Busca organización por ID
  async findById(id) {
    return await Organization.findByPk(id);
  }

  // Busca organización por alias
  async findByAlias(alias) {
    return await Organization.findOne({ where: { alias } });
  }

  // Busca organización por nombre
  async findByName(nombre) {
    return await Organization.findOne({ where: { nombre } });
  }

  // Busca todas las organizaciones
  async findAll(options = {}) {
    return await Organization.findAll(options);
  }

  // Crea nueva organización
  async create(organizationData, transaction = null) {
    return await Organization.create(organizationData, transaction ? { transaction } : {});
  }

  // Actualiza datos de la organización
  async update(id, organizationData) {
    const org = await this.findById(id);
    if (!org) return null;
    return await org.update(organizationData);
  }

  // Elimina una organización
  async delete(id) {
    const org = await this.findById(id);
    if (!org) return false;
    await org.destroy();
    return true;
  }
}

module.exports = new OrganizationRepository();
