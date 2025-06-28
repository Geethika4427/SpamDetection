const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const SpamReport = sequelize.define("SpamReport", {
  phone: { type: DataTypes.STRING, allowNull: false },
});

module.exports = SpamReport;