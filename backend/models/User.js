// Modelo User - Usuarios del sistema (administradores y empleados)
// Campos: username, email, password_hash, role (ADMIN/WORKER), organizationId

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const bcrypt = require("bcryptjs");

const User = sequelize.define(
  "User",
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
    Rolid: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 2, // 2 = WORKER
      field: "RolId"
    },
    nombre: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: "Nombre"
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "Username"
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: "Email"
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "PasswordHash"
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "Activo"
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "CreatedAt"
    },
    role: {
      type: DataTypes.VIRTUAL,
      get() {
        const catalogService = require("../services/catalogService");
        return catalogService.getRoleName(this.Rolid);
      },
      set(val) {
        const catalogService = require("../services/catalogService");
        if (typeof val === 'number') {
          this.Rolid = val;
        } else {
          this.Rolid = catalogService.getRoleId(val);
        }
      }
    },
    organizationId: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.Organizationid;
      },
      set(val) {
        this.Organizationid = val;
      }
    }
  },
  {
    tableName: "Users",
    timestamps: false,
  }
);

// Compara contraseña en texto con hash
User.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password_hash);
};

module.exports = User;