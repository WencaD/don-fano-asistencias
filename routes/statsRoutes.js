// routes/statsRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware"); 
const isAdmin = require("../middlewares/isAdmin");               
const { getMonthlyHistory } = require("../controllers/assistanceController");
const {
  getDashboardStats,
  getStatsByPeriod,
  getWorkerDashboard, // <-- AGREGAMOS la nueva función
} = require("../controllers/statsController");

// Rutas de Administrador
router.get("/", authMiddleware, isAdmin, getDashboardStats); 
router.get("/period", authMiddleware, isAdmin, getStatsByPeriod);
router.get("/:id", authMiddleware, getMonthlyHistory); // Ruta existente

// =========================================================
// === NUEVA RUTA: DASHBOARD DEL TRABAJADOR
// =========================================================
router.get("/worker/:workerId", authMiddleware, getWorkerDashboard); 

module.exports = router;