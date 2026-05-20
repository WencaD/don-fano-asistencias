// Modelo de catálogo de Estados de asistencia (leído desde BD, no hardcodeado)
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Estado = sequelize.define("Estado", {
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
  tableName: "Estados",
  timestamps: false
});

module.exports = Estado;
