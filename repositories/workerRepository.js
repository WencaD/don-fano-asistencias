// Repositorio para acceso a datos de trabajadores
const Worker = require("../models/Worker");
const User = require("../models/User");

class WorkerRepository {
  async findById(id, includeUser = false) {
    const options = includeUser 
      ? { include: [{ model: User, attributes: ["id", "username", "email", "role"] }] }
      : {};
    return await Worker.findByPk(id, options);
  }

  async findByQRToken(qrToken) {
    return await Worker.findOne({ where: { qr_token: qrToken } });
  }

  async findAll(includeUser = false) {
    const options = {
      order: [["id", "ASC"]]
    };
    
    if (includeUser) {
      options.include = [{ 
        model: User, 
        attributes: ["id", "username", "email", "role"] 
      }];
    }
    
    return await Worker.findAll(options);
  }

  async create(workerData, transaction = null) {
    return await Worker.create(workerData, transaction ? { transaction } : {});
  }

  async update(id, workerData) {
    const worker = await this.findById(id);
    if (!worker) return null;
    return await worker.update(workerData);
  }

  async delete(id) {
    const worker = await this.findById(id);
    if (!worker) return false;
    await worker.destroy();
    return true;
  }

  async findByUserId(userId) {
    return await Worker.findOne({ where: { userId } });
  }
}

module.exports = new WorkerRepository();
