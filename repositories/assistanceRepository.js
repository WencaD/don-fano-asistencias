// Repositorio para acceso a datos de asistencias
const Assistance = require("../models/Assistance");
const Worker = require("../models/Worker");

class AssistanceRepository {
  async findById(id) {
    return await Assistance.findByPk(id);
  }

  async findByWorkerAndDate(workerId, fecha) {
    return await Assistance.findOne({
      where: { workerId, fecha }
    });
  }

  async findByWorker(workerId, options = {}) {
    return await Assistance.findAll({
      where: { workerId },
      ...options
    });
  }

  async findAll(options = {}) {
    return await Assistance.findAll({
      include: [{ model: Worker }],
      order: [["fecha", "DESC"]],
      ...options
    });
  }

  async create(assistanceData) {
    return await Assistance.create(assistanceData);
  }

  async update(id, assistanceData) {
    const assistance = await this.findById(id);
    if (!assistance) return null;
    return await assistance.update(assistanceData);
  }

  async delete(id) {
    const assistance = await this.findById(id);
    if (!assistance) return false;
    await assistance.destroy();
    return true;
  }
}

module.exports = new AssistanceRepository();
