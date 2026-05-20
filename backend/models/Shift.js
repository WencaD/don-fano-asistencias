// Modelo de turnos de trabajo

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Shift = sequelize.define(
  "Shift",
  {
    id: { 
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true,
      field: "Id"
    },
    workerId: { 
      type: DataTypes.INTEGER, 
      allowNull: false,
      field: "WorkerId"
    },
    fecha: { 
      type: DataTypes.STRING(10), 
      allowNull: false,
      field: "Fecha"
    },
    hora_inicio: { 
      type: DataTypes.TIME, 
      allowNull: false,
      field: "HoraInicio",
      get() {
        const val = this.getDataValue('hora_inicio');
        if (!val) return null;
        const timeStr = val instanceof Date ? val.toISOString() : val.toString();
        if (timeStr.includes('T')) {
          return timeStr.split('T')[1].slice(0, 5);
        }
        return timeStr.slice(0, 5);
      }
    },
    hora_fin: { 
      type: DataTypes.TIME, 
      allowNull: false,
      field: "HoraFin",
      get() {
        const val = this.getDataValue('hora_fin');
        if (!val) return null;
        const timeStr = val instanceof Date ? val.toISOString() : val.toString();
        if (timeStr.includes('T')) {
          return timeStr.split('T')[1].slice(0, 5);
        }
        return timeStr.slice(0, 5);
      }
    },
  },
  {
    timestamps: false,
    tableName: "Shifts",
  }
);

module.exports = Shift;
