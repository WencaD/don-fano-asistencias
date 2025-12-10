// Controlador HTTP para gestión de turnos
const shiftService = require("../services/shiftService");

exports.createShift = async (req, res) => {
  try {
    const shift = await shiftService.createShift(req.body);
    res.status(201).json({ message: "Turno creado", shift });
  } catch (error) {
    console.error("createShift error:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.getAllShifts = async (req, res) => {
  try {
    const shifts = await shiftService.getAllShifts();
    res.json(shifts);
  } catch (error) {
    console.error("getAllShifts error:", error);
    res.status(500).json({ error: "Error al obtener turnos" });
  }
};

exports.getShiftsByWorker = async (req, res) => {
  try {
    const { id } = req.params;
    const shifts = await shiftService.getShiftsByWorker(id);
    res.json(shifts);
  } catch (error) {
    console.error("getShiftsByWorker error:", error);
    res.status(500).json({ error: "Error al obtener mis turnos" });
  }
};

exports.deleteShift = async (req, res) => {
  try {
    await shiftService.deleteShift(req.params.id);
    res.json({ message: "Turno eliminado" });
  } catch (error) {
    console.error("deleteShift error:", error);
    res.status(400).json({ error: error.message });
  }
};