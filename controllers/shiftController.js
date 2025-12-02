const Shift = require("../models/Shift");
const Worker = require("../models/Worker");

exports.createShift = async (req, res) => {
  try {
    const { workerId, fecha, hora_inicio, hora_fin } = req.body;

    if (!workerId || !fecha || !hora_inicio || !hora_fin) {
      return res.status(400).json({ error: "Faltan datos del turno" });
    }

    const shift = await Shift.create({
      workerId,
      fecha,
      hora_inicio,
      hora_fin,
    });

    res.status(201).json({ message: "Turno creado", shift });
  } catch (err) {
    console.error("createShift error:", err);
    res.status(500).json({ error: "Error al crear turno" });
  }
};

exports.getAllShifts = async (req, res) => {
  try {
    const shifts = await Shift.findAll({
      include: [{ model: Worker }],
      order: [["fecha", "DESC"], ["hora_inicio", "ASC"]],
    });
    res.json(shifts);
  } catch (err) {
    console.error("getAllShifts error:", err);
    res.status(500).json({ error: "Error al obtener turnos" });
  }
};

// NUEVO: Obtener turnos de un trabajador específico
exports.getShiftsByWorker = async (req, res) => {
  try {
    const { id } = req.params; // ID del trabajador
    const shifts = await Shift.findAll({
      where: { workerId: id },
      order: [["fecha", "ASC"], ["hora_inicio", "ASC"]],
    });
    res.json(shifts);
  } catch (err) {
    console.error("getShiftsByWorker error:", err);
    res.status(500).json({ error: "Error al obtener mis turnos" });
  }
};

exports.deleteShift = async (req, res) => {
  try {
    const shift = await Shift.findByPk(req.params.id);
    if (!shift) return res.status(404).json({ error: "No existe" });

    await shift.destroy();
    res.json({ message: "Turno eliminado" });
  } catch (err) {
    console.error("deleteShift error:", err);
    res.status(500).json({ error: "Error al eliminar turno" });
  }
};