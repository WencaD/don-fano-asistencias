// Configuración de conexión a base de datos
require('dotenv').config();
const { Sequelize } = require('sequelize');

// --- CONEXIÓN A SQLITE (PARA LA PRESENTACIÓN) ---
// Esto creará un archivo 'database.sqlite' en la raíz de tu backend
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', // Ruta del archivo de la base de datos
  logging: false, // Cambia a console.log para ver las consultas SQL
});

/* 
// --- CONEXIÓN A SQL SERVER (ORIGINAL) ---
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
*/

module.exports = sequelize;