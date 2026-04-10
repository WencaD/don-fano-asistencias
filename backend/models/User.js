// Modelo User - Usuarios del sistema (administradores y empleados)
// Campos: username, email, password_hash, role (ADMIN/WORKER), organizationId

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const bcrypt = require("bcrypt");

const User = sequelize.define(
  "User",
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
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: false,
      comment: "Único por organización, no globalmente"
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: false,
      comment: "Único por organización, no globalmente"
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
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

// Compara contraseña en texto con hash
User.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password_hash);
};

module.exports = User;