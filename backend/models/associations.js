// Relaciones entre modelos de la base de datos
const User = require("./User");
const Worker = require("./Worker");
const Assistance = require("./Assistance");
const Shift = require("./Shift");
const Organization = require("./Organization");

// Organization 1-N User
Organization.hasMany(User, { foreignKey: { name: "organizationId", allowNull: true }, onDelete: 'SET NULL' });
User.belongsTo(Organization, { foreignKey: { name: "organizationId", allowNull: true } });

// Organization 1-N Worker
Organization.hasMany(Worker, { foreignKey: { name: "organizationId", allowNull: true }, onDelete: 'SET NULL' });
Worker.belongsTo(Organization, { foreignKey: { name: "organizationId", allowNull: true } });

// User 1-1 Worker
User.hasOne(Worker, { foreignKey: "userId" });
Worker.belongsTo(User, { foreignKey: "userId" });

// Worker 1-N Assistance
Worker.hasMany(Assistance, { foreignKey: "workerId" });
Assistance.belongsTo(Worker, { foreignKey: "workerId" });

// Worker 1-N Shift
Worker.hasMany(Shift, { foreignKey: "workerId" });
Shift.belongsTo(Worker, { foreignKey: "workerId" });

module.exports = { User, Worker, Assistance, Shift, Organization };
