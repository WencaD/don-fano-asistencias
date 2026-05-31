class CatalogService {
  constructor() {
    this._areas = [
      { id: 1, nombre: "Sistemas", activo: true },
      { id: 2, nombre: "Operaciones", activo: true },
      { id: 3, nombre: "Administración", activo: true },
      { id: 4, nombre: "Ventas", activo: true },
      { id: 5, nombre: "Recursos Humanos", activo: true }
    ];

    this._cargos = [
      { id: 1, nombre: "Gerente", activo: true },
      { id: 2, nombre: "Supervisor", activo: true },
      { id: 3, nombre: "Operario", activo: true },
      { id: 4, nombre: "Analista", activo: true },
      { id: 5, nombre: "Asistente", activo: true }
    ];

    this._planes = [
      { id: 1, nombre: "Básico", activo: true },
      { id: 2, nombre: "Premium", activo: true },
      { id: 3, nombre: "Enterprise", activo: true }
    ];

    this._estados = [
      { id: 1, nombre: "Puntual", activo: true },
      { id: 2, nombre: "Tardanza", activo: true },
      { id: 3, nombre: "Falta", activo: true },
      { id: 4, nombre: "Justificado", activo: true }
    ];
  }

  // ─── Áreas ────────────────────────────────────────────────────────────────
  async getAreas() {
    return this._areas;
  }

  async getAreaId(nombre) {
    if (!nombre) return null;
    const areas = await this.getAreas();
    const normalized = nombre.toString().toLowerCase();
    const match = areas.find(a => a.nombre.toLowerCase().includes(normalized) || normalized.includes(a.nombre.toLowerCase()));
    return match ? match.id : null;
  }

  async getAreaName(id) {
    if (!id) return null;
    const areas = await this.getAreas();
    const match = areas.find(a => a.id === id || a.id === parseInt(id));
    return match ? match.nombre : id;
  }

  // ─── Cargos ───────────────────────────────────────────────────────────────
  async getCargos() {
    return this._cargos;
  }

  async getCargoId(nombre) {
    if (!nombre) return null;
    const cargos = await this.getCargos();
    const normalized = nombre.toString().toLowerCase();
    const match = cargos.find(c => c.nombre.toLowerCase().includes(normalized) || normalized.includes(c.nombre.toLowerCase()));
    return match ? match.id : null;
  }

  async getCargoName(id) {
    if (!id) return null;
    const cargos = await this.getCargos();
    const match = cargos.find(c => c.id === id || c.id === parseInt(id));
    return match ? match.nombre : id;
  }

  // ─── Planes ───────────────────────────────────────────────────────────────
  async getPlanes() {
    return this._planes;
  }

  async getPlanId(nombre) {
    if (!nombre) return 1;
    const planes = await this.getPlanes();
    const normalized = nombre.toString().toLowerCase();
    const match = planes.find(p => p.nombre.toLowerCase().includes(normalized) || normalized.includes(p.nombre.toLowerCase()));
    return match ? match.id : 1;
  }

  // ─── Estados ──────────────────────────────────────────────────────────────
  async getEstados() {
    return this._estados;
  }

  async getEstadoId(nombre) {
    if (!nombre) return 1;
    const estados = await this.getEstados();
    const normalized = nombre.toString().toLowerCase();
    const match = estados.find(e => e.nombre.toLowerCase().includes(normalized) || normalized.includes(e.nombre.toLowerCase()));
    return match ? match.id : 1;
  }

  // ─── Roles (estáticos) ───────────────────────────────────────────────────
  getRoleId(roleStr) {
    if (!roleStr) return 2;
    const r = roleStr.toString().toUpperCase();
    if (r === 'ADMIN' || r === 'ADMINISTRADOR') return 1;
    if (r === 'SUPERADMIN') return 3;
    return 2;
  }

  getRoleName(roleId) {
    if (roleId === 1 || roleId === '1' || roleId === 'ADMIN') return 'ADMIN';
    if (roleId === 3 || roleId === '3' || roleId === 'SUPERADMIN') return 'SUPERADMIN';
    return 'WORKER';
  }

  clearCache() {}
}

module.exports = new CatalogService();
