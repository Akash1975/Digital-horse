const express = require("express");

const {
  getCharities,
  getCharity,
  createCharity,
  updateCharity,
  getMyContributions,
} = require("../controllers/charityController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

// Public charity routes
router.get("/", getCharities);
router.get("/:id", getCharity);

// Logged-in user's contributions
router.get("/user/my-contributions", protect, getMyContributions);

// Admin charity routes
router.post("/", protect, adminOnly, createCharity);

router.put("/:id", protect, adminOnly, updateCharity);

module.exports = router;
