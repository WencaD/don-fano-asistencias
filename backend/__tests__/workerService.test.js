const workerService = require('../services/workerService');
const userRepository = require('../repositories/userRepository');
const workerRepository = require('../repositories/workerRepository');
const passwordHelper = require('../utils/passwordHelper');
const tokenHelper = require('../utils/tokenHelper');
const catalogService = require('../services/catalogService');
const sequelize = require('../config/db');

jest.mock('../repositories/userRepository');
jest.mock('../repositories/workerRepository');
jest.mock('../utils/passwordHelper');
jest.mock('../utils/tokenHelper');
jest.mock('../services/catalogService');
jest.mock('../config/db', () => ({
  transaction: jest.fn(),
  define: jest.fn(() => ({}))
}));

describe('WorkerService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createWorker', () => {
    it('debería lanzar error si faltan campos obligatorios', async () => {
      const incompleteData = { nombre: 'Juan' };
      await expect(workerService.createWorker(incompleteData)).rejects.toThrow('Faltan campos obligatorios del trabajador');
    });

    it('debería lanzar error si ya existe un usuario con el mismo DNI', async () => {
      userRepository.findByUsername.mockResolvedValue({ id: 1 }); // Simula que ya existe
      
      const workerData = { nombre: 'Juan', dni: '12345678', correo: 'juan@test.com', area: 'Cocina', rol: 'Empleado' };
      await expect(workerService.createWorker(workerData)).rejects.toThrow('Ya existe un usuario con ese DNI');
    });

    it('debería crear el usuario y el trabajador correctamente', async () => {
      userRepository.findByUsername.mockResolvedValue(null);
      userRepository.findByEmail.mockResolvedValue(null);
      
      passwordHelper.hash.mockResolvedValue('hashedPassword');
      catalogService.getRoleId.mockReturnValue(2);
      catalogService.getAreaId.mockResolvedValue(1);
      catalogService.getCargoId.mockResolvedValue(1);
      tokenHelper.generateQRToken.mockReturnValue('random_token_123');

      const mockUser = { id: 10, username: '12345678' };
      const mockWorker = { id: 5, userId: 10 };
      
      userRepository.create.mockResolvedValue(mockUser);
      workerRepository.create.mockResolvedValue(mockWorker);

      const workerData = { nombre: 'Juan', dni: '12345678', correo: 'juan@test.com', area: 'Cocina', rol: 'Empleado', salario_hora: 15 };
      
      const result = await workerService.createWorker(workerData);

      expect(userRepository.create).toHaveBeenCalled();
      expect(workerRepository.create).toHaveBeenCalled();
      expect(result.user).toEqual(mockUser);
      expect(result.worker).toEqual(mockWorker);
    });
  });

  describe('deleteWorker', () => {
    it('debería lanzar error si el trabajador no existe', async () => {
      workerRepository.findById.mockResolvedValue(null);
      await expect(workerService.deleteWorker(99)).rejects.toThrow('Trabajador no encontrado');
    });

    it('debería eliminar el trabajador y el usuario asociado', async () => {
      workerRepository.findById.mockResolvedValue({ id: 5, userId: 10 });
      workerRepository.delete.mockResolvedValue(true);
      userRepository.delete.mockResolvedValue(true);

      const result = await workerService.deleteWorker(5);

      expect(workerRepository.delete).toHaveBeenCalledWith(5);
      expect(userRepository.delete).toHaveBeenCalledWith(10);
      expect(result).toBe(true);
    });
  });
});
