const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Contact = sequelize.define("Contact", {
  name: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false },
});

module.exports = Contact;