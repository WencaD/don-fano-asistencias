// Lógica de trabajadores — crear, listar, actualizar, eliminar
const userRepository   = require("../repositories/userRepository");
const workerRepository = require("../repositories/workerRepository");
const passwordHelper   = require("../utils/passwordHelper");
const tokenHelper      = require("../utils/tokenHelper");
const catalogService   = require("./catalogService");

class WorkerService {
  async getAllWorkers() {
    const workers = await workerRepository.findAll(true);
    return Promise.all(workers.map(async w => {
      const plainWorker = w.get({ plain: true });
      plainWorker.area = await catalogService.getAreaName(plainWorker.area);
      plainWorker.rol  = await catalogService.getCargoName(plainWorker.rol);
      return plainWorker;
    }));
  }

  async getWorkerById(id) {
    const worker = await workerRepository.findById(id, true);
    if (!worker) throw new Error("Trabajador no encontrado");
    
    const plainWorker = worker.get({ plain: true });
    plainWorker.area = await catalogService.getAreaName(plainWorker.area);
    plainWorker.rol  = await catalogService.getCargoName(plainWorker.rol);
    
    return plainWorker;
  }

  async createWorker(workerData) {
    const { nombre, dni, correo, area, rol, salario_hora } = workerData;

    if (!nombre || !dni || !correo || !area || !rol) {
      throw new Error("Faltan campos obligatorios del trabajador");
    }

    const existingUser = await userRepository.findByUsername(dni.trim());
    if (existingUser) throw new Error("Ya existe un usuario con ese DNI");

    const existingEmail = await userRepository.findByEmail(correo);
    if (existingEmail) throw new Error("El correo ya está registrado");

    try {
      const username     = dni.trim();
      const passwordHash = await passwordHelper.hash(dni.trim());
      const userRole     = catalogService.getRoleId(rol);

      const user = await userRepository.create({
        nombre,
        username,
        email: correo,
        password_hash: passwordHash,
        role: userRole
      });

      const worker = await workerRepository.create({
        nombre,
        dni,
        correo,
        area: await catalogService.getAreaId(area),
        rol:  await catalogService.getCargoId(rol),
        salario_hora: salario_hora || 0,
        qr_token: tokenHelper.generateQRToken(),
        userId: user.id
      });

      return { user, worker };
    } catch (error) {
      throw error;
    }
  }

  async updateWorker(id, workerData) {
    const { nombre, dni, correo, area, rol, salario_hora } = workerData;

    const worker = await workerRepository.findById(id);
    if (!worker) throw new Error("Trabajador no encontrado");

    return await workerRepository.update(id, {
      nombre:       nombre       ?? worker.nombre,
      dni:          dni          ?? worker.dni,
      correo:       correo       ?? worker.correo,
      area:         area         ? await catalogService.getAreaId(area)  : worker.area,
      rol:          rol          ? await catalogService.getCargoId(rol)  : worker.rol,
      salario_hora: salario_hora ?? worker.salario_hora
    });
  }

  async deleteWorker(id) {
    const worker = await workerRepository.findById(id);
    if (!worker) throw new Error("Trabajador no encontrado");

    const userId = worker.userId;
    await workerRepository.delete(id);

    if (userId) await userRepository.delete(userId);

    return true;
  }
}

module.exports = new WorkerService();

