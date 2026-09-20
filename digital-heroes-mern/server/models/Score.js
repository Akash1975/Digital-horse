const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    score: {
      type: Number,
      required: [true, "Score is required"],
      min: [1, "Score must be at least 1"],
      max: [45, "Score cannot exceed 45"],
    },

    scoreDate: {
      type: Date,
      required: [true, "Score date is required"],
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

// One score per user for each date.
scoreSchema.index({ user: 1, scoreDate: 1 }, { unique: true });

// Useful for retrieving the latest scores.
scoreSchema.index({ user: 1, scoreDate: -1 });

module.exports = mongoose.model("Score", scoreSchema);
