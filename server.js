const express = require("express");
const { sequelize } = require("./models");
const authRoutes = require("./routes/authRoutes");
const spamRoutes = require("./routes/spamRoutes");
const searchRoutes = require("./routes/searchRoutes");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use("/auth", authRoutes);
app.use("/spam", spamRoutes);
app.use("/search", searchRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
