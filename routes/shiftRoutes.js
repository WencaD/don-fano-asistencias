// routes/shiftRoutes.js (CORREGIDO)
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

// Rutas Admin (se mantienen)
router.get("/", authMiddleware, isAdmin, getAllShifts);
router.post("/create", authMiddleware, isAdmin, createShift);
router.delete("/:id", authMiddleware, isAdmin, deleteShift);

// Ruta Empleado: Solo requiere estar logueado (authMiddleware)
router.get("/worker/:id", authMiddleware, getShiftsByWorker); // <-- Asegurar con authMiddleware

module.exports = router;