// Modelo de catálogo de Cargos (leído desde BD, no hardcodeado)
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Cargo = sequelize.define("Cargo", {
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
  tableName: "Cargos",
  timestamps: false
});

module.exports = Cargo;
