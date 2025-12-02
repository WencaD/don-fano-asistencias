// models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      // Debe coincidir con la BD: ENUM('ADMIN','WORKER')
      type: DataTypes.ENUM("ADMIN", "WORKER"),
      allowNull: false,
      defaultValue: "WORKER",
    },
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

module.exports = User;
