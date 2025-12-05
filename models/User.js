// models/User.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const bcrypt = require("bcrypt"); // ⬅️ Nuevo: Importar bcrypt

const User = sequelize.define(
  "User",
  {
    // ... (definición de campos)
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

// ⬅️ Nuevo: Método de instancia para comparar la contraseña
User.prototype.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password_hash);
};

module.exports = User;