// Servicio para generación de reportes de asistencia
const assistanceRepository = require("../repositories/assistanceRepository");
const workerRepository = require("../repositories/workerRepository");

class ReportService {
  async generateReport(filters) {
    const { desde, hasta, workerId } = filters;

    if (!desde || !hasta) {
      throw new Error("Rango de fechas requerido");
    }

    let assistances = await assistanceRepository.findAll({
      order: [["fecha", "ASC"], ["hora_entrada", "ASC"]]
    });

    assistances = assistances.filter(a => {
      const inDateRange = a.fecha >= desde && a.fecha <= hasta;
      const matchesWorker = workerId ? a.workerId === parseInt(workerId) : true;
      return inDateRange && matchesWorker;
    });

    return assistances.map(assistance => {
      const reportData = {
        ...assistance.toJSON(),
        horasTrabajadas: 0,
        pagoDelDia: 0
      };

      if (assistance.hora_entrada && assistance.hora_salida && assistance.Worker) {
        const hours = this._calculateWorkedHours(
          assistance.hora_entrada,
          assistance.hora_salida
        );

        const salarioHora = assistance.Worker.salario_hora || 0;
        
        reportData.horasTrabajadas = parseFloat(hours.toFixed(2));
        reportData.pagoDelDia = parseFloat((hours * salarioHora).toFixed(2));
        
        console.log(`Reporte - Fecha: ${assistance.fecha}, Horas: ${hours.toFixed(2)}, Salario/hora: ${salarioHora}, Pago: ${reportData.pagoDelDia}`);
      } else {
        console.log(`Sin cálculo - Entrada: ${assistance.hora_entrada}, Salida: ${assistance.hora_salida}, Worker: ${assistance.Worker ? 'SI' : 'NO'}`);
      }

      return reportData;
    });
  }  _calculateWorkedHours(horaEntrada, horaSalida) {
    if (!horaEntrada || !horaSalida) return 0;

    const entradaParts = horaEntrada.split(':').map(Number);
    const salidaParts = horaSalida.split(':').map(Number);

    const entradaMinutes = entradaParts[0] * 60 + entradaParts[1] + (entradaParts[2] || 0) / 60;
    const salidaMinutes = salidaParts[0] * 60 + salidaParts[1] + (salidaParts[2] || 0) / 60;

    const totalMinutes = salidaMinutes - entradaMinutes;
    return totalMinutes > 0 ? totalMinutes / 60 : 0;
  }
}

module.exports = new ReportService();
