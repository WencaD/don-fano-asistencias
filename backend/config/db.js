require('dotenv').config();
const { Sequelize } = require('sequelize');

const dialect = process.env.DB_DIALECT || 'mssql';

let sequelize;

if (process.env.DATABASE_URL) {
  // Configuración estándar para bases de datos en la nube (ej. PostgreSQL en Render/Railway/Supabase)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: dialect,
    logging: false,
    dialectOptions: dialect === 'postgres' ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    } : {},
    timezone: '-05:00'
  });
} else {
  // Configuración tradicional por parámetros individuales
  const config = {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || (dialect === 'mssql' ? 1433 : (dialect === 'postgres' ? 5432 : 3306)),
    dialect: dialect,
    logging: false,
    timezone: '-05:00'
  };

  if (dialect === 'mssql') {
    config.dialectOptions = {
      options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: true,
        useUTC: false
      }
    };
  } else if (dialect === 'postgres') {
    config.dialectOptions = {
      ssl: process.env.DB_SSL === 'true' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    };
  }

  sequelize = new Sequelize(config);
}

module.exports = sequelize;