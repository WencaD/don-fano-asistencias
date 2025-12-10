// Servicio para gestión de trabajadores
const userRepository = require("../repositories/userRepository");
const workerRepository = require("../repositories/workerRepository");
const passwordHelper = require("../utils/passwordHelper");
const tokenHelper = require("../utils/tokenHelper");
const roleMapper = require("../utils/roleMapper");
const sequelize = require("../config/db");

class WorkerService {
  async getAllWorkers() {
    return await workerRepository.findAll(true);
  }

  async getWorkerById(id) {
    const worker = await workerRepository.findById(id, true);
    if (!worker) {
      throw new Error("Trabajador no encontrado");
    }
    return worker;
  }

  async createWorker(workerData) {
    const { nombre, dni, correo, area, rol, salario_hora } = workerData;

    if (!nombre || !dni || !correo || !area || !rol) {
      throw new Error("Faltan campos obligatorios del trabajador");
    }

    const existingUser = await userRepository.findByUsername(dni.trim());
    if (existingUser) {
      throw new Error("Ya existe un usuario con ese DNI");
    }

    const existingEmail = await userRepository.findByEmail(correo);
    if (existingEmail) {
      throw new Error("El correo ya está registrado");
    }

    const transaction = await sequelize.transaction();
    
    try {
      const username = dni.trim();
      const passwordHash = await passwordHelper.hash(dni.trim());
      const userRole = roleMapper.toDatabase(rol);

      const user = await userRepository.create({
        nombre,
        username,
        email: correo,
        password_hash: passwordHash,
        role: userRole
      }, transaction);

      const worker = await workerRepository.create({
        nombre,
        dni,
        correo,
        area,
        rol,
        salario_hora: salario_hora || 0,
        qr_token: tokenHelper.generateQRToken(),
        userId: user.id
      }, transaction);

      await transaction.commit();
      return { user, worker };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updateWorker(id, workerData) {
    const { nombre, dni, correo, area, rol, salario_hora } = workerData;
    
    const worker = await workerRepository.findById(id);
    if (!worker) {
      throw new Error("Trabajador no encontrado");
    }

    const updatedWorker = await workerRepository.update(id, {
      nombre: nombre ?? worker.nombre,
      dni: dni ?? worker.dni,
      correo: correo ?? worker.correo,
      area: area ?? worker.area,
      rol: rol ?? worker.rol,
      salario_hora: salario_hora ?? worker.salario_hora
    });

    return updatedWorker;
  }

  async deleteWorker(id) {
    const worker = await workerRepository.findById(id);
    if (!worker) {
      throw new Error("Trabajador no encontrado");
    }

    const userId = worker.userId;
    await workerRepository.delete(id);

    if (userId) {
      await userRepository.delete(userId);
    }

    return true;
  }
}

module.exports = new WorkerService();
