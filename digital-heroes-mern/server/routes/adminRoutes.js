const express = require("express");

const {
  getDashboardStats,
  getAllDraws,
  getAllWinners,
  getPayments,
  deleteCharity,
} = require("../controllers/adminController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect, adminOnly);

// Dashboard statistics
router.get("/dashboard", getDashboardStats);

// Manage draws
router.get("/draws", getAllDraws);

// Manage winners
router.get("/winners", getAllWinners);

// View payments
router.get("/payments", getPayments);

// Deactivate charity
router.patch(
  "/charities/:id/deactivate",
  deleteCharity
);

module.exports = router;