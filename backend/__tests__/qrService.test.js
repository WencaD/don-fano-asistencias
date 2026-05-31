const qrService = require('../services/qrService');

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

describe('QRService', () => {
  it('debería obtener el código actual', () => {
    const currentCode = qrService.getCodigoActual();
    
    expect(currentCode).toHaveProperty('codigo');
    expect(currentCode).toHaveProperty('expira_en');
    expect(typeof currentCode.codigo).toBe('string');
    expect(currentCode.codigo.length).toBeGreaterThan(0);
    expect(typeof currentCode.expira_en).toBe('number');
  });

  it('debería validar correctamente un código válido', () => {
    const currentCode = qrService.getCodigoActual();
    const isValid = qrService.validarCodigo(currentCode.codigo);
    
    expect(isValid).toBe(true);
  });

  it('debería rechazar un código inválido', () => {
    const isValid = qrService.validarCodigo('INVALID_CODE');
    
    expect(isValid).toBe(false);
  });
});
