// controllers/reportesController.js
const Assistance = require("../models/Assistance");
const Worker = require("../models/Worker");
const { Op } = require("sequelize");

function diffMinutos(h1, h2) {
  if (!h1 || !h2) return 0;
  const [aH, aM] = h1.split(":").map(Number);
  const [bH, bM] = h2.split(":").map(Number);
  return (aH * 60 + aM) - (bH * 60 + bM);
}

exports.getReportes = async (req, res) => {
  try {
    const { desde, hasta, workerId } = req.body;

    if (!desde || !hasta) {
      return res.status(400).json({ ok: false, error: "Rango de fechas requerido" });
    }

    const where = {
      fecha: { [Op.between]: [desde, hasta] },
    };
    if (workerId) where.workerId = workerId;

    const asistencias = await Assistance.findAll({
      where,
      include: [{ model: Worker }],
      order: [["fecha", "ASC"], ["hora_entrada", "ASC"]],
    });

    // Agregamos campos calculados
    asistencias.forEach((a) => {
      let horasTrab = 0;
      let pagoDia = 0;

      if (a.hora_entrada && a.hora_salida && a.Worker) {
        const minutos = diffMinutos(a.hora_salida, a.hora_entrada);
        if (minutos > 0) {
          horasTrab = minutos / 60;
          pagoDia = horasTrab * (a.Worker.salario_hora || 0);
        }
      }

      a.dataValues.horas_trabajadas = horasTrab;
      a.dataValues.pago_dia = pagoDia;
    });

    res.json(asistencias);
  } catch (err) {
    console.error("getReportes error:", err);
    res.status(500).json({ ok: false, error: "Error al obtener reportes" });
  }
};
