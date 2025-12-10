const express = require("express");
const router = express.Router();
const qrService = require("../service/qrService");
const assistanceController = require("../controllers/assistanceController");
const Worker = require("../models/Worker");

router.get("/current", (req, res) => {
  const actual = qrService.getCodigoActual();
  res.json(actual);
});

router.post("/mark", async (req, res) => {
  try {
    const { workerId, codigo } = req.body;

    if (!workerId || !codigo) {
      return res.status(400).json({ error: "Faltan datos" });
    }

    const actual = qrService.getCodigoActual();

    if (codigo !== actual.codigo) {
      return res.status(400).json({ error: "Código inválido o expirado" });
    }

    const worker = await Worker.findByPk(workerId);
    if (!worker || !worker.qr_token) {
      return res.status(404).json({ error: "Trabajador no encontrado o sin QR" });
    }

    req.body.qr_token = worker.qr_token;
    return assistanceController.markAssistance(req, res);
  } catch (err) {
    console.error("qr mark error:", err);
    res.status(500).json({ error: "Error al procesar QR" });
  }
});

module.exports = router;
