// Modelo de catálogo de Áreas (leído desde BD, no hardcodeado)
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Area = sequelize.define("Area", {
  id: {
    type: DataTypes.SMALLINT,
    primaryKey: true,
    autoIncrement: true,
    field: "Id"
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: "Nombre"
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: "Activo"
  }
}, {
  tableName: "Areas",
  timestamps: false
});

module.exports = Area;
