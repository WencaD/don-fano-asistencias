// Controlador HTTP para gestión de trabajadores
const workerService = require("../services/workerService");

exports.getAllWorkers = async (req, res) => {
  try {
    const workers = await workerService.getAllWorkers();
    res.json(workers);
  } catch (error) {
    console.error("Error getAllWorkers:", error);
    res.status(500).json({ error: "Error obteniendo trabajadores" });
  }
};

exports.createWorker = async (req, res) => {
  try {
    const result = await workerService.createWorker(req.body);
    res.json({
      message: "Trabajador creado correctamente",
      user: result.user,
      worker: result.worker,
    });
  } catch (error) {
    console.error("Error createWorker:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.getWorkerById = async (req, res) => {
  try {
    const worker = await workerService.getWorkerById(req.params.id);
    res.json(worker);
  } catch (error) {
    console.error("Error getWorkerById:", error);
    res.status(404).json({ error: error.message });
  }
};

exports.updateWorker = async (req, res) => {
  try {
    const worker = await workerService.updateWorker(req.params.id, req.body);
    res.json({ message: "Trabajador actualizado", worker });
  } catch (error) {
    console.error("Error updateWorker:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.deleteWorker = async (req, res) => {
  try {
    await workerService.deleteWorker(req.params.id);
    res.json({ message: "Trabajador eliminado" });
  } catch (error) {
    console.error("Error deleteWorker:", error);
    res.status(400).json({ error: error.message });
  }
};