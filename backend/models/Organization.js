// Modelo Organization - Pizzerías/Empresas del sistema
// Cada organización tiene sus propios usuarios y trabajadores

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Organization = sequelize.define("Organization", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: "Nombre de la pizzería/empresa"
  },
  alias: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false,
    comment: "Alias único para el dominio (ej: pizzeria-donfano)"
  },
  correo: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: "Email de contacto de la organización"
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  pais: {
    type: DataTypes.STRING(100),
    defaultValue: "Paraguay",
  },
  ciudad: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  direccion: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  logo_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: "URL del logo de la organización"
  },
  color_primario: {
    type: DataTypes.STRING(7),
    defaultValue: "#d97706",
    comment: "Color primario personalizado"
  },
  color_secundario: {
    type: DataTypes.STRING(7),
    defaultValue: "#dc2626",
    comment: "Color secundario personalizado"
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  plan: {
    type: DataTypes.ENUM("basico", "profesional", "empresarial"),
    defaultValue: "basico",
    comment: "Plan de suscripción"
  },
  limite_trabajadores: {
    type: DataTypes.INTEGER,
    defaultValue: 50,
    comment: "Límite de trabajadores según el plan"
  },
  fecha_suscripcion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: true,
  tableName: "organizations"
});

module.exports = Organization;
