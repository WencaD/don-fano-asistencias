// Controlador HTTP para autenticación
const authService = require("../services/authService");
const workerRepository = require("../repositories/workerRepository");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await authService.login(username, password);

    let workerData = null;
    if (user.role === "WORKER") {
      workerData = await workerRepository.findByUserId(user.id);
    }

    const token = authService.generateToken(user, workerData?.id || null);

    res.json({
      message: "Login exitoso",
      role: user.role,
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        role: user.role,
        workerId: workerData?.id || null,
      },
    });
  } catch (error) {
    console.error("Error en el login:", error);
    res.status(400).json({ error: error.message });
  }
};