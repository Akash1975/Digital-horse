const express = require("express");

const {
  addScore,
  getMyScores,
  deleteScore,
} = require("../controllers/scoreController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Add or update score
router.post("/", protect, addScore);

// Get logged-in user's latest scores
router.get("/my-scores", protect, getMyScores);

// Delete user's score
router.delete("/:id", protect, deleteScore);

module.exports = router;
