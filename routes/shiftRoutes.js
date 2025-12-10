// routes/shiftRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware"); 
const isAdmin = require("../middlewares/isAdmin");               

const {
  createShift,
  getAllShifts,
  deleteShift,
  getShiftsByWorker
} = require("../controllers/shiftController");

// Rutas Admin
router.get("/", authMiddleware, isAdmin, getAllShifts);
router.post("/create", authMiddleware, isAdmin, createShift);
router.delete("/:id", authMiddleware, isAdmin, deleteShift);

// Ruta Empleado (Solo requiere estar logueado)
router.get("/worker/:id", authMiddleware, getShiftsByWorker);

module.exports = router;