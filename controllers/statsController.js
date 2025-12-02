// controllers/statsController.js
const Assistance = require("../models/Assistance");
const Worker = require("../models/Worker");
const { Op } = require("sequelize");

function hoyStr() {
  return new Date().toISOString().split("T")[0];
}

exports.getDashboardStats = async (req, res) => {
  try {
    const today = hoyStr();

    const totalTrabajadores = await Worker.count();

    const asistenciasHoy = await Assistance.findAll({
      where: { fecha: today },
    });

    const empleadosActivos = asistenciasHoy.filter(
      (a) => a.hora_entrada && !a.hora_salida
    ).length;

    const entradasHoy = asistenciasHoy.filter((a) => a.hora_entrada).length;
    const salidasHoy = asistenciasHoy.filter((a) => a.hora_salida).length;

    res.json({
      totalTrabajadores,
      empleadosActivos,
      entradasHoy,
      salidasHoy,
    });
  } catch (err) {
    console.error("getDashboardStats error:", err);
    res.status(500).json({ ok: false, error: "Error obteniendo estadísticas" });
  }
};

exports.getStatsByPeriod = async (req, res) => {
  try {
    const period = req.query.period || "week";
    const hoy = new Date();
    const inicio = new Date(hoy);

    if (period === "week") {
      inicio.setDate(hoy.getDate() - 6);
    } else if (period === "month") {
      inicio.setMonth(hoy.getMonth() - 1);
    } else if (period === "year") {
      inicio.setFullYear(hoy.getFullYear() - 1);
    }

    const desde = inicio.toISOString().split("T")[0];
    const hasta = hoy.toISOString().split("T")[0];

    const totalTrabajadores = await Worker.count();

    const asistencias = await Assistance.findAll({
      where: {
        fecha: { [Op.between]: [desde, hasta] },
      },
    });

    const mapTardanzas = {};
    const mapMinutos = {};
    const mapAsistencias = {};

    for (const a of asistencias) {
      const f = a.fecha;
      if (!mapTardanzas[f]) {
        mapTardanzas[f] = 0;
        mapMinutos[f] = 0;
        mapAsistencias[f] = 0;
      }
      if (a.estado === "Tardanza") mapTardanzas[f]++;
      mapMinutos[f] += a.minutos_tarde || 0;
      mapAsistencias[f]++;
    }

    const labels = [];
    const tardanzas = [];
    const minutosTarde = [];
    const faltas = [];

    const d0 = new Date(desde);
    const dEnd = new Date(hasta);

    for (let d = new Date(d0); d <= dEnd; d.setDate(d.getDate() + 1)) {
      const k = d.toISOString().split("T")[0];
      labels.push(k.slice(5)); // MM-DD
      tardanzas.push(mapTardanzas[k] || 0);
      minutosTarde.push(mapMinutos[k] || 0);
      const asis = mapAsistencias[k] || 0;
      const f = totalTrabajadores - asis;
      faltas.push(f > 0 ? f : 0);
    }

    res.json({
      ok: true,
      period,
      labels,
      tardanzas,
      minutosTarde,
      faltas,
      totalTrabajadores,
    });
  } catch (err) {
    console.error("getStatsByPeriod error:", err);
    res.status(500).json({ ok: false, error: "Error en estadísticas por período" });
  }
};
