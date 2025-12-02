// controllers/workerController.js
const bcrypt = require("bcrypt");
const sequelize = require("../config/db");
const User = require("../models/User");
const Worker = require("../models/Worker");

// Helper para token de QR simple
function generarQRToken() {
  return "qr_" + Math.random().toString(36).substring(2, 12);
}

// GET /api/workers/all (CORREGIDO)
exports.getAllWorkers = async (req, res) => {
  try {
    const workers = await Worker.findAll({
      // Incluir el modelo User. Sequelize lo vincula automáticamente por la FK.
      include: [
        {
          model: User, 
          // NOTA: 'as' no es necesario aquí si la asociación es simple
          attributes: ["id", "username", "email", "role"],
        },
      ],
      order: [["id", "ASC"]],
    });

    res.json(workers);
  } catch (err) {
    console.error("Error getAllWorkers:", err);
    // Si la consulta falla (SQL), este es el error que verá el frontend
    res.status(500).json({ error: "Error obteniendo trabajadores" });
  }
};

// POST /api/workers/create (SE ASUME QUE EL ROL SE TRADUCE EN EL FRONTEND)
exports.createWorker = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { nombre, dni, correo, area, rol, salario_hora } = req.body;

    if (!nombre || !dni || !correo || !area || !rol) {
      return res
        .status(400)
        .json({ error: "Faltan campos obligatorios del trabajador" });
    }

    // username = dni, password = dni
    const username = dni.trim();
    const plainPassword = dni.trim();
    const hash = await bcrypt.hash(plainPassword, 10);

    // Rol del user en tabla users (ASUMIMOS QUE EL FRONTEND ENVÍA "ADMIN" O "WORKER")
    // OJO: Si el frontend envía "Empleado", el controlador de users debe traducirlo.
    const userRole = (rol === "Administrador" || rol === "ADMIN") ? "ADMIN" : "WORKER";

    // Crear usuario
    const user = await User.create(
      {
        nombre,
        username,
        email: correo,
        password_hash: hash,
        role: userRole, // Usa el rol validado
      },
      { transaction: t }
    );

    // Crear trabajador
    const worker = await Worker.create(
      {
        nombre,
        dni,
        correo,
        area,
        rol,
        salario_hora: salario_hora || 0,
        qr_token: generarQRToken(),
        userId: user.id,
      },
      { transaction: t }
    );

    await t.commit();

    res.json({
      message: "Trabajador creado correctamente",
      user,
      worker,
    });
  } catch (err) {
    console.error("Error createWorker:", err);
    await t.rollback();
    res.status(500).json({ error: "Error creando trabajador" });
  }
};

// ... (Resto de funciones getWorkerById, updateWorker, deleteWorker) ...

exports.getWorkerById = async (req, res) => {
  try {
    const worker = await Worker.findByPk(req.params.id, {
      include: [{ model: User, attributes: ["id", "username", "email", "role"] }],
    });

    if (!worker) return res.status(404).json({ error: "Trabajador no encontrado" });

    res.json(worker);
  } catch (err) {
    console.error("Error getWorkerById:", err);
    res.status(500).json({ error: "Error obteniendo trabajador" });
  }
};

exports.updateWorker = async (req, res) => {
  try {
    const { nombre, dni, correo, area, rol, salario_hora } = req.body;

    const worker = await Worker.findByPk(req.params.id);
    if (!worker) return res.status(404).json({ error: "Trabajador no encontrado" });

    await worker.update({
      nombre: nombre ?? worker.nombre,
      dni: dni ?? worker.dni,
      correo: correo ?? worker.correo,
      area: area ?? worker.area,
      rol: rol ?? worker.rol,
      salario_hora: salario_hora ?? worker.salario_hora,
    });

    res.json({ message: "Trabajador actualizado", worker });
  } catch (err) {
    console.error("Error updateWorker:", err);
    res.status(500).json({ error: "Error actualizando trabajador" });
  }
};

exports.deleteWorker = async (req, res) => {
  try {
    const worker = await Worker.findByPk(req.params.id);
    if (!worker) return res.status(404).json({ error: "Trabajador no encontrado" });

    const userId = worker.userId;

    await worker.destroy();

    if (userId) {
      await User.destroy({ where: { id: userId } });
    }

    res.json({ message: "Trabajador eliminado" });
  } catch (err) {
    console.error("Error deleteWorker:", err);
    res.status(500).json({ error: "Error eliminando trabajador" });
  }
};