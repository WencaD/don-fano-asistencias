// Lógica de autenticación — login, registro y generación de JWT
const userRepository         = require("../repositories/userRepository");
const organizationRepository = require("../repositories/organizationRepository");
const passwordHelper         = require("../utils/passwordHelper");
const tokenHelper            = require("../utils/tokenHelper");
const catalogService         = require("./catalogService");
const sequelize              = require("../config/db");

class AuthService {
  async login(username, password) {
    const user = await userRepository.findByUsername(username);

    if (!user) {
      throw new Error("Usuario o contraseña incorrecta");
    }

    const isPasswordValid = await passwordHelper.compare(password, user.password_hash);

    if (!isPasswordValid) {
      // Mismo mensaje genérico por seguridad — no revelar si el usuario existe
      throw new Error("Usuario o contraseña incorrecta");
    }

    return user;
  }

  async register(registrationData) {
    const { organizationName, organizationAlias, contactEmail, country, city, phone, plan, adminName, adminEmail, adminPassword } = registrationData;

    if (!organizationName || !organizationAlias || !contactEmail || !adminName || !adminEmail || !adminPassword) {
      throw new Error("Faltan datos requeridos para el registro");
    }

    const existingOrg = await organizationRepository.findByAlias(organizationAlias);
    if (existingOrg) {
      throw new Error("Este alias de organización ya está en uso");
    }

    const existingUser = await userRepository.findByEmail(adminEmail);
    if (existingUser) {
      throw new Error("Este email ya está registrado en el sistema");
    }

    if (adminPassword.length < 6) {
      throw new Error("La contraseña debe tener al menos 6 caracteres");
    }

    const transaction = await sequelize.transaction();

    try {
      const organization = await organizationRepository.create({
        nombre: organizationName,
        alias: organizationAlias,
        correo: contactEmail,
        pais: country || "Paraguay",
        ciudad: city,
        telefono: phone,
        plan: await catalogService.getPlanId(plan),
        activo: true
      }, transaction);

      const passwordHash = await passwordHelper.hash(adminPassword);

      const user = await userRepository.create({
        nombre: adminName,
        username: organizationAlias,
        email: adminEmail,
        password_hash: passwordHash,
        role: catalogService.getRoleId("ADMIN"),
        organizationId: organization.id,
        activo: true
      }, transaction);

      await transaction.commit();

      return { organization, user, message: "Registro exitoso" };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  generateToken(user, workerId = null) {
    return tokenHelper.generate({
      id: user.id,
      role: catalogService.getRoleName(user.role),
      workerId,
      organizationId: user.organizationId
    });
  }
}

module.exports = new AuthService();
