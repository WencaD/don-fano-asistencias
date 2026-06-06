// Controlador HTTP para registro de asistencias — Marcación de entrada/salida, historial y estadísticas

const assistanceService = require("../services/assistanceService");
const timeHelper = require("../utils/timeHelper");

exports.markAssistance = async (req, res) => {
  try {
    const { qr_token } = req.body;
    
    if (!qr_token) {
      return res.status(400).json({ ok: false, error: "QR requerido" });
    }

    const result = await assistanceService.markAssistance(qr_token);
    
    if (result.type === "entrada") {
      return res.json({ 
        ok: true, 
        message: `Entrada registrada (${result.estado})`, 
        asistencia: result.assistance 
      });
    } else if (result.type === "salida") {
      return res.json({ 
        ok: true, 
        message: "Salida registrada", 
        asistencia: result.assistance 
      });
    } else if (result.type === "completa") {
      return res.json({ 
        ok: true, 
        message: result.message,
        asistencia: result.assistance,
        completa: true
      });
    }
  } catch (error) {
    console.error("markAssistance error:", error);
    res.status(400).json({ ok: false, error: error.message });
  }
};

exports.getTodayAssistance = async (req, res) => {
  try {
    const workerId = req.params.id;
    const asistencias = await assistanceService.getAllAssistances();
    const hoy = timeHelper.getCurrentDate();
    
    let asistenciasHoy = asistencias.filter(a => a.fecha === hoy);
    if (workerId) {
      asistenciasHoy = asistenciasHoy.filter(a => String(a.workerId) === String(workerId));
    }
    res.json(asistenciasHoy);
  } catch (error) {
    console.error("getTodayAssistance error:", error);
    res.status(500).json({ ok: false, error: "Error al obtener asistencias de hoy" });
  }
};

exports.getMonthlyHistory = async (req, res) => {
  try {
    const workerId = req.params.id;
    const dateStr = timeHelper.getCurrentDate();
    const [year, month] = dateStr.split("-");
    const desde = `${year}-${month}-01`;
    const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
    const hasta = `${year}-${month}-${String(lastDay).padStart(2, '0')}`;

    const asistencias = await assistanceService.getWorkerAssistances(workerId);
    
    const asistenciasMes = asistencias.filter(a => 
      a.fecha >= desde && a.fecha <= hasta
    );

    let totalMinTarde = 0;
    let totalHoras = 0;
    let totalPago = 0;

    asistenciasMes.forEach((a) => {
      totalMinTarde += a.minutos_tarde || 0;

      if (a.hora_entrada && a.hora_salida && a.Worker) {
        const diffMs = new Date(`2000-01-01 ${a.hora_salida}`) - new Date(`2000-01-01 ${a.hora_entrada}`);
        const horas = diffMs / (1000 * 60 * 60);
        totalHoras += horas;
        totalPago += horas * (a.Worker.salario_hora || 0);
      }
    });

    res.json({
      resumen: {
        dias_asistidos: asistenciasMes.length,
        total_minutos_tarde: totalMinTarde,
        total_horas_trabajadas: totalHoras,
        total_pago: totalPago,
      },
      asistencias: asistenciasMes,
    });
  } catch (error) {
    console.error("getMonthlyHistory error:", error);
    res.status(500).json({ ok: false, error: "Error al obtener historial mensual" });
  }
};