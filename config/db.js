// Configuración de conexión a base de datos
require('dotenv').config();
const { Sequelize } = require("sequelize");

// Railway usa MYSQLHOST, MYSQLUSER, etc.
// Local usa DB_HOST, DB_USER, etc.
const sequelize = new Sequelize(
  process.env.MYSQLDATABASE || process.env.DB_NAME,
  process.env.MYSQLUSER || process.env.DB_USER,
  process.env.MYSQLPASSWORD || process.env.DB_PASSWORD,
  {
    host: process.env.MYSQLHOST || process.env.DB_HOST,
    port: process.env.MYSQLPORT || 3306,
    dialect: 'mysql',
    logging: false,
    timezone: '-05:00',
  }
);

module.exports = sequelize;