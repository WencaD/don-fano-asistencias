// Modelo de registro de asistencias de trabajadores

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Assistance = sequelize.define(
  "Assistance",
  {
    id: { 
      type: DataTypes.BIGINT, 
      autoIncrement: true, 
      primaryKey: true,
      field: "Id"
    },
    workerId: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      field: "WorkerId"
    },
    estadoId: { 
      type: DataTypes.TINYINT, 
      allowNull: true,
      field: "EstadoId"
    },
    fecha: { 
      type: DataTypes.STRING(10), 
      allowNull: false,
      field: "Fecha"
    },
    hora_entrada: { 
      type: DataTypes.TIME,
      field: "HoraEntrada"
    },
    hora_salida: { 
      type: DataTypes.TIME,
      field: "HoraSalida"
    },
    minutos_tarde: { 
      type: DataTypes.SMALLINT, 
      defaultValue: 0,
      field: "MinutosTarde"
    },
    notas: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "Notas"
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "CreatedAt"
    }
  },
  {
    timestamps: false,
    tableName: "Assistances",
  }
);

module.exports = Assistance;
