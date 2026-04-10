const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const isAdmin = require("../middlewares/isAdmin");

const { getReportes } = require("../controllers/reportesController");

router.post("/", authMiddleware, isAdmin, getReportes);

module.exports = router;