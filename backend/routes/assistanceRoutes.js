const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const {
  markAssistance,
  getTodayAssistance,
  getMonthlyHistory
} = require("../controllers/assistanceController");

router.get("/today", authMiddleware, getTodayAssistance);
router.get("/today/:id", authMiddleware, getTodayAssistance); // Obtener asistencia de hoy de un trabajador específico
router.get("/history/:id", authMiddleware, getMonthlyHistory);
router.post("/mark", authMiddleware, markAssistance);

module.exports = router;
