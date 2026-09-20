const express = require("express");

const {
  getMyWinners,
  submitProof,
  getPendingWinners,
  reviewWinner,
  updatePayout,
} = require("../controllers/winnerController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

// User routes
router.get("/my-winners", protect, getMyWinners);

router.patch("/:id/proof", protect, submitProof);

// Admin routes
router.get("/pending", protect, adminOnly, getPendingWinners);

router.patch("/:id/review", protect, adminOnly, reviewWinner);

router.patch("/:id/payout", protect, adminOnly, updatePayout);

module.exports = router;
