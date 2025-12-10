const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const isAdmin = require("../middlewares/isAdmin");
const { getMonthlyHistory } = require("../controllers/assistanceController");
const {
  getDashboardStats,
  getStatsByPeriod,
  getWorkerDashboard,
} = require("../controllers/statsController");

router.get("/", authMiddleware, isAdmin, getDashboardStats);
router.get("/period", authMiddleware, isAdmin, getStatsByPeriod);
router.get("/worker/:workerId", authMiddleware, getWorkerDashboard);
router.get("/:id", authMiddleware, getMonthlyHistory);

module.exports = router;