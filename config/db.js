// config/db.js
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("pizzeria", "root", "omarreyna1234AE", {
  // Asegúrate de que estos valores sean correctos:
  host: "localhost", 
  dialect: "mysql",
  logging: false, // Puedes cambiarlo a 'false' para menos ruido en la consola
});

module.exports = sequelize;