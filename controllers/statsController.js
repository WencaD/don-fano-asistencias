// controllers/statsController.js
const Assistance = require("../models/Assistance");
const Worker = require("../models/Worker");
const Shift = require("../models/Shift"); // <-- ASUMO que tienes el modelo Shift aquí
const { Op } = require("sequelize");
const sequelize = require("sequelize"); // Para funciones de agregación (COUNT, SUM)

function hoyStr() {
  return new Date().toISOString().split("T")[0];
}

// ----------------------------------------------------
// (Mantenemos las funciones existentes para el Admin)
// ----------------------------------------------------

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
    const hoy = hoyStr();

    let desde;
    let hasta = hoy;

    // ... (El resto de la lógica de getStatsByPeriod se mantiene)
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
      faltas.push(totalTrabajadores - (mapAsistencias[k] || 0));
      minutosTarde.push(mapMinutos[k] || 0);
    }
    
    // ... (El resto del código de getStatsByPeriod)

    res.json({ labels, tardanzas, minutosTarde, faltas });
  } catch (err) {
    console.error("getStatsByPeriod error:", err);
    res.status(500).json({ ok: false, error: "Error obteniendo estadísticas" });
  }
};


// =========================================================================
// === FUNCIÓN CLAVE: DASHBOARD DEL EMPLEADO
// =========================================================================
exports.getWorkerDashboard = async (req, res) => {
    try {
        // Obtenemos el workerId de la ruta
        const workerId = req.params.workerId;
        const today = hoyStr();
        const firstDayOfMonth = today.slice(0, 7) + '-01'; // 'YYYY-MM-01'

        if (!workerId) {
            return res.status(400).json({ error: "Worker ID es requerido." });
        }

        // 1. ASISTENCIA DE HOY
        const todayAssistance = await Assistance.findOne({
            where: { workerId, fecha: today },
            order: [['hora_entrada', 'DESC']]
        });

        // 2. CÁLCULO DE ESTADÍSTICAS MENSUALES
        const monthlyStats = await Assistance.findOne({
            where: {
                workerId,
                fecha: { [Op.gte]: firstDayOfMonth }
            },
            attributes: [
                [sequelize.fn('COUNT', sequelize.literal('DISTINCT fecha')), 'diasAsistidos'],
                [sequelize.fn('SUM', sequelize.col('minutos_tarde')), 'minutosTarde'],
            ],
            raw: true
        });

        // 3. PRÓXIMOS TURNOS (los 5 siguientes a hoy)
        const nextShifts = await Shift.findAll({
            where: {
                workerId,
                fecha: { [Op.gte]: today }
            },
            order: [['fecha', 'ASC'], ['hora_inicio', 'ASC']],
            limit: 5
        });

        // 4. HISTORIAL (Últimas 10 asistencias del mes)
        const history = await Assistance.findAll({
            where: {
                workerId,
                fecha: { [Op.gte]: firstDayOfMonth }
            },
            order: [['fecha', 'DESC'], ['hora_entrada', 'DESC']],
            limit: 10
        });

        // 5. Devolver todos los datos al frontend
        res.json({
            todayAssistance: todayAssistance || null,
            monthlyStats: {
                diasAsistidos: monthlyStats.diasAsistidos || 0,
                minutosTarde: monthlyStats.minutosTarde || 0,
                pagoEstimado: 0.00 // Deberías calcular esto en tu backend si conoces el sueldo
            },
            nextShifts,
            history,
        });

    } catch (err) {
        console.error("getWorkerDashboard error:", err);
        res.status(500).json({ ok: false, error: "Error obteniendo datos del dashboard" });
    }
};