const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { searchByName, searchByPhone, getDetails } = require("../controllers/searchController");

router.get("/name", authMiddleware, searchByName);
router.get("/phone", authMiddleware, searchByPhone);
router.get("/details/:phone", authMiddleware, getDetails);

module.exports = router;

