// Modelo de catálogo de Planes (leído desde BD, no hardcodeado)
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Plan = sequelize.define("Plan", {
  id: {
    type: DataTypes.TINYINT,
    primaryKey: true,
    autoIncrement: true,
    field: "Id"
  },
  nombre: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: "Nombre"
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: "Activo"
  }
}, {
  tableName: "Planes",
  timestamps: false
});

module.exports = Plan;
