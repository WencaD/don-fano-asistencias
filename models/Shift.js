// Modelo de turnos de trabajo
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Shift = sequelize.define(
  "Shift",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fecha: { type: DataTypes.STRING, allowNull: false },
    hora_inicio: { type: DataTypes.STRING, allowNull: false },
    hora_fin: { type: DataTypes.STRING, allowNull: false },
    workerId: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    timestamps: false,
    tableName: "shifts",
  }
);

module.exports = Shift;
