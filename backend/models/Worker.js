// Modelo Worker - Trabajadores/Empleados

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Worker = sequelize.define(
  "Worker",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "Id"
    },
    Organizationid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "OrganizationId"
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "UserId"
    },
    area: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      field: "AreaId"
    },
    rol: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      field: "CargoId"
    },
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: "Nombre"
    },
    dni: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: "Dni"
    },
    correo: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: "Correo"
    },
    salario_hora: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      field: "SalarioHora"
    },
    qr_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "QrToken"
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "Activo"
    }
  },
  {
    tableName: "Workers",
    timestamps: false,
  }
);

module.exports = Worker;
