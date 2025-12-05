const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Worker = require("../models/Worker");

// SECRETO - IMPORTANTE: Este secreto debe estar en una variable de entorno (ej: .env)
const SECRET = "supersecretkey"; // ⚠️ Reemplazar con process.env.JWT_SECRET

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Buscar usuario por username
    let user = await User.findOne({ where: { username } });

    // ⚠️ SUGERENCIA: Elimina el fallback a ID=1. Si el admin no existe, que falle.
    // if (!user && username === "admin") {
    //   user = await User.findByPk(1);
    // }

    // 2. Si no existe el usuario
    if (!user) {
      return res.status(400).json({ error: "Usuario o contraseña incorrecta" });
    }
    
    // 3. COMPARACIÓN UNIVERSAL DE CONTRASEÑA (Segura)
    // Se usa bcrypt.compare() para CUALQUIER rol, asumiendo que el password_hash es un hash de bcrypt.
    const match = await bcrypt.compare(password, user.password_hash);
    
    // Si la contraseña no coincide
    if (!match) {
      return res.status(400).json({ error: "Contraseña incorrecta" });
    }

    // 4. Obtener info del trabajador si es WORKER
    let workerData = null;
    if (user.role === "WORKER") {
      workerData = await Worker.findOne({
        where: { userId: user.id },
        attributes: ["id", "area", "qr_token"],
      });
    }

    // 5. Generar JWT
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        workerId: workerData ? workerData.id : null,
      },
      SECRET, // Usar process.env.JWT_SECRET en producción
      { expiresIn: "8h" }
    );

    // 6. Respuesta final
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
      },
    });
  } catch (error) {
    console.error("Error en el login:", error);
    res.status(500).json({ error: "Error del servidor al iniciar sesión" });
  }
};