// Controlador HTTP para registro de asistencias
const assistanceService = require("../services/assistanceService");
const { Op } = require("sequelize");

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
    const asistencias = await assistanceService.getAllAssistances();
    const hoy = new Date().toISOString().split("T")[0];
    
    const asistenciasHoy = asistencias.filter(a => a.fecha === hoy);
    res.json(asistenciasHoy);
  } catch (error) {
    console.error("getTodayAssistance error:", error);
    res.status(500).json({ ok: false, error: "Error al obtener asistencias de hoy" });
  }
};

exports.getMonthlyHistory = async (req, res) => {
  try {
    const workerId = req.params.id;
    const hoy = new Date();
    const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const fin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

    const desde = inicio.toISOString().split("T")[0];
    const hasta = fin.toISOString().split("T")[0];

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