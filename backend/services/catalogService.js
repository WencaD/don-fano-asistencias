// Servicio de catálogos — lee Areas, Cargos, Planes y Estados desde SQL Server.
// Usa caché en memoria para no consultar la BD en cada request.
const Area   = require("../models/Area");
const Cargo  = require("../models/Cargo");
const Plan   = require("../models/Plan");
const Estado = require("../models/Estado");

class CatalogService {
  constructor() {
    this._cache = {
      areas:   null,
      cargos:  null,
      planes:  null,
      estados: null
    };
  }

  // ─── Áreas ────────────────────────────────────────────────────────────────

  async getAreas() {
    if (!this._cache.areas) {
      this._cache.areas = await Area.findAll({ where: { activo: true }, order: [["id", "ASC"]] });
    }
    return this._cache.areas;
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
    return match ? match.nombre : null;
  }

  // ─── Cargos ───────────────────────────────────────────────────────────────

  async getCargos() {
    if (!this._cache.cargos) {
      this._cache.cargos = await Cargo.findAll({ where: { activo: true }, order: [["id", "ASC"]] });
    }
    return this._cache.cargos;
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
    return match ? match.nombre : null;
  }

  // ─── Planes ───────────────────────────────────────────────────────────────

  async getPlanes() {
    if (!this._cache.planes) {
      this._cache.planes = await Plan.findAll({ where: { activo: true }, order: [["id", "ASC"]] });
    }
    return this._cache.planes;
  }

  async getPlanId(nombre) {
    if (!nombre) return 1; // Básico por defecto
    const planes = await this.getPlanes();
    const normalized = nombre.toString().toLowerCase();
    const match = planes.find(p => p.nombre.toLowerCase().includes(normalized) || normalized.includes(p.nombre.toLowerCase()));
    return match ? match.id : 1;
  }

  // ─── Estados ──────────────────────────────────────────────────────────────

  async getEstados() {
    if (!this._cache.estados) {
      this._cache.estados = await Estado.findAll({ where: { activo: true }, order: [["id", "ASC"]] });
    }
    return this._cache.estados;
  }

  async getEstadoId(nombre) {
    if (!nombre) return 1;
    const estados = await this.getEstados();
    const normalized = nombre.toString().toLowerCase();
    const match = estados.find(e => e.nombre.toLowerCase().includes(normalized) || normalized.includes(e.nombre.toLowerCase()));
    return match ? match.id : 1;
  }

  // ─── Roles (estáticos — son parte del sistema, no datos del negocio) ──────
  // Los roles son fijos en la lógica de la app: 1=ADMIN, 2=WORKER, 3=SUPERADMIN
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

  // ─── Utilidad: limpiar caché (útil si se modifican catálogos en la BD) ───
  clearCache() {
    this._cache = { areas: null, cargos: null, planes: null, estados: null };
  }
}

module.exports = new CatalogService();
