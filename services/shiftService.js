// Servicio para gestión de turnos
const shiftRepository = require("../repositories/shiftRepository");
const assistanceRepository = require("../repositories/assistanceRepository");
const timeHelper = require("../utils/timeHelper");

class ShiftService {
  async createShift(shiftData) {
    const { workerId, fecha, hora_inicio, hora_fin } = shiftData;

    if (!workerId || !fecha || !hora_inicio || !hora_fin) {
      throw new Error("Faltan datos del turno");
    }

    console.log("Fecha recibida del frontend:", fecha);
    const normalizedDate = timeHelper.normalizeDateString(fecha);
    console.log("Fecha normalizada:", normalizedDate);

    const existingAssistance = await assistanceRepository.findByWorkerAndDate(workerId, normalizedDate);
    
    if (existingAssistance) {
      await shiftRepository.deleteByWorkerAndDate(workerId, normalizedDate);
    }

    return await shiftRepository.create({
      workerId,
      fecha: normalizedDate,
      hora_inicio,
      hora_fin
    });
  }

  async getAllShifts() {
    return await shiftRepository.findAll();
  }

  async getShiftsByWorker(workerId) {
    return await shiftRepository.findByWorker(workerId);
  }

  async deleteShift(id) {
    const deleted = await shiftRepository.delete(id);
    if (!deleted) {
      throw new Error("Turno no encontrado");
    }
    return true;
  }
}

module.exports = new ShiftService();
