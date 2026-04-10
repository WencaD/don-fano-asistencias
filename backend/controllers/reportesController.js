// Controlador HTTP para generación de reportes
const reportService = require("../services/reportService");

exports.getReportes = async (req, res) => {
  try {
    const reportes = await reportService.generateReport(req.body);
    res.json(reportes);
  } catch (error) {
    console.error("getReportes error:", error);
    res.status(400).json({ ok: false, error: error.message });
  }
};