const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { reportSpam } = require("../controllers/spamController");

router.post("/report", authMiddleware, reportSpam);

module.exports = router;
