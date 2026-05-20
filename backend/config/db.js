require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false,
});

/* 
// Configuración de SQL Server
// const sequelize = new Sequelize({
//   database: process.env.DB_NAME,
//   username: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   host: process.env.DB_HOST,
//   port: parseInt(process.env.DB_PORT) || 1433,
//   dialect: 'mssql',
//   dialectOptions: { options: { encrypt: false, trustServerCertificate: true, useUTC: false } },
//   logging: false,
//   timezone: '-05:00'
// });
*/

module.exports = sequelize;