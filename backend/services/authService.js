// Servicio de autenticación de usuarios
// Servicio Auth - Lógica de autenticación y generación de tokens
// Valida credenciales y crea JWT para sesiones

const userRepository = require("../repositories/userRepository");
const organizationRepository = require("../repositories/organizationRepository");
const passwordHelper = require("../utils/passwordHelper");
const tokenHelper = require("../utils/tokenHelper");
const sequelize = require("../config/db");

class AuthService {
  // Servicio de autenticación
  // Valida usuario y contraseña, genera token JWT
  
  async login(username, password) {
    // Busca usuario por nombre de usuario
    const user = await userRepository.findByUsername(username);
    
    if (!user) {
      throw new Error("Usuario o contraseña incorrecta");
    }

    // Valida contraseña con hash bcrypt
    const isPasswordValid = await passwordHelper.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      throw new Error("Contraseña incorrecta");
    }

    return user;
  }

  async register(registrationData) {
    // Registra nueva organización con usuario administrador
    // Valida datos y crea ambos registros en transacción

    const { organizationName, organizationAlias, contactEmail, country, city, phone, plan, adminName, adminEmail, adminPassword } = registrationData;

    // Validaciones básicas
    if (!organizationName || !organizationAlias || !contactEmail || !adminName || !adminEmail || !adminPassword) {
      throw new Error("Faltan datos requeridos para el registro");
    }

    // Valida que el alias sea único
    const existingOrg = await organizationRepository.findByAlias(organizationAlias);
    if (existingOrg) {
      throw new Error("Este alias de organización ya está en uso");
    }

    // Valida que el email de admin sea único
    const existingUser = await userRepository.findByEmail(adminEmail);
    if (existingUser) {
      throw new Error("Este email ya está registrado en el sistema");
    }

    // Valida longitud de contraseña
    if (adminPassword.length < 6) {
      throw new Error("La contraseña debe tener al menos 6 caracteres");
    }

    // Crea organización y usuario en transacción
    const transaction = await sequelize.transaction();
    
    try {
      // Crea organización
      const organization = await organizationRepository.create({
        nombre: organizationName,
        alias: organizationAlias,
        correo: contactEmail,
        pais: country || "Paraguay",
        ciudad: city,
        telefono: phone,
        plan: plan || "basico",
        activo: true
      }, transaction);

      // Hash de contraseña
      const passwordHash = await passwordHelper.hash(adminPassword);

      // Crea usuario administrador
      const user = await userRepository.create({
        nombre: adminName,
        username: organizationAlias, // El alias es el username
        email: adminEmail,
        password_hash: passwordHash,
        role: "ADMIN",
        organizationId: organization.id,
        activo: true
      }, transaction);

      await transaction.commit();

      return {
        organization,
        user,
        message: "Registro exitoso"
      };

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  generateToken(user, workerId = null) {
    // Genera token JWT con datos del usuario
    return tokenHelper.generate({
      id: user.id,
      role: user.role,
      workerId,
      organizationId: user.organizationId
    });
  }
}

module.exports = new AuthService();
