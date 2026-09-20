const Winner = require("../models/Winner");
const DrawEntry = require("../models/DrawEntry");
const Draw = require("../models/Draw");

/**
 * Create a winner record.
 */
const createWinner = async ({
  drawId,
  drawEntryId,
  userId,
  matchType,
  matchedNumbers,
  prizeAmount = 0,
}) => {
  if (![3, 4, 5].includes(matchType)) {
    throw new Error("Match type must be 3, 4, or 5");
  }

  const draw = await Draw.findById(drawId);

  if (!draw) {
    throw new Error("Draw not found");
  }

  const drawEntry = await DrawEntry.findById(drawEntryId);

  if (!drawEntry) {
    throw new Error("Draw entry not found");
  }

  const existingWinner = await Winner.findOne({
    draw: drawId,
    drawEntry: drawEntryId,
    user: userId,
  });

  if (existingWinner) {
    return existingWinner;
  }

  const winner = await Winner.create({
    draw: drawId,
    drawEntry: drawEntryId,
    user: userId,
    matchType,
    matchedNumbers,
    prizeAmount,
    verificationStatus: "pending",
    payoutStatus: "pending",
  });

  return winner;
};

/**
 * Create winner records from draw results.
 */
const createWinnersFromResults = async ({
  drawId,
  results,
  prizeAmounts = {},
}) => {
  const winners = [];

  for (const result of results) {
    if (result.matchCount < 3) {
      continue;
    }

    const winner = await createWinner({
      drawId,
      drawEntryId: result.entry._id,
      userId: result.entry.user,
      matchType: result.matchCount,
      matchedNumbers: result.matchedNumbers,
      prizeAmount:
        prizeAmounts[result.matchCount] || 0,
    });

    winners.push(winner);
  }

  return winners;
};

/**
 * Submit winner proof.
 */
const submitWinnerProof = async ({
  winnerId,
  userId,
  proofImage,
}) => {
  if (!proofImage) {
    throw new Error("Proof image is required");
  }

  const winner = await Winner.findOne({
    _id: winnerId,
    user: userId,
  });

  if (!winner) {
    throw new Error("Winner record not found");
  }

  if (winner.verificationStatus === "approved") {
    throw new Error("Winner is already approved");
  }

  winner.proofImage = proofImage;
  winner.proofSubmittedAt = new Date();
  winner.verificationStatus = "pending";

  await winner.save();

  return winner;
};

/**
 * Get winners waiting for admin review.
 */
const getPendingWinners = async () => {
  return await Winner.find({
    verificationStatus: "pending",
    proofImage: {
      $ne: null,
    },
  })
    .populate("user", "name email")
    .populate("draw", "title month winningNumbers")
    .sort({ createdAt: 1 });
};

/**
 * Review winner proof.
 */
const reviewWinner = async ({
  winnerId,
  adminId,
  status,
  comment = "",
}) => {
  const allowedStatuses = [
    "approved",
    "rejected",
  ];

  if (!allowedStatuses.includes(status)) {
    throw new Error(
      "Status must be approved or rejected"
    );
  }

  const winner = await Winner.findById(winnerId);

  if (!winner) {
    throw new Error("Winner not found");
  }

  winner.verificationStatus = status;
  winner.reviewedBy = adminId;
  winner.reviewedAt = new Date();
  winner.reviewComment = comment;

  if (status === "rejected") {
    winner.payoutStatus = "pending";
  }

  await winner.save();

  return winner;
};

/**
 * Update winner payout status.
 */
const updateWinnerPayout = async ({
  winnerId,
  status,
  paymentReference = null,
}) => {
  const allowedStatuses = [
    "pending",
    "processing",
    "paid",
    "failed",
  ];

  if (!allowedStatuses.includes(status)) {
    throw new Error("Invalid payout status");
  }

  const winner = await Winner.findById(winnerId);

  if (!winner) {
    throw new Error("Winner not found");
  }

  if (
    status === "processing" ||
    status === "paid"
  ) {
    if (winner.verificationStatus !== "approved") {
      throw new Error(
        "Winner must be approved before payout"
      );
    }
  }

  winner.payoutStatus = status;

  if (paymentReference) {
    winner.paymentReference = paymentReference;
  }

  if (status === "paid") {
    winner.paidAt = new Date();
  }

  await winner.save();

  return winner;
};

/**
 * Get winners belonging to a user.
 */
const getUserWinners = async (userId) => {
  return await Winner.find({
    user: userId,
  })
    .populate("draw", "title month winningNumbers drawDate")
    .populate("drawEntry", "entryNumbers matchedNumbers")
    .sort({ createdAt: -1 });
};

/**
 * Get approved winners waiting for payout.
 */
const getApprovedUnpaidWinners = async () => {
  return await Winner.find({
    verificationStatus: "approved",
    payoutStatus: {
      $in: ["pending", "processing"],
    },
  })
    .populate("user", "name email")
    .populate("draw", "title month");
};

module.exports = {
  createWinner,
  createWinnersFromResults,
  submitWinnerProof,
  getPendingWinners,
  reviewWinner,
  updateWinnerPayout,
  getUserWinners,
  getApprovedUnpaidWinners,
};