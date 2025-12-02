// routes/statsRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware"); 
const isAdmin = require("../middlewares/isAdmin");               
const { getMonthlyHistory } = require("../controllers/assistanceController");
const {
  getDashboardStats,
  getStatsByPeriod,
} = require("../controllers/statsController");

router.get("/", authMiddleware, isAdmin, getDashboardStats); // Protegida
router.get("/period", authMiddleware, isAdmin, getStatsByPeriod); // Protegida
router.get("/:id", authMiddleware, getMonthlyHistory)

module.exports = router;