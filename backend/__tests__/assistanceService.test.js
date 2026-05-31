const assistanceService = require('../services/assistanceService');
const assistanceRepository = require('../repositories/assistanceRepository');
const workerRepository = require('../repositories/workerRepository');
const shiftRepository = require('../repositories/shiftRepository');
const timeHelper = require('../utils/timeHelper');
const catalogService = require('../services/catalogService');

jest.mock('../repositories/assistanceRepository');
jest.mock('../repositories/workerRepository');
jest.mock('../repositories/shiftRepository');
jest.mock('../utils/timeHelper');
jest.mock('../services/catalogService');

describe('AssistanceService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('markAssistance', () => {
    it('debería lanzar error si el QR o el trabajador es inválido', async () => {
      workerRepository.findByQRToken.mockResolvedValue(null);

      await expect(assistanceService.markAssistance('invalid_qr')).rejects.toThrow('QR inválido o trabajador no encontrado');
    });

    it('debería registrar entrada si no hay asistencia previa', async () => {
      const mockWorker = { id: 1 };
      workerRepository.findByQRToken.mockResolvedValue(mockWorker);
      
      timeHelper.getCurrentDate.mockReturnValue('2026-05-21');
      timeHelper.getCurrentTime.mockReturnValue('08:50:00');
      
      assistanceRepository.findByWorkerAndDate.mockResolvedValue(null);
      shiftRepository.findByWorkerAndDate.mockResolvedValue({ hora_inicio: '09:00:00' });
      timeHelper.formatTime.mockReturnValue('09:00:00');
      timeHelper.diffMinutes.mockReturnValue(-10); // Llego temprano

      catalogService.getEstadoId.mockResolvedValue(1); // Puntual
      assistanceRepository.create.mockResolvedValue({ id: 1, estado: 1 });

      const result = await assistanceService.markAssistance('valid_qr');

      expect(result.type).toBe('entrada');
      expect(result.estado).toBe('Puntual');
      expect(assistanceRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        minutos_tarde: 0,
        workerId: mockWorker.id
      }));
    });

    it('debería registrar tardanza si llega después de la hora de inicio', async () => {
      const mockWorker = { id: 1 };
      workerRepository.findByQRToken.mockResolvedValue(mockWorker);
      
      timeHelper.getCurrentDate.mockReturnValue('2026-05-21');
      timeHelper.getCurrentTime.mockReturnValue('09:15:00');
      
      assistanceRepository.findByWorkerAndDate.mockResolvedValue(null);
      shiftRepository.findByWorkerAndDate.mockResolvedValue({ hora_inicio: '09:00:00' });
      timeHelper.formatTime.mockReturnValue('09:00:00');
      timeHelper.diffMinutes.mockReturnValue(15); // Llego 15 min tarde

      catalogService.getEstadoId.mockResolvedValue(2); // Tardanza
      assistanceRepository.create.mockResolvedValue({ id: 2, estado: 2 });

      const result = await assistanceService.markAssistance('valid_qr');

      expect(result.type).toBe('entrada');
      expect(result.estado).toBe('Tardanza');
      expect(assistanceRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        minutos_tarde: 15,
        workerId: mockWorker.id
      }));
    });

    it('debería registrar salida si ya existe asistencia sin hora de salida', async () => {
      const mockWorker = { id: 1 };
      workerRepository.findByQRToken.mockResolvedValue(mockWorker);
      
      timeHelper.getCurrentDate.mockReturnValue('2026-05-21');
      timeHelper.getCurrentTime.mockReturnValue('18:00:00');
      
      const existingAssistance = { id: 1, hora_salida: null, save: jest.fn() };
      assistanceRepository.findByWorkerAndDate.mockResolvedValue(existingAssistance);

      const result = await assistanceService.markAssistance('valid_qr');

      expect(result.type).toBe('salida');
      expect(existingAssistance.hora_salida).toBe('18:00:00');
      expect(existingAssistance.save).toHaveBeenCalled();
    });

    it('debería avisar que ya completó jornada si ya tiene hora de salida', async () => {
      const mockWorker = { id: 1 };
      workerRepository.findByQRToken.mockResolvedValue(mockWorker);
      
      timeHelper.getCurrentDate.mockReturnValue('2026-05-21');
      timeHelper.getCurrentTime.mockReturnValue('19:00:00');
      
      const existingAssistance = { id: 1, hora_salida: '18:00:00' };
      assistanceRepository.findByWorkerAndDate.mockResolvedValue(existingAssistance);

      const result = await assistanceService.markAssistance('valid_qr');

      expect(result.type).toBe('completa');
      expect(result.message).toBe('Ya completaste tu jornada de hoy');
    });
  });
});
