const mongoose = require("mongoose");

const charityContributionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    charity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Charity",
      required: true,
    },

    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      default: null,
    },

    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },

    contributionType: {
      type: String,
      enum: ["subscription", "independent_donation"],
      required: true,
    },

    subscriptionAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    percentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 10,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      default: "inr",
      lowercase: true,
    },

    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed", "refunded"],
      default: "pending",
    },

    contributionDate: {
      type: Date,
      default: Date.now,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    transactionReference: {
      type: String,
      trim: true,
      default: "",
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

charityContributionSchema.index({
  charity: 1,
  createdAt: -1,
});

charityContributionSchema.index({
  user: 1,
  createdAt: -1,
});

charityContributionSchema.index({ status: 1 });

module.exports = mongoose.model(
  "CharityContribution",
  charityContributionSchema,
);
