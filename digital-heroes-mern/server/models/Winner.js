const mongoose = require("mongoose");

const winnerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    draw: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Draw",
      required: true,
    },

    drawEntry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DrawEntry",
      required: true,
    },

    matchType: {
      type: Number,
      enum: [3, 4, 5],
      required: true,
    },

    matchedNumbers: {
      type: [Number],
      default: [],
    },

    prizeAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    proofImage: {
      type: String,
      default: null,
    },

    proofSubmittedAt: {
      type: Date,
      default: null,
    },

    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },

    reviewComment: {
      type: String,
      default: "",
    },

    payoutStatus: {
      type: String,
      enum: ["pending", "processing", "paid", "failed"],
      default: "pending",
    },

    paidAt: {
      type: Date,
      default: null,
    },

    paymentReference: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Prevent duplicate winner records for the same draw entry.
winnerSchema.index(
  {
    draw: 1,
    drawEntry: 1,
    user: 1,
  },
  {
    unique: true,
  },
);

module.exports = mongoose.model("Winner", winnerSchema);
