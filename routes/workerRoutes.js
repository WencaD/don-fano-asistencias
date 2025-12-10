// Rutas de gestión de trabajadores
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware"); 
const isAdmin = require("../middlewares/isAdmin");               
const { createWorker, getAllWorkers, getWorkerById, updateWorker, deleteWorker } = require("../controllers/workerController");

router.get("/all", authMiddleware, isAdmin, getAllWorkers);
router.post("/create", authMiddleware, isAdmin, createWorker);
router.get("/:id", authMiddleware, isAdmin, getWorkerById);
router.put("/:id", authMiddleware, isAdmin, updateWorker);
router.delete("/:id", authMiddleware, isAdmin, deleteWorker);

module.exports = router;