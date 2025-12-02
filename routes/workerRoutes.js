// routes/workerRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware"); 
const isAdmin = require("../middlewares/isAdmin");               
const { createWorker, getAllWorkers, getWorkerById, updateWorker, deleteWorker } = require("../controllers/workerController");

router.get("/all", authMiddleware, isAdmin, getAllWorkers);

// === CORRECCIÓN CLAVE: AÑADIR LA RUTA /create PARA QUE COINCIDA CON EL FRONTEND ===
router.post("/create", authMiddleware, isAdmin, createWorker); // <-- ¡AÑADIR ESTA LÍNEA!
// router.post("/", authMiddleware, isAdmin, createWorker); // <-- Ya existe, pero se solapa.
// =================================================================================

router.get("/:id", authMiddleware, isAdmin, getWorkerById);
router.put("/:id", authMiddleware, isAdmin, updateWorker);
router.delete("/:id", authMiddleware, isAdmin, deleteWorker);

module.exports = router;