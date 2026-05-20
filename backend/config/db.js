// Configuración de conexión a base de datos SQL Server
require('dotenv').config();
const { Sequelize } = require('sequelize');

if (!process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_HOST) {
  throw new Error('Faltan variables de entorno de la BD. Verifica tu archivo .env (DB_HOST, DB_NAME, DB_USER, DB_PASSWORD)');
}

const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT) || 1433,
  dialect: 'mssql',
  dialectOptions: {
    options: {
      encrypt: false,
      trustServerCertificate: true,
      useUTC: false
    }
  },
  logging: false,
  timezone: '-05:00'
});

module.exports = sequelize;