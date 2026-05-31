const reportService = require('../services/reportService');
const assistanceRepository = require('../repositories/assistanceRepository');

jest.mock('../repositories/assistanceRepository');
jest.mock('../repositories/workerRepository');

describe('ReportService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateReport', () => {
    it('debería lanzar error si faltan fechas', async () => {
      const filters = { desde: '2026-05-01' }; // Falta hasta
      await expect(reportService.generateReport(filters)).rejects.toThrow('Rango de fechas requerido');
    });

    it('debería filtrar y calcular horas trabajadas correctamente', async () => {
      const mockAssistances = [
        {
          fecha: '2026-05-10',
          workerId: 1,
          hora_entrada: '08:00:00',
          hora_salida: '17:00:00',
          Worker: { salario_hora: 10 },
          toJSON: () => ({ id: 1, fecha: '2026-05-10' })
        },
        {
          fecha: '2026-05-15',
          workerId: 2,
          hora_entrada: '09:00:00',
          hora_salida: '13:00:00',
          Worker: { salario_hora: 15 },
          toJSON: () => ({ id: 2, fecha: '2026-05-15' })
        },
        {
          fecha: '2026-05-25', // Fuera de rango
          workerId: 1,
          hora_entrada: '08:00:00',
          hora_salida: '17:00:00',
          Worker: { salario_hora: 10 },
          toJSON: () => ({ id: 3, fecha: '2026-05-25' })
        }
      ];

      assistanceRepository.findAll.mockResolvedValue(mockAssistances);

      const filters = { desde: '2026-05-01', hasta: '2026-05-20' };
      const report = await reportService.generateReport(filters);

      expect(report.length).toBe(2);
      expect(report[0].horasTrabajadas).toBe(9);
      expect(report[0].pagoDelDia).toBe(90); // 9 * 10
      expect(report[1].horasTrabajadas).toBe(4);
      expect(report[1].pagoDelDia).toBe(60); // 4 * 15
    });

    it('debería filtrar por workerId si se provee', async () => {
      const mockAssistances = [
        {
          fecha: '2026-05-10',
          workerId: 1,
          hora_entrada: '08:00:00',
          hora_salida: '17:00:00',
          Worker: { salario_hora: 10 },
          toJSON: () => ({ id: 1 })
        },
        {
          fecha: '2026-05-15',
          workerId: 2,
          hora_entrada: '09:00:00',
          hora_salida: '13:00:00',
          Worker: { salario_hora: 15 },
          toJSON: () => ({ id: 2 })
        }
      ];

      assistanceRepository.findAll.mockResolvedValue(mockAssistances);

      const filters = { desde: '2026-05-01', hasta: '2026-05-20', workerId: 2 };
      const report = await reportService.generateReport(filters);

      expect(report.length).toBe(1);
      expect(report[0].id).toBe(2);
    });
  });
});
