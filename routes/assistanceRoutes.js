const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const {
  markAssistance,
  getTodayAssistance,
  getMonthlyHistory
} = require("../controllers/assistanceController");

router.get("/today", authMiddleware, getTodayAssistance);
router.get("/history/:id", authMiddleware, getMonthlyHistory);
router.post("/mark", authMiddleware, markAssistance);

module.exports = router;

router.get("/today/:id", authMiddleware, async (req, res) => {
    const Assistance = require("../models/Assistance");
    const { id } = req.params;

    try {
        const hoy = new Date().toISOString().split("T")[0];

        const asistencia = await Assistance.findOne({
            where: { workerId: id, fecha: hoy }
        });

        res.json(asistencia || {});
    } catch (err) {
        console.error("today error:", err);
        res.status(500).json({ ok: false, error: "Error cargando estado de hoy" });
    }
});
