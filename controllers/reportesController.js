// controllers/reportesController.js
const Assistance = require("../models/Assistance");
const Worker = require("../models/Worker");
const { Op } = require("sequelize");

/**
 * Calcula la diferencia en minutos entre dos horas 'HH:MM:SS'
 * Esta versión incluye segundos y redondea al minuto más cercano para el tiempo trabajado.
 * @param {string} hora1 - Hora final (hora_salida)
 * @param {string} hora2 - Hora inicial (hora_entrada)
 * @returns {number} Minutos de diferencia.
 */
function diffMinutos(hora1, hora2) {
  if (!hora1 || !hora2) return 0;

  const totalMinutos = (horaStr) => {
    // Convertir H:M:S a minutos totales con fracción de segundos
    const partes = horaStr.split(":").map(Number);
    const h = partes[0] || 0;
    const m = partes[1] || 0;
    const s = partes[2] || 0;
    
    return h * 60 + m + s / 60; 
  };
  
  const minutos1 = totalMinutos(hora1);
  const minutos2 = totalMinutos(hora2);

  // Redondeamos al minuto entero más cercano para el tiempo trabajado
  const diferencia = minutos1 - minutos2;
  return Math.round(diferencia);
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
        // Usamos la versión corregida de diffMinutos
        const minutos = diffMinutos(a.hora_salida, a.hora_entrada); 
        const horas = minutos > 0 ? minutos / 60 : 0;
        horasTrab = horas.toFixed(2); // Dejamos dos decimales para el reporte
        pagoDia = (horas * (a.Worker.salario_hora || 0)).toFixed(2);
      }
      // Añadimos las nuevas propiedades al objeto de asistencia (para el reporte)
      a.dataValues.horasTrabajadas = horasTrab; 
      a.dataValues.pagoDelDia = pagoDia;
    });

    res.json(asistencias);
  } catch (err) {
    console.error("getReportes error:", err);
    res.status(500).json({ ok: false, error: "Error al generar reportes" });
  }
};