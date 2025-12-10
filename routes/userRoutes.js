// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware"); 
const isAdmin = require("../middlewares/isAdmin");               

const {
  createUser,
  getAllUsers,
  deleteUser,
} = require("../controllers/userController");

router.get("/all", authMiddleware, isAdmin, getAllUsers);
router.post("/create", authMiddleware, isAdmin, createUser);
router.delete("/:id", authMiddleware, isAdmin, deleteUser);

module.exports = router;