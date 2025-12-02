// controllers/userController.js
const User = require("../models/User");
const Worker = require("../models/Worker");
const bcrypt = require("bcrypt");
const sequelize = require("../config/db");

function generarQrToken() {
  return Math.random().toString(36).slice(2, 12);
}

exports.createUser = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { nombre, dni, correo, area, rol, salario_hora } = req.body;

    if (!nombre || !dni || !correo || !area || !rol) {
      await t.rollback();
      return res.status(400).json({ ok: false, error: "Faltan datos obligatorios" });
    }

    const username = dni.trim();
    const plainPassword = dni.trim();
    
    // Verificación de unicidad
    const existeUser = await User.findOne({ where: { username } });
    if (existeUser) {
      await t.rollback();
      return res.status(400).json({ ok: false, error: "Ya existe un usuario con ese DNI" });
    }
    
    const existeCorreo = await User.findOne({ where: { email: correo } });
    if (existeCorreo) {
      await t.rollback();
      return res.status(400).json({ ok: false, error: "El correo ya está registrado" });
    }
    
    // TRADUCCIÓN DE ROL: Frontend -> DB
    const roleDB = (rol === "Administrador") ? "ADMIN" : "WORKER";
    const password_hash = await bcrypt.hash(plainPassword, 10);
    
    // CREAR USER
    const user = await User.create({
      nombre, username, email: correo, password_hash, role: roleDB,
    }, { transaction: t });

    // CREAR WORKER
    const worker = await Worker.create({
      nombre, dni, correo, area, rol: rol, 
      salario_hora: salario_hora || 0,
      qr_token: generarQrToken(),
      userId: user.id,
    }, { transaction: t });

    await t.commit(); 
    res.status(201).json({ ok: true, message: "Trabajador creado correctamente", worker });

  } catch (err) {
    await t.rollback(); 
    let userErrorMessage = "Error de BD: " + (err.parent ? err.parent.sqlMessage : err.message);
    console.error("createUser error:", err);
    res.status(500).json({ ok: false, error: userErrorMessage });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      // Incluimos Worker para saber quién es empleado y quién no
      include: [{ model: Worker }],
      order: [["id", "ASC"]],
    });
    res.json(users);
  } catch (err) {
    console.error("getAllUsers error:", err);
    res.status(500).json({ ok: false, error: "Error al obtener usuarios" });
  }
};
// ... (El resto de funciones como getAllUsers, deleteUser, etc. deben estar en el archivo)

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{ model: Worker }],
      order: [["id", "ASC"]],
    });
    res.json(users);
  } catch (err) {
    console.error("getAllUsers error:", err);
    res.status(500).json({ ok: false, error: "Error al obtener usuarios" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ ok: false, error: "Usuario no encontrado" });

    await user.destroy(); 
    res.json({ ok: true, message: "Usuario eliminado" });
  } catch (err) {
    console.error("deleteUser error:", err);
    res.status(500).json({ ok: false, error: "Error al eliminar usuario" });
  }
};