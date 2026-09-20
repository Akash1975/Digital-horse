const stripe = require("../config/stripe");

const Subscription = require("../models/Subscription");
const User = require("../models/User");

/**
 * Create a Stripe customer.
 */
const createStripeCustomer = async (user) => {
  if (!user) {
    throw new Error("User is required");
  }

  const customer = await stripe.customers.create({
    name: user.name,
    email: user.email,
    metadata: {
      userId: user._id.toString(),
    },
  });

  return customer;
};

/**
 * Create a Stripe checkout session.
 */
const createSubscriptionCheckout = async ({
  user,
  priceId,
  successUrl,
  cancelUrl,
}) => {
  if (!user) {
    throw new Error("User is required");
  }

  if (!priceId) {
    throw new Error("Stripe price ID is required");
  }

  if (!successUrl || !cancelUrl) {
    throw new Error("Success and cancel URLs are required");
  }

  let customerId = user.stripeCustomerId;

  if (!customerId) {
    const customer = await createStripeCustomer(user);

    customerId = customer.id;

    await User.findByIdAndUpdate(user._id, {
      stripeCustomerId: customerId,
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",

    customer: customerId,

    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],

    success_url: successUrl,
    cancel_url: cancelUrl,

    metadata: {
      userId: user._id.toString(),
    },

    subscription_data: {
      metadata: {
        userId: user._id.toString(),
      },
    },
  });

  return session;
};

/**
 * Retrieve a Stripe subscription.
 */
const getStripeSubscription = async (subscriptionId) => {
  if (!subscriptionId) {
    throw new Error("Stripe subscription ID is required");
  }

  return await stripe.subscriptions.retrieve(subscriptionId);
};

/**
 * Cancel a subscription at the end of its billing period.
 */
const cancelSubscriptionAtPeriodEnd = async (subscriptionId) => {
  const subscription = await getStripeSubscription(subscriptionId);

  const updatedSubscription = await stripe.subscriptions.update(
    subscription.id,
    {
      cancel_at_period_end: true,
    },
  );

  return updatedSubscription;
};

/**
 * Cancel a subscription immediately.
 */
const cancelSubscriptionImmediately = async (subscriptionId) => {
  const subscription = await getStripeSubscription(subscriptionId);

  const cancelledSubscription = await stripe.subscriptions.cancel(
    subscription.id,
  );

  return cancelledSubscription;
};

/**
 * Resume a subscription that is scheduled for cancellation.
 */
const resumeSubscription = async (subscriptionId) => {
  const subscription = await getStripeSubscription(subscriptionId);

  const updatedSubscription = await stripe.subscriptions.update(
    subscription.id,
    {
      cancel_at_period_end: false,
    },
  );

  return updatedSubscription;
};

/**
 * Sync Stripe subscription status with MongoDB.
 */
const syncSubscriptionStatus = async (stripeSubscription) => {
  if (!stripeSubscription) {
    throw new Error("Stripe subscription data is required");
  }

  const subscription = await Subscription.findOne({
    stripeSubscriptionId: stripeSubscription.id,
  });

  if (!subscription) {
    return null;
  }

  subscription.status = stripeSubscription.status;

  subscription.cancelAtPeriodEnd = stripeSubscription.cancel_at_period_end;

  if (stripeSubscription.current_period_start) {
    subscription.currentPeriodStart = new Date(
      stripeSubscription.current_period_start * 1000,
    );
  }

  if (stripeSubscription.current_period_end) {
    subscription.currentPeriodEnd = new Date(
      stripeSubscription.current_period_end * 1000,
    );
  }

  if (stripeSubscription.canceled_at) {
    subscription.cancelledAt = new Date(stripeSubscription.canceled_at * 1000);
  }

  await subscription.save();

  return subscription;
};

module.exports = {
  createStripeCustomer,
  createSubscriptionCheckout,
  getStripeSubscription,
  cancelSubscriptionAtPeriodEnd,
  cancelSubscriptionImmediately,
  resumeSubscription,
  syncSubscriptionStatus,
};
