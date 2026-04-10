// Script para migrar la tabla users - agregar columna organizationId
require('dotenv').config();
const sequelize = require('./backend/config/db');

async function migrate() {
  try {
    // Conectar
    await sequelize.authenticate();
    console.log('Conectado a BD');

    // Agregar columna organizationId a users si no existe
    await sequelize.query(`
      ALTER TABLE users ADD COLUMN organizationId INT NULL
    `);
    console.log('✅ Columna organizationId agregada a users');

    // Crear organización por defecto si no existe
    const result = await sequelize.query(`
      INSERT IGNORE INTO organizations (id, nombre, alias, correo, plan) 
      VALUES (1, 'Default Organization', 'default', 'admin@default.local', 'basico')
    `);
    console.log('✅ Organización por defecto creada/verificada');

    // Actualizar usuarios existentes a organizationId = 1
    await sequelize.query(`
      UPDATE users SET organizationId = 1 WHERE organizationId IS NULL
    `);
    console.log('✅ Usuarios existentes vinculados a organización default');

    // Ahora hacer NOT NULL
    await sequelize.query(`
      ALTER TABLE users MODIFY COLUMN organizationId INT NOT NULL
    `);
    console.log('✅ Columna organizationId configurada como NOT NULL');

    // Agregar foreign key
    try {
      await sequelize.query(`
        ALTER TABLE users 
        ADD CONSTRAINT fk_users_organization 
        FOREIGN KEY (organizationId) 
        REFERENCES organizations(id)
      `);
      console.log('✅ Foreign key agregado');
    } catch (err) {
      if (err.message.includes('already exists')) {
        console.log('Foreign key ya existe');
      } else {
        throw err;
      }
    }

    console.log('✅ Migración completada exitosamente');
    process.exit(0);
  } catch (err) {
    if (err.message.includes('Duplicate column')) {
      console.log('La columna organizationId ya existe');
      process.exit(0);
    }
    console.error('Error:', err.message);
    process.exit(1);
  }
}

migrate();
