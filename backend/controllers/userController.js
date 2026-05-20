// Controlador HTTP para gestión de usuarios
const workerService = require("../services/workerService");
const userRepository = require("../repositories/userRepository");

exports.createUser = async (req, res) => {
  try {
    const result = await workerService.createWorker(req.body);
    res.status(201).json({ 
      ok: true, 
      message: "Trabajador creado correctamente", 
      worker: result.worker 
    });
  } catch (error) {
    console.error("createUser error:", error);
    res.status(400).json({ ok: false, error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const catalogService = require("../services/catalogService");
    const users = await userRepository.findAll({
      include: [{ model: require("../models/Worker") }],
      order: [["id", "ASC"]],
    });

    const mappedUsers = await Promise.all(users.map(async (u) => {
      const plainUser = u.get({ plain: true });
      if (plainUser.Worker) {
        plainUser.Worker.area = await catalogService.getAreaName(plainUser.Worker.area);
        plainUser.Worker.rol = await catalogService.getCargoName(plainUser.Worker.rol);
      }
      return plainUser;
    }));

    res.json(mappedUsers);
  } catch (error) {
    console.error("getAllUsers error:", error);
    res.status(500).json({ ok: false, error: "Error al obtener usuarios" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deleted = await userRepository.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ ok: false, error: "Usuario no encontrado" });
    }
    res.json({ ok: true, message: "Usuario eliminado" });
  } catch (error) {
    console.error("deleteUser error:", error);
    res.status(500).json({ ok: false, error: "Error al eliminar usuario" });
  }
};