// Controlador HTTP para estadísticas y dashboards
const statsService = require("../services/statsService");

exports.getDashboardStats = async (req, res) => {
  try {
    const stats = await statsService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    console.error("getDashboardStats error:", error);
    res.status(500).json({ ok: false, error: "Error obteniendo estadísticas" });
  }
};

exports.getStatsByPeriod = async (req, res) => {
  try {
    const period = req.query.period || "week";
    const stats = await statsService.getStatsByPeriod(period);
    res.json(stats);
  } catch (error) {
    console.error("getStatsByPeriod error:", error);
    res.status(500).json({ ok: false, error: "Error obteniendo estadísticas" });
  }
};

exports.getWorkerDashboard = async (req, res) => {
  try {
    const workerId = req.params.workerId;
    
    if (!workerId) {
      return res.status(400).json({ error: "Worker ID es requerido." });
    }

    const dashboard = await statsService.getWorkerDashboard(workerId);
    res.json(dashboard);
  } catch (error) {
    console.error("getWorkerDashboard error:", error);
    res.status(400).json({ ok: false, error: error.message });
  }
};