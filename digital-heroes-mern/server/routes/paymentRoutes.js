const express = require("express");

const {
  getMyPayments,
  getPayment,
  getAllPayments,
} = require("../controllers/paymentController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

// Logged-in user payments
router.get("/my-payments", protect, getMyPayments);

router.get("/:id", protect, getPayment);

// Admin payments
router.get("/", protect, adminOnly, getAllPayments);

module.exports = router;
