const catalogService = require('../services/catalogService');

describe('CatalogService', () => {
  beforeEach(() => {
    catalogService.clearCache();
  });

  describe('Áreas', () => {
    it('debería obtener las áreas', async () => {
      const result = await catalogService.getAreas();
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].nombre).toBe('Cocina');
    });

    it('debería retornar el ID de un área mediante el nombre ignorando mayúsculas', async () => {
      const id = await catalogService.getAreaId('cOcInA');
      expect(id).toBe(1);
    });

    it('debería retornar el nombre de un área por su ID', async () => {
      const name = await catalogService.getAreaName(1);
      expect(name).toBe('Cocina');
    });
  });

  describe('Cargos', () => {
    it('debería obtener los cargos', async () => {
      const result = await catalogService.getCargos();
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].nombre).toBe('Administrador');
    });

    it('debería retornar el ID de un cargo mediante el nombre ignorando mayúsculas', async () => {
      const id = await catalogService.getCargoId('eMpLeAdO');
      expect(id).toBe(2);
    });

    it('debería retornar el nombre de un cargo por su ID', async () => {
      const name = await catalogService.getCargoName(2);
      expect(name).toBe('Empleado');
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
