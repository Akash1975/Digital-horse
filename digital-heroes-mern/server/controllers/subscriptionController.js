const Subscription = require("../models/Subscription");
const User = require("../models/User");
const stripe = require("../config/stripe");

exports.getMySubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      user: req.user.id,
    }).populate("charity");

    res.status(200).json({
      success: true,
      subscription,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createCheckoutSession = async (req, res) => {
  try {
    const { plan = "monthly", priceId } = req.body;

    if (!priceId) {
      return res.status(400).json({
        message: "Stripe priceId is required",
      });
    }

    if (!["monthly", "yearly"].includes(plan)) {
      return res.status(400).json({
        message: "Plan must be monthly or yearly",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",

      payment_method_types: ["card"],

      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      customer_email: user.email,

      metadata: {
        userId: String(user._id),
        plan,
      },

      subscription_data: {
        metadata: {
          userId: String(user._id),
          plan,
        },
      },

      success_url:
        `${process.env.CLIENT_URL}/subscription/success` +
        "?session_id={CHECKOUT_SESSION_ID}",

      cancel_url: `${process.env.CLIENT_URL}/subscription/cancelled`,
    });

    res.status(200).json({
      success: true,
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Stripe checkout error:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.cancelSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      user: req.user.id,
    });

    if (!subscription || !subscription.stripeSubscriptionId) {
      return res.status(404).json({
        message: "Active subscription not found",
      });
    }

    const updatedStripeSubscription = await stripe.subscriptions.update(
      subscription.stripeSubscriptionId,
      {
        cancel_at_period_end: true,
      },
    );

    subscription.cancelAtPeriodEnd = true;
    subscription.status = updatedStripeSubscription.status;

    await subscription.save();

    res.status(200).json({
      success: true,
      message: "Subscription will cancel at period end",
      subscription,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.resumeSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      user: req.user.id,
    });

    if (!subscription || !subscription.stripeSubscriptionId) {
      return res.status(404).json({
        message: "Subscription not found",
      });
    }

    const updatedStripeSubscription = await stripe.subscriptions.update(
      subscription.stripeSubscriptionId,
      {
        cancel_at_period_end: false,
      },
    );

    subscription.cancelAtPeriodEnd = false;
    subscription.status = updatedStripeSubscription.status;

    await subscription.save();

    res.status(200).json({
      success: true,
      message: "Subscription resumed successfully",
      subscription,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  ...exports,
};
