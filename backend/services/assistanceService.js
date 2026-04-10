// Servicio para registro y gestión de asistencias
const assistanceRepository = require("../repositories/assistanceRepository");
const workerRepository = require("../repositories/workerRepository");
const shiftRepository = require("../repositories/shiftRepository");
const timeHelper = require("../utils/timeHelper");

class AssistanceService {
  async markAssistance(qrToken) {
    const worker = await workerRepository.findByQRToken(qrToken);
    if (!worker) {
      throw new Error("QR inválido o trabajador no encontrado");
    }

    const fecha = timeHelper.getCurrentDate();
    const hora = timeHelper.getCurrentTime();

    const existingAssistance = await assistanceRepository.findByWorkerAndDate(
      worker.id, 
      fecha
    );

    const shift = await shiftRepository.findByWorkerAndDate(worker.id, fecha);
    const startTimeLimit = shift 
      ? timeHelper.formatTime(shift.hora_inicio) 
      : "09:00:00";

    if (!existingAssistance) {
      return await this._registerEntry(worker.id, fecha, hora, startTimeLimit);
    } else if (!existingAssistance.hora_salida) {
      return await this._registerExit(existingAssistance, hora);
    } else {
      return { 
        type: "completa", 
        assistance: existingAssistance,
        message: "Ya completaste tu jornada de hoy"
      };
    }
  }

  async _registerEntry(workerId, fecha, hora, startTimeLimit) {
    let estado = "Puntual";
    let minutos_tarde = 0;

    const minutesDifference = timeHelper.diffMinutes(hora, startTimeLimit);

    if (minutesDifference > 0) {
      minutos_tarde = minutesDifference;
      estado = "Tardanza";
    }

    const assistance = await assistanceRepository.create({
      fecha,
      hora_entrada: hora,
      estado,
      minutos_tarde,
      workerId
    });

    return { type: "entrada", estado, assistance };
  }

  async _registerExit(assistance, hora) {
    assistance.hora_salida = hora;
    await assistance.save();
    return { type: "salida", assistance };
  }

  async getWorkerAssistances(workerId) {
    return await assistanceRepository.findByWorker(workerId, {
      order: [["fecha", "DESC"]]
    });
  }

  async getAllAssistances() {
    return await assistanceRepository.findAll();
  }

  async deleteAssistance(id) {
    const deleted = await assistanceRepository.delete(id);
    if (!deleted) {
      throw new Error("Asistencia no encontrada");
    }
    return true;
  }
}

module.exports = new AssistanceService();
