const { Sequelize } = require("sequelize");

const db = new Sequelize({
  dialect: process.env.DIALECT,
  host: process.env.HOST,
  username: process.env.DB_USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: +process.env.DB_PORT,
  logging: false,
});

module.exports = { db };
