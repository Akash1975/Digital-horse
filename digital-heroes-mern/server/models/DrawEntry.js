const mongoose = require("mongoose");

const drawEntrySchema = new mongoose.Schema(
  {
    draw: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Draw",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      required: true,
    },

    entryNumbers: {
      type: [Number],
      required: true,
      validate: {
        validator: function (numbers) {
          return (
            numbers.length === 5 &&
            numbers.every(
              (number) =>
                Number.isInteger(number) && number >= 1 && number <= 45,
            )
          );
        },
        message: "Entry must contain exactly 5 numbers from 1 to 45",
      },
    },

    entrySource: {
      type: String,
      enum: ["random", "algorithmic"],
      default: "random",
    },

    status: {
      type: String,
      enum: ["active", "winner", "non_winner", "cancelled"],
      default: "active",
    },

    matchedNumbers: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    isEligible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

drawEntrySchema.index({ draw: 1, user: 1 }, { unique: true });

drawEntrySchema.index({ draw: 1, status: 1 });
drawEntrySchema.index({ user: 1 });

module.exports = mongoose.model("DrawEntry", drawEntrySchema);
