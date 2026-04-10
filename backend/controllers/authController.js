// Controlador HTTP para autenticación
// Controlador Auth - Endpoints de autenticación (login, registro)
// Retorna tokens JWT y datos del usuario

const authService = require("../services/authService");
const workerRepository = require("../repositories/workerRepository");

exports.login = async (req, res) => {
  // Controlador para login de usuarios
  // Valida credenciales y retorna token JWT
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

exports.register = async (req, res) => {
  // Controlador para registro de nuevas organizaciones
  // Crea organización + usuario administrador
  try {
    const registrationData = {
      organizationName: req.body.organizationName,
      organizationAlias: req.body.organizationAlias,
      contactEmail: req.body.contactEmail,
      country: req.body.country,
      city: req.body.city,
      phone: req.body.phone,
      plan: req.body.plan,
      adminName: req.body.adminName,
      adminEmail: req.body.adminEmail,
      adminPassword: req.body.adminPassword,
    };

    const result = await authService.register(registrationData);

    const token = authService.generateToken(result.user);

    res.status(201).json({
      message: "Registro exitoso",
      token,
      user: {
        id: result.user.id,
        nombre: result.user.nombre,
        email: result.user.email,
        role: result.user.role,
        organizationId: result.user.organizationId,
      },
      organization: {
        id: result.organization.id,
        nombre: result.organization.nombre,
        alias: result.organization.alias,
        plan: result.organization.plan,
      },
    });
  } catch (error) {
    console.error("Error en el registro:", error);
    res.status(400).json({ error: error.message });
  }
};