const { DataTypes } = require("sequelize");
const { db } = require("../database/config");

const User = db.define("users", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM("client", "employee"),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("available", "unavailable"),
    defaultValue: "available",
    allowNull: false,
  },
});

const userStatus = Object.freeze({
  active: "available",
  disabled: "unavailable",
});

module.exports = {
  User,
  userStatus,
};
