// Repositorio para acceso a datos de turnos
const Shift = require("../models/Shift");
const Worker = require("../models/Worker");

class ShiftRepository {
  async findById(id) {
    return await Shift.findByPk(id);
  }

  async findByWorkerAndDate(workerId, fecha) {
    return await Shift.findOne({
      where: { workerId, fecha }
    });
  }

  async findAllByWorkerAndDate(workerId, fecha) {
    return await Shift.findAll({
      where: { workerId, fecha },
      order: [["hora_inicio", "ASC"]]
    });
  }

  async findByWorker(workerId) {
    return await Shift.findAll({
      where: { workerId },
      order: [["fecha", "ASC"], ["hora_inicio", "ASC"]]
    });
  }

  async deleteByWorkerAndDate(workerId, fecha) {
    const shifts = await this.findAllByWorkerAndDate(workerId, fecha);
    if (shifts.length === 0) return 0;
    
    for (const shift of shifts) {
      await shift.destroy();
    }
    
    return shifts.length;
  }

  async findAll() {
    return await Shift.findAll({
      include: [{ model: Worker }],
      order: [["fecha", "DESC"], ["hora_inicio", "ASC"]]
    });
  }

  async create(shiftData) {
    return await Shift.create(shiftData);
  }

  async update(id, shiftData) {
    const shift = await this.findById(id);
    if (!shift) return null;
    return await shift.update(shiftData);
  }

  async delete(id) {
    const shift = await this.findById(id);
    if (!shift) return false;
    await shift.destroy();
    return true;
  }
}

module.exports = new ShiftRepository();
