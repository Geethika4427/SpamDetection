const sequelize = require("../config/db");
const User = require("./User");
const Contact = require("./Contact");
const SpamReport = require("./SpamReport");

User.hasMany(Contact);
Contact.belongsTo(User);

User.hasMany(SpamReport, { foreignKey: "reporterId" });
SpamReport.belongsTo(User, { foreignKey: "reporterId" });

module.exports = { sequelize, User, Contact, SpamReport };
