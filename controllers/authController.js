const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Worker = require("../models/Worker");

// SECRETO
const SECRET = "supersecretkey";

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log("LOGIN REQUEST:", username, password);

    // Buscar usuario por username
    let user = await User.findOne({ where: { username } });

    // Si el admin no existe pero username es "admin",
    // hacemos fallback a ID=1 para compatibilidad
    if (!user && username === "admin") {
      user = await User.findByPk(1);
    }

    // Si no existe
    if (!user) {
      return res.status(400).json({ error: "Usuario o contraseña incorrecta" });
    }

    let match = false;

    // ==========================
    //        ADMIN LOGIN
    // ==========================
    if (user.role === "ADMIN") {
      // Caso 1: Admin por defecto con password texto plano (“123456”)
      if (user.password_hash === "123456" && password === "123456") {
        match = true;
      } else {
        // Caso 2: Admin ya cambió su contraseña (bcrypt)
        match = await bcrypt.compare(password, user.password_hash);
      }
    }

    // ==========================
    //      EMPLOYEE LOGIN
    // ==========================
    if (user.role === "WORKER") {
      match = await bcrypt.compare(password, user.password_hash);
    }

    if (!match) {
      return res.status(400).json({ error: "Contraseña incorrecta" });
    }

    // Obtener info del trabajador si es WORKER
    let workerData = null;
    if (user.role === "WORKER") {
      workerData = await Worker.findOne({
        where: { userId: user.id },
        attributes: ["id", "area", "qr_token"],
      });
    }

    // Generar JWT
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        workerId: workerData ? workerData.id : null,
      },
      SECRET,
      { expiresIn: "8h" }
    );

    // Respuesta final
    res.json({
      message: "Login exitoso",
      role: user.role,
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        role: user.role,
        workerId: workerData ? workerData.id : null,
        area: workerData ? workerData.area : null,
        qr_token: workerData ? workerData.qr_token : null,
      },
    });

  } catch (error) {
    console.error("❌ ERROR LOGIN:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

exports.logout = (req, res) => {
  res.json({ message: "Sesión cerrada" });
};
