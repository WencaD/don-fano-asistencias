// Mapeador para catálogos SQL Server

class CatalogMapper {
  static getPlanId(planStr) {
    if (!planStr) return 1;
    const p = planStr.toString().toLowerCase();
    if (p.includes('pro')) return 2;
    if (p.includes('emp')) return 3;
    return 1; // Básico por defecto
  }

  static getRoleId(roleStr) {
    if (!roleStr) return 2;
    const r = roleStr.toString().toUpperCase();
    if (r === 'ADMIN' || r === 'ADMINISTRADOR') return 1;
    if (r === 'SUPERADMIN') return 3;
    return 2; // Worker por defecto
  }

  static getAreaId(areaStr) {
    if (!areaStr) return null;
    const a = areaStr.toString().toLowerCase();
    if (a.includes('cocina')) return 1;
    if (a.includes('cliente')) return 2;
    if (a.includes('delivery') || a.includes('repart')) return 3;
    if (a.includes('admin')) return 4;
    if (a.includes('limp')) return 5;
    return 2; // Default
  }

  static getCargoId(cargoStr) {
    if (!cargoStr) return null;
    const c = cargoStr.toString().toLowerCase();
    if (c.includes('pizzero')) return 1;
    if (c.includes('ayudante')) return 2;
    if (c.includes('cajer')) return 3;
    if (c.includes('repart')) return 4;
    if (c.includes('gerente')) return 5;
    return 2; // Default
  }

  static getEstadoId(estadoStr) {
    if (!estadoStr) return 1;
    const e = estadoStr.toString().toLowerCase();
    if (e.includes('present')) return 1;
    if (e.includes('ausent')) return 2;
    if (e.includes('tard')) return 3;
    if (e.includes('justifi')) return 4;
    return 1;
  }

  static getRoleName(roleId) {
    if (roleId === 1 || roleId === '1' || roleId === 'ADMIN') return 'ADMIN';
    if (roleId === 3 || roleId === '3' || roleId === 'SUPERADMIN') return 'SUPERADMIN';
    return 'WORKER'; // 2 y default
  }

  static getAreaName(areaId) {
    const map = { 1: 'Cocina', 2: 'Atención al Cliente', 3: 'Delivery', 4: 'Administración', 5: 'Limpieza' };
    return map[areaId] || 'Atención al Cliente';
  }

  static getCargoName(cargoId) {
    const map = { 1: 'Pizzero', 2: 'Ayudante de Cocina', 3: 'Cajero', 4: 'Repartidor', 5: 'Gerente de Turno' };
    return map[cargoId] || 'Cajero';
  }
}

module.exports = CatalogMapper;
