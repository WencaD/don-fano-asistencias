// Modelo Organization - Pizzerías/Empresas del sistema

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Organization = sequelize.define("Organization", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: "Id"
  },
  nombre: {
    type: DataTypes.STRING(150),
    allowNull: false,
    field: "Nombre"
  },
  alias: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false,
    field: "Alias"
  },
  correo: {
    type: DataTypes.STRING(150),
    allowNull: false,
    field: "Correo"
  },
  telefono: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: "Telefono"
  },
  pais: {
    type: DataTypes.STRING(100),
    defaultValue: "Paraguay",
    field: "Pais"
  },
  ciudad: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: "Ciudad"
  },
  direccion: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: "Direccion"
  },
  logo_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: "LogoUrl"
  },
  color_primario: {
    type: DataTypes.STRING(7),
    defaultValue: "#d97706",
    field: "ColorPrimario"
  },
  color_secundario: {
    type: DataTypes.STRING(7),
    defaultValue: "#dc2626",
    field: "ColorSecundario"
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: "Activo"
  },
  Planid: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
    field: "PlanId"
  },
  fecha_suscripcion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: "FechaSuscripcion"
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: "CreatedAt"
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: "UpdatedAt"
  }
}, {
  timestamps: false, // Usamos los definidos manuales
  tableName: "Organizations"
});

module.exports = Organization;
