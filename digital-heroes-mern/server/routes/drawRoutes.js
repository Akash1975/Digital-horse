const express = require("express");

const {
  getPublishedDraws,
  getDraw,
  createDraw,
  simulateDraw,
  publishDraw,
  enterDraw,
  getMyEntries,
} = require("../controllers/drawController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

const router = express.Router();

router.get("/", getPublishedDraws);

router.get("/user/my-entries", protect, getMyEntries);

router.post("/:id/enter", protect, enterDraw);

router.get("/:id", getDraw);

router.post("/", protect, adminOnly, createDraw);

router.post("/:id/simulate", protect, adminOnly, simulateDraw);

router.patch("/:id/publish", protect, adminOnly, publishDraw);

module.exports = router;
