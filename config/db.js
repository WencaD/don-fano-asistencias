// Configuración de conexión a base de datos
require('dotenv').config();
const { Sequelize } = require("sequelize");

// Soporte para PostgreSQL (Render) y MySQL (Railway/Local)
const isPostgres = process.env.DATABASE_URL || process.env.PGDATABASE;

const sequelize = isPostgres
  ? new Sequelize(process.env.DATABASE_URL || {
      database: process.env.PGDATABASE,
      username: process.env.PGUSER,
      password: process.env.PGPASSWORD,
      host: process.env.PGHOST,
      port: process.env.PGPORT || 5432,
      dialect: 'postgres',
      dialectOptions: {
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
      },
      logging: false,
      timezone: '-05:00',
    })
  : new Sequelize(
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