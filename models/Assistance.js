// Modelo de asistencias de trabajadores
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Assistance = sequelize.define(
  "Assistance",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fecha: { type: DataTypes.STRING, allowNull: false }, // YYYY-MM-DD
    hora_entrada: { type: DataTypes.STRING },
    hora_salida: { type: DataTypes.STRING },
    estado: { type: DataTypes.STRING }, // Puntual, Tardanza, Falta
    minutos_tarde: { type: DataTypes.INTEGER, defaultValue: 0 },
    workerId: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    timestamps: false,
    tableName: "assistance",
  }
);

module.exports = Assistance;
