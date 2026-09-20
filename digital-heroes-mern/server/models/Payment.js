const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      default: null,
    },

    paymentType: {
      type: String,
      enum: ["subscription", "charity_donation", "prize_payout"],
      required: true,
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
      enum: [
        "pending",
        "processing",
        "succeeded",
        "failed",
        "refunded",
        "cancelled",
      ],
      default: "pending",
    },

    provider: {
      type: String,
      enum: ["stripe", "manual", "other"],
      default: "stripe",
    },

    stripePaymentIntentId: {
      type: String,
      default: null,
    },

    stripeCheckoutSessionId: {
      type: String,
      default: null,
    },

    stripeInvoiceId: {
      type: String,
      default: null,
    },

    stripeEventId: {
      type: String,
      default: null,
    },

    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Winner",
      default: null,
    },

    charityContribution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CharityContribution",
      default: null,
    },

    failureReason: {
      type: String,
      trim: true,
      default: "",
    },

    paidAt: {
      type: Date,
      default: null,
    },

    refundedAt: {
      type: Date,
      default: null,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ stripePaymentIntentId: 1 });
paymentSchema.index({ stripeCheckoutSessionId: 1 });
paymentSchema.index({ status: 1 });

module.exports = mongoose.model("Payment", paymentSchema);
