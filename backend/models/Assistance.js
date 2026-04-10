// Modelo de registro de asistencias de trabajadores
// Modelo Assistance - Registros de asistencia de trabajadores
// Campos: fecha, hora entrada/salida, minutos de tardanza, estado

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Assistance = sequelize.define(
  "Assistance",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fecha: { type: DataTypes.STRING, allowNull: false },
    hora_entrada: { type: DataTypes.STRING },
    hora_salida: { type: DataTypes.STRING },
    estado: { type: DataTypes.STRING },
    minutos_tarde: { type: DataTypes.INTEGER, defaultValue: 0 },
    workerId: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    timestamps: false,
    tableName: "assistance",
  }
);

module.exports = Assistance;
