const Charity = require("../models/Charity");
const CharityContribution = require("../models/CharityContribution");

/**
 * Validate charity percentage.
 */
const validateCharityPercentage = (percentage) => {
  if (typeof percentage !== "number" || percentage < 10 || percentage > 100) {
    throw new Error("Charity percentage must be between 10 and 100");
  }

  return true;
};

/**
 * Calculate charity contribution.
 */
const calculateCharityContribution = ({ subscriptionAmount, percentage }) => {
  if (subscriptionAmount <= 0) {
    throw new Error("Subscription amount must be greater than zero");
  }

  validateCharityPercentage(percentage);

  const amount = (subscriptionAmount * percentage) / 100;

  return {
    subscriptionAmount,
    percentage,
    amount,
  };
};

/**
 * Find an active charity.
 */
const getActiveCharity = async (charityId) => {
  const charity = await Charity.findOne({
    _id: charityId,
    isActive: true,
  });

  if (!charity) {
    throw new Error("Active charity not found");
  }

  return charity;
};

/**
 * Create a charity contribution record.
 */
const createCharityContribution = async ({
  userId,
  charityId,
  subscriptionId = null,
  paymentId = null,
  subscriptionAmount,
  percentage,
  contributionType = "subscription",
}) => {
  const charity = await getActiveCharity(charityId);

  const calculation = calculateCharityContribution({
    subscriptionAmount,
    percentage,
  });

  const contribution = await CharityContribution.create({
    user: userId,
    charity: charity._id,
    subscription: subscriptionId,
    payment: paymentId,
    contributionType,
    subscriptionAmount: calculation.subscriptionAmount,
    percentage: calculation.percentage,
    amount: calculation.amount,
    currency: "inr",
    status: "pending",
    contributionDate: new Date(),
  });

  return contribution;
};

/**
 * Mark contribution as completed.
 */
const completeCharityContribution = async (
  contributionId,
  transactionReference = null,
) => {
  const contribution = await CharityContribution.findById(contributionId);

  if (!contribution) {
    throw new Error("Charity contribution not found");
  }

  contribution.status = "completed";
  contribution.completedAt = new Date();

  if (transactionReference) {
    contribution.transactionReference = transactionReference;
  }

  await contribution.save();

  await Charity.findByIdAndUpdate(contribution.charity, {
    $inc: {
      totalContributions: contribution.amount,
      totalSupporters: 1,
    },
  });

  return contribution;
};

/**
 * Mark contribution as failed.
 */
const failCharityContribution = async (
  contributionId,
  reason = "Contribution failed",
) => {
  const contribution = await CharityContribution.findById(contributionId);

  if (!contribution) {
    throw new Error("Charity contribution not found");
  }

  contribution.status = "failed";
  contribution.notes = reason;

  await contribution.save();

  return contribution;
};

/**
 * Get charity contribution history for a user.
 */
const getUserCharityContributions = async (userId) => {
  return await CharityContribution.find({
    user: userId,
  })
    .populate("charity", "name slug logo")
    .sort({ createdAt: -1 });
};

/**
 * Get total contributions for a charity.
 */
const getCharityTotalContributions = async (charityId) => {
  const result = await CharityContribution.aggregate([
    {
      $match: {
        charity: charityId,
        status: "completed",
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: {
          $sum: "$amount",
        },
        totalContributions: {
          $sum: 1,
        },
      },
    },
  ]);

  return (
    result[0] || {
      totalAmount: 0,
      totalContributions: 0,
    }
  );
};

module.exports = {
  validateCharityPercentage,
  calculateCharityContribution,
  getActiveCharity,
  createCharityContribution,
  completeCharityContribution,
  failCharityContribution,
  getUserCharityContributions,
  getCharityTotalContributions,
};
