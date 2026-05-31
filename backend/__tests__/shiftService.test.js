const shiftService = require('../services/shiftService');
const shiftRepository = require('../repositories/shiftRepository');
const assistanceRepository = require('../repositories/assistanceRepository');
const timeHelper = require('../utils/timeHelper');

jest.mock('../repositories/shiftRepository');
jest.mock('../repositories/assistanceRepository');
jest.mock('../utils/timeHelper');

describe('ShiftService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createShift', () => {
    it('debería lanzar error si faltan datos del turno', async () => {
      const incompleteData = { workerId: 1, fecha: '2026-05-21' }; // Faltan horas
      await expect(shiftService.createShift(incompleteData)).rejects.toThrow('Faltan datos del turno');
    });

    it('debería eliminar turno previo si ya existe asistencia para esa fecha', async () => {
      const shiftData = { workerId: 1, fecha: '2026-05-21', hora_inicio: '09:00', hora_fin: '18:00' };
      timeHelper.normalizeDateString.mockReturnValue('2026-05-21');
      assistanceRepository.findByWorkerAndDate.mockResolvedValue({ id: 5 }); // Simula que ya hay asistencia

      await shiftService.createShift(shiftData);

      expect(shiftRepository.deleteByWorkerAndDate).toHaveBeenCalledWith(1, '2026-05-21');
      expect(shiftRepository.create).toHaveBeenCalled();
    });

    it('debería crear el turno correctamente', async () => {
      const shiftData = { workerId: 1, fecha: '2026-05-21', hora_inicio: '09:00', hora_fin: '18:00' };
      timeHelper.normalizeDateString.mockReturnValue('2026-05-21');
      assistanceRepository.findByWorkerAndDate.mockResolvedValue(null);

      const mockCreatedShift = { id: 10, ...shiftData };
      shiftRepository.create.mockResolvedValue(mockCreatedShift);

      const result = await shiftService.createShift(shiftData);

      expect(shiftRepository.deleteByWorkerAndDate).not.toHaveBeenCalled();
      expect(shiftRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        workerId: 1,
        fecha: '2026-05-21'
      }));
      expect(result).toEqual(mockCreatedShift);
    });
  });

  describe('deleteShift', () => {
    it('debería lanzar error si el turno no existe', async () => {
      shiftRepository.delete.mockResolvedValue(false);
      await expect(shiftService.deleteShift(99)).rejects.toThrow('Turno no encontrado');
    });

    it('debería retornar true al eliminar exitosamente', async () => {
      shiftRepository.delete.mockResolvedValue(true);
      const result = await shiftService.deleteShift(1);
      expect(result).toBe(true);
      expect(shiftRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});
