// Modelo Worker - Trabajadores/Empleados
// Campos: nombre, dni, correo, área, rol, salario por hora, token QR, organizationId

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Worker = sequelize.define(
  "Worker",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    organizationId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "ID de la organización a la que pertenece"
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    dni: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: "DNI único por organización"
    },
    correo: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    area: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    rol: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    salario_hora: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    qr_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "workers",
    timestamps: false,
  }
);

module.exports = Worker;
