const Draw = require("../models/Draw");

/**
 * Calculate the charity amount and prize pool.
 */
const calculatePrizePool = ({ subscriptionAmount, charityPercentage = 10 }) => {
  if (subscriptionAmount <= 0) {
    throw new Error("Subscription amount must be greater than zero");
  }

  if (charityPercentage < 10 || charityPercentage > 100) {
    throw new Error("Charity percentage must be between 10 and 100");
  }

  const charityAmount = (subscriptionAmount * charityPercentage) / 100;

  const prizePoolAmount = subscriptionAmount - charityAmount;

  return {
    subscriptionAmount,
    charityPercentage,
    charityAmount,
    prizePoolAmount,
  };
};

/**
 * Calculate prize amount for each match category.
 */
const calculatePrizeDistribution = ({
  prizePoolAmount,
  prizeTiers = [],
  winnerCounts = {},
}) => {
  if (prizePoolAmount < 0) {
    throw new Error("Prize pool cannot be negative");
  }

  const defaultTiers = [
    {
      matches: 5,
      percentage: 40,
    },
    {
      matches: 4,
      percentage: 35,
    },
    {
      matches: 3,
      percentage: 25,
    },
  ];

  const tiers = prizeTiers.length ? prizeTiers : defaultTiers;

  const distribution = [];

  for (const tier of tiers) {
    const count = winnerCounts[tier.matches] || 0;

    const allocatedAmount = (prizePoolAmount * tier.percentage) / 100;

    const amountPerWinner = count > 0 ? allocatedAmount / count : 0;

    distribution.push({
      matches: tier.matches,
      percentage: tier.percentage,
      winnerCount: count,
      allocatedAmount,
      amountPerWinner,
    });
  }

  return distribution;
};

/**
 * Calculate prize distribution from a draw.
 */
const calculateDrawPrizes = async (drawId) => {
  const draw = await Draw.findById(drawId);

  if (!draw) {
    throw new Error("Draw not found");
  }

  const winners = draw.winners || [];

  const winnerCounts = {
    3: winners.filter((winner) => winner.matchedNumbers === 3).length,

    4: winners.filter((winner) => winner.matchedNumbers === 4).length,

    5: winners.filter((winner) => winner.matchedNumbers === 5).length,
  };

  const distribution = calculatePrizeDistribution({
    prizePoolAmount: draw.prizePoolAmount,
    prizeTiers: draw.prizeTiers,
    winnerCounts,
  });

  return {
    drawId: draw._id,
    prizePool: draw.prizePoolAmount,
    winnerCounts,
    distribution,
  };
};

/**
 * Get the prize amount for one winner.
 */
const getPrizeAmount = ({
  prizePoolAmount,
  matchCount,
  winnerCounts,
  prizeTiers,
}) => {
  const tier = prizeTiers.find((item) => item.matches === matchCount);

  if (!tier) {
    return 0;
  }

  const totalWinners = winnerCounts[matchCount] || 0;

  if (totalWinners === 0) {
    return 0;
  }

  const allocatedAmount = (prizePoolAmount * tier.percentage) / 100;

  return allocatedAmount / totalWinners;
};

/**
 * Assign prize amounts to draw winners.
 */
const assignPrizeAmounts = async (drawId) => {
  const draw = await Draw.findById(drawId);

  if (!draw) {
    throw new Error("Draw not found");
  }

  const winners = draw.winners || [];

  const winnerCounts = {
    3: winners.filter((winner) => winner.matchedNumbers === 3).length,

    4: winners.filter((winner) => winner.matchedNumbers === 4).length,

    5: winners.filter((winner) => winner.matchedNumbers === 5).length,
  };

  for (const winner of winners) {
    winner.prizeAmount = getPrizeAmount({
      prizePoolAmount: draw.prizePoolAmount,
      matchCount: winner.matchedNumbers,
      winnerCounts,
      prizeTiers: draw.prizeTiers,
    });
  }

  draw.winners = winners;

  await draw.save();

  return draw;
};

module.exports = {
  calculatePrizePool,
  calculatePrizeDistribution,
  calculateDrawPrizes,
  getPrizeAmount,
  assignPrizeAmounts,
};
