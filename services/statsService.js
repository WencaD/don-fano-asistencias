// Servicio para estadísticas y dashboards
const assistanceRepository = require("../repositories/assistanceRepository");
const workerRepository = require("../repositories/workerRepository");
const shiftRepository = require("../repositories/shiftRepository");
const timeHelper = require("../utils/timeHelper");

class StatsService {
  async getDashboardStats() {
    const today = timeHelper.getCurrentDate();

    const allWorkers = await workerRepository.findAll(false);
    const todayAssistances = await assistanceRepository.findAll();
    
    const assistancesToday = todayAssistances.filter(a => a.fecha === today);
    
    const activeWorkers = assistancesToday.filter(
      a => a.hora_entrada && !a.hora_salida
    ).length;

    const entrancesToday = assistancesToday.filter(a => a.hora_entrada).length;
    const exitsToda = assistancesToday.filter(a => a.hora_salida).length;

    return {
      totalTrabajadores: allWorkers.length,
      empleadosActivos: activeWorkers,
      entradasHoy: entrancesToday,
      salidasHoy: exitsToda
    };
  }

  async getStatsByPeriod(period = "week") {
    const today = timeHelper.getCurrentDate();
    const desde = this._getStartDate(period);
    const hasta = today;

    const allWorkers = await workerRepository.findAll(false);
    const totalWorkers = allWorkers.length;

    const assistances = await assistanceRepository.findAll();
    const periodAssistances = assistances.filter(
      a => a.fecha >= desde && a.fecha <= hasta
    );

    const statsMap = this._buildStatsMap(periodAssistances);
    return this._formatPeriodStats(desde, hasta, statsMap, totalWorkers);
  }

  async getWorkerDashboard(workerId) {
    const today = timeHelper.getCurrentDate();
    const firstDayOfMonth = today.slice(0, 7) + '-01';

    const worker = await workerRepository.findById(workerId);
    if (!worker) {
      throw new Error("Trabajador no encontrado");
    }

    const todayAssistance = await assistanceRepository.findByWorkerAndDate(workerId, today);

    const monthlyAssistances = await assistanceRepository.findByWorker(workerId);
    const currentMonthAssistances = monthlyAssistances.filter(
      a => a.fecha >= firstDayOfMonth
    );

    const monthlyStats = this._calculateMonthlyStats(currentMonthAssistances, worker.salario_hora);

    const nextShifts = await shiftRepository.findByWorker(workerId);
    const upcomingShifts = nextShifts.filter(s => s.fecha >= today).slice(0, 5);

    const history = currentMonthAssistances
      .sort((a, b) => b.fecha.localeCompare(a.fecha))
      .slice(0, 10);

    return {
      todayAssistance: todayAssistance || null,
      monthlyStats,
      nextShifts: upcomingShifts,
      history
    };
  }

  _getStartDate(period) {
    const date = new Date();
    
    switch(period) {
      case "month":
        date.setMonth(date.getMonth() - 1);
        break;
      case "year":
        date.setFullYear(date.getFullYear() - 1);
        break;
      default:
        date.setDate(date.getDate() - 7);
    }
    
    return date.toISOString().split("T")[0];
  }

  _buildStatsMap(assistances) {
    const map = {};
    
    assistances.forEach(a => {
      const fecha = a.fecha;
      if (!map[fecha]) {
        map[fecha] = {
          tardanzas: 0,
          minutosTarde: 0,
          asistencias: 0
        };
      }
      
      if (a.estado === "Tardanza") {
        map[fecha].tardanzas++;
      }
      map[fecha].minutosTarde += a.minutos_tarde || 0;
      map[fecha].asistencias++;
    });
    
    return map;
  }

  _formatPeriodStats(desde, hasta, statsMap, totalWorkers) {
    const labels = [];
    const tardanzas = [];
    const minutosTarde = [];
    const faltas = [];

    const startDate = new Date(desde);
    const endDate = new Date(hasta);

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];
      const stats = statsMap[dateStr] || { tardanzas: 0, minutosTarde: 0, asistencias: 0 };
      
      labels.push(dateStr.slice(5));
      tardanzas.push(stats.tardanzas);
      minutosTarde.push(stats.minutosTarde);
      faltas.push(totalWorkers - stats.asistencias);
    }

    return { labels, tardanzas, minutosTarde, faltas };
  }

  _calculateMonthlyStats(assistances, salarioPorHora = 0) {
    let totalMinutosTarde = 0;
    let totalHorasTrabajadas = 0;
    const diasAsistidos = new Set();

    assistances.forEach(a => {
      diasAsistidos.add(a.fecha);
      totalMinutosTarde += a.minutos_tarde || 0;

      if (a.hora_entrada && a.hora_salida) {
        const hours = this._calculateHours(a.hora_entrada, a.hora_salida);
        totalHorasTrabajadas += hours;
      }
    });

    const pagoEstimado = totalHorasTrabajadas * salarioPorHora;

    return {
      diasAsistidos: diasAsistidos.size,
      minutosTarde: totalMinutosTarde,
      horasTrabajadas: parseFloat(totalHorasTrabajadas.toFixed(2)),
      pagoEstimado: parseFloat(pagoEstimado.toFixed(2))
    };
  }

  _calculateHours(horaEntrada, horaSalida) {
    if (!horaEntrada || !horaSalida) return 0;

    const entradaParts = horaEntrada.split(':').map(Number);
    const salidaParts = horaSalida.split(':').map(Number);

    const entradaMinutes = entradaParts[0] * 60 + entradaParts[1] + (entradaParts[2] || 0) / 60;
    const salidaMinutes = salidaParts[0] * 60 + salidaParts[1] + (salidaParts[2] || 0) / 60;

    const totalMinutes = salidaMinutes - entradaMinutes;
    return totalMinutes > 0 ? totalMinutes / 60 : 0;
  }
}

module.exports = new StatsService();
