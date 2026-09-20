const crypto = require("crypto");

const Draw = require("../models/Draw");
const DrawEntry = require("../models/DrawEntry");

/**
 * Generate unique random numbers between 1 and 45.
 */
const generateRandomNumbers = (count = 5, min = 1, max = 45) => {
  const numbers = new Set();

  while (numbers.size < count) {
    const randomNumber = crypto.randomInt(min, max + 1);

    numbers.add(randomNumber);
  }

  return Array.from(numbers).sort((a, b) => a - b);
};

/**
 * Validate draw numbers.
 */
const validateNumbers = (numbers) => {
  if (!Array.isArray(numbers)) {
    throw new Error("Numbers must be an array");
  }

  if (numbers.length !== 5) {
    throw new Error("Exactly 5 numbers are required");
  }

  const uniqueNumbers = new Set(numbers);

  if (uniqueNumbers.size !== 5) {
    throw new Error("Numbers must be unique");
  }

  for (const number of numbers) {
    if (!Number.isInteger(number) || number < 1 || number > 45) {
      throw new Error("Numbers must be between 1 and 45");
    }
  }

  return true;
};

/**
 * Count matching numbers between entry and winning numbers.
 */
const countMatches = (entryNumbers, winningNumbers) => {
  const winningSet = new Set(winningNumbers);

  return entryNumbers.filter((number) => winningSet.has(number)).length;
};

/**
 * Generate winning numbers for a draw.
 */
const generateWinningNumbers = () => {
  return generateRandomNumbers(5, 1, 45);
};

/**
 * Simulate a draw and calculate matching entries.
 */
const simulateDraw = async (drawId, winningNumbers = null) => {
  const draw = await Draw.findById(drawId);

  if (!draw) {
    throw new Error("Draw not found");
  }

  if (draw.status === "completed" || draw.status === "cancelled") {
    throw new Error("This draw cannot be simulated");
  }

  const numbers = winningNumbers || generateWinningNumbers();

  validateNumbers(numbers);

  const entries = await DrawEntry.find({
    draw: drawId,
    status: "active",
    isEligible: true,
  });

  const matchedEntries = entries.map((entry) => {
    const matchedNumbers = entry.entryNumbers.filter((number) =>
      numbers.includes(number),
    );

    const matchCount = matchedNumbers.length;

    return {
      entryId: entry._id,
      userId: entry.user,
      matchedNumbers,
      matchCount,
      entryNumbers: entry.entryNumbers,
    };
  });

  const winningEntries = matchedEntries.filter(
    (entry) => entry.matchCount >= 3,
  );

  const matchSummary = {
    threeMatches: winningEntries.filter((entry) => entry.matchCount === 3)
      .length,

    fourMatches: winningEntries.filter((entry) => entry.matchCount === 4)
      .length,

    fiveMatches: winningEntries.filter((entry) => entry.matchCount === 5)
      .length,
  };

  draw.winningNumbers = numbers;
  draw.status = "simulated";
  draw.simulationData = {
    totalEntries: entries.length,
    winningEntries: winningEntries.length,
    matchSummary,
    simulatedAt: new Date(),
  };

  await draw.save();

  return {
    draw,
    winningNumbers: numbers,
    totalEntries: entries.length,
    winningEntries,
    matchSummary,
  };
};

/**
 * Mark draw entries as winners or non-winners.
 */
const processDrawEntries = async (drawId, winningNumbers) => {
  validateNumbers(winningNumbers);

  const entries = await DrawEntry.find({
    draw: drawId,
    status: "active",
    isEligible: true,
  });

  const results = [];

  for (const entry of entries) {
    const matchedNumbers = entry.entryNumbers.filter((number) =>
      winningNumbers.includes(number),
    );

    const matchCount = matchedNumbers.length;

    entry.matchedNumbers = matchCount;

    if (matchCount >= 3) {
      entry.status = "winner";
    } else {
      entry.status = "non_winner";
    }

    await entry.save();

    results.push({
      entry,
      matchCount,
      matchedNumbers,
    });
  }

  return results;
};

/**
 * Find winning entries for a draw.
 */
const getWinningEntries = async (drawId) => {
  const entries = await DrawEntry.find({
    draw: drawId,
    status: "winner",
  }).populate("user", "name email");

  return entries;
};

module.exports = {
  generateRandomNumbers,
  validateNumbers,
  countMatches,
  generateWinningNumbers,
  simulateDraw,
  processDrawEntries,
  getWinningEntries,
};
