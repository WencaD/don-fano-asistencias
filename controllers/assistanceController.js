// controllers/assistanceController.js
const Assistance = require("../models/Assistance");
const Worker = require("../models/Worker");
const { Op } = require("sequelize");

// calcula diferencia de minutos entre dos horas "HH:MM:SS"
function diffMinutos(hora1, hora2) {
  const [h1, m1] = hora1.split(":").map(Number);
  const [h2, m2] = hora2.split(":").map(Number);
  return (h1 * 60 + m1) - (h2 * 60 + m2);
}

// MARCAR ASISTENCIA CON QR TOKEN DEL WORKER
exports.markAssistance = async (req, res) => {
  try {
    const { qr_token } = req.body;
    if (!qr_token) {
      return res.status(400).json({ ok: false, error: "QR requerido" });
    }

    const worker = await Worker.findOne({ where: { qr_token } });
    if (!worker) {
      return res
        .status(404)
        .json({ ok: false, error: "QR inválido o trabajador no encontrado" });
    }

    const now = new Date();
    const fecha = now.toISOString().split("T")[0];
    const hora = now.toTimeString().split(" ")[0];

    let asistencia = await Assistance.findOne({
      where: { workerId: worker.id, fecha },
    });

    if (!asistencia) {
      // Registrar entrada
      const horaLimite = "09:00:00"; // tu hora oficial de ingreso
      let estado = "Puntual";
      let minutos_tarde = 0;

      if (hora > horaLimite) {
        minutos_tarde = diffMinutos(hora, horaLimite);
        if (minutos_tarde < 0) minutos_tarde = 0;
        estado = "Tardanza";
      }

      asistencia = await Assistance.create({
        fecha,
        hora_entrada: hora,
        estado,
        minutos_tarde,
        workerId: worker.id,
      });

      return res.json({ ok: true, message: "Entrada registrada", asistencia });
    } else if (!asistencia.hora_salida) {
      // Registrar salida
      asistencia.hora_salida = hora;
      await asistencia.save();

      return res.json({ ok: true, message: "Salida registrada", asistencia });
    } else {
      return res.json({
        ok: true,
        message: "La asistencia de hoy ya está completa",
        asistencia,
      });
    }
  } catch (err) {
    console.error("markAssistance error:", err);
    res.status(500).json({ ok: false, error: "Error al marcar asistencia" });
  }
};

// Asistencias de hoy para dashboard
exports.getTodayAssistance = async (req, res) => {
  try {
    const hoy = new Date().toISOString().split("T")[0];

    const asistencias = await Assistance.findAll({
      where: { fecha: hoy },
      include: [{ model: Worker }],
      order: [["hora_entrada", "ASC"]],
    });

    res.json(asistencias);
  } catch (err) {
    console.error("getTodayAssistance error:", err);
    res.status(500).json({ ok: false, error: "Error al obtener asistencias de hoy" });
  }
};

// Historial mensual de un worker (por si lo usas en dashboard de empleado)
exports.getMonthlyHistory = async (req, res) => {
  try {
    const workerId = req.params.id;
    const hoy = new Date();
    const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const fin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

    const desde = inicio.toISOString().split("T")[0];
    const hasta = fin.toISOString().split("T")[0];

    const asistencias = await Assistance.findAll({
      where: {
        workerId,
        fecha: { [Op.between]: [desde, hasta] },
      },
      include: [{ model: Worker }],
      order: [["fecha", "ASC"]],
    });

    let totalMinTarde = 0;
    let totalHoras = 0;
    let totalPago = 0;

    asistencias.forEach((a) => {
      totalMinTarde += a.minutos_tarde || 0;

      if (a.hora_entrada && a.hora_salida && a.Worker) {
        const minutos = diffMinutos(a.hora_salida, a.hora_entrada);
        const horas = minutos > 0 ? minutos / 60 : 0;
        totalHoras += horas;
        totalPago += horas * (a.Worker.salario_hora || 0);
      }
    });

    res.json({
      resumen: {
        dias_asistidos: asistencias.length,
        total_minutos_tarde: totalMinTarde,
        total_horas_trabajadas: totalHoras,
        total_pago: totalPago,
      },
      asistencias,
    });
  } catch (err) {
    console.error("getMonthlyHistory error:", err);
    res.status(500).json({ ok: false, error: "Error al obtener historial mensual" });
  }
};
