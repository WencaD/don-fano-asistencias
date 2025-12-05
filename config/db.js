// config/db.js
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("pizzeria", "root", "omarreyna1234AE", {
  host: "localhost", 
  dialect: "mysql",
  logging: false,
  timezone: '-05:00',
});

module.exports = sequelize;
