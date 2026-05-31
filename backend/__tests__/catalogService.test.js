const catalogService = require('../services/catalogService');
const Area = require('../models/Area');

jest.mock('../models/Area');
jest.mock('../models/Cargo');
jest.mock('../models/Plan');
jest.mock('../models/Estado');

describe('CatalogService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    catalogService.clearCache();
  });

  describe('Áreas', () => {
    it('debería obtener y guardar en caché las áreas', async () => {
      const mockAreas = [{ id: 1, nombre: 'Cocina' }, { id: 2, nombre: 'Caja' }];
      Area.findAll.mockResolvedValue(mockAreas);

      const result1 = await catalogService.getAreas();
      const result2 = await catalogService.getAreas();

      expect(result1).toEqual(mockAreas);
      expect(result2).toEqual(mockAreas);
      expect(Area.findAll).toHaveBeenCalledTimes(1); // La segunda llamada debe venir del caché
    });

    it('debería retornar el ID de un área mediante el nombre ignorando mayúsculas', async () => {
      const mockAreas = [{ id: 1, nombre: 'Cocina' }];
      Area.findAll.mockResolvedValue(mockAreas);

      const id = await catalogService.getAreaId('cOcInA');
      expect(id).toBe(1);
    });

    it('debería retornar el nombre de un área por su ID', async () => {
      const mockAreas = [{ id: 1, nombre: 'Cocina' }];
      Area.findAll.mockResolvedValue(mockAreas);

      const name = await catalogService.getAreaName(1);
      expect(name).toBe('Cocina');
    });
  });

  describe('Roles estáticos', () => {
    it('debería retornar el ID correcto para los roles', () => {
      expect(catalogService.getRoleId('ADMIN')).toBe(1);
      expect(catalogService.getRoleId('ADMINISTRADOR')).toBe(1);
      expect(catalogService.getRoleId('SUPERADMIN')).toBe(3);
      expect(catalogService.getRoleId('WORKER')).toBe(2);
      expect(catalogService.getRoleId(null)).toBe(2);
    });

    it('debería retornar el nombre correcto para los roles por ID', () => {
      expect(catalogService.getRoleName(1)).toBe('ADMIN');
      expect(catalogService.getRoleName(3)).toBe('SUPERADMIN');
      expect(catalogService.getRoleName(2)).toBe('WORKER');
    });
  });
});
