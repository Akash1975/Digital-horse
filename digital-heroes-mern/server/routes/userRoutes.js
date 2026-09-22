const express = require("express");

const {
  getProfile,
  updateProfile,
  getUsers,
  updateUserStatus,
  deleteUser
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

// User routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// Admin routes
router.get("/", protect, adminOnly, getUsers);
router.delete("/:id", protect, adminOnly, deleteUser);
router.patch("/:id/status", protect, adminOnly, updateUserStatus);

module.exports = router;
