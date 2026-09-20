const express = require("express");

const {
  getMySubscription,
  createCheckoutSession,
  cancelSubscription,
  resumeSubscription,
} = require("../controllers/subscriptionController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Get current subscription
router.get("/my-subscription", protect, getMySubscription);

// Create Stripe checkout session
router.post("/checkout", protect, createCheckoutSession);

// Cancel subscription at period end
router.patch("/cancel", protect, cancelSubscription);

// Resume cancelled subscription
router.patch("/resume", protect, resumeSubscription);

module.exports = router;
