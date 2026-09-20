/**
 * Check whether a value is empty.
 */
const isEmpty = (value) => {
  return value === undefined || value === null || String(value).trim() === "";
};

/**
 * Validate email address.
 */
const isValidEmail = (email) => {
  if (isEmpty(email)) {
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailRegex.test(String(email).trim());
};

/**
 * Validate password.
 */
const isValidPassword = (password) => {
  if (typeof password !== "string") {
    return false;
  }

  return password.length >= 6;
};

/**
 * Validate user name.
 */
const isValidName = (name) => {
  if (isEmpty(name)) {
    return false;
  }

  const trimmedName = String(name).trim();

  return trimmedName.length >= 2 && trimmedName.length <= 100;
};

/**
 * Validate MongoDB ObjectId.
 */
const isValidObjectId = (id) => {
  const mongoose = require("mongoose");

  return mongoose.Types.ObjectId.isValid(id);
};

/**
 * Validate golf score.
 */
const isValidScore = (score) => {
  const numericScore = Number(score);

  return (
    Number.isInteger(numericScore) && numericScore >= 1 && numericScore <= 45
  );
};

/**
 * Validate charity percentage.
 */
const isValidCharityPercentage = (percentage) => {
  const numericPercentage = Number(percentage);

  return (
    Number.isFinite(numericPercentage) &&
    numericPercentage >= 10 &&
    numericPercentage <= 100
  );
};

/**
 * Validate draw entry numbers.
 */
const isValidDrawNumbers = (numbers) => {
  if (!Array.isArray(numbers)) {
    return false;
  }

  if (numbers.length !== 5) {
    return false;
  }

  const normalizedNumbers = numbers.map(Number);

  const areIntegers = normalizedNumbers.every((number) =>
    Number.isInteger(number),
  );

  if (!areIntegers) {
    return false;
  }

  const areInRange = normalizedNumbers.every(
    (number) => number >= 1 && number <= 45,
  );

  if (!areInRange) {
    return false;
  }

  const uniqueNumbers = new Set(normalizedNumbers);

  return uniqueNumbers.size === 5;
};

/**
 * Validate subscription plan.
 */
const isValidSubscriptionPlan = (plan) => {
  return ["monthly", "yearly"].includes(plan);
};

/**
 * Validate payment amount.
 */
const isValidAmount = (amount) => {
  const numericAmount = Number(amount);

  return Number.isFinite(numericAmount) && numericAmount > 0;
};

/**
 * Validate registration data.
 */
const validateRegistration = ({ name, email, password }) => {
  const errors = {};

  if (!isValidName(name)) {
    errors.name = "Name must contain between 2 and 100 characters";
  }

  if (!isValidEmail(email)) {
    errors.email = "Please provide a valid email address";
  }

  if (!isValidPassword(password)) {
    errors.password = "Password must contain at least 6 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate login data.
 */
const validateLogin = ({ email, password }) => {
  const errors = {};

  if (!isValidEmail(email)) {
    errors.email = "Please provide a valid email address";
  }

  if (isEmpty(password)) {
    errors.password = "Password is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate score data.
 */
const validateScoreData = ({ score, scoreDate }) => {
  const errors = {};

  if (!isValidScore(score)) {
    errors.score = "Score must be an integer between 1 and 45";
  }

  if (scoreDate) {
    const date = new Date(scoreDate);

    if (Number.isNaN(date.getTime())) {
      errors.scoreDate = "Invalid score date";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate subscription data.
 */
const validateSubscriptionData = ({ plan, amount, charityPercentage }) => {
  const errors = {};

  if (!isValidSubscriptionPlan(plan)) {
    errors.plan = "Plan must be monthly or yearly";
  }

  if (!isValidAmount(amount)) {
    errors.amount = "Amount must be greater than zero";
  }

  if (!isValidCharityPercentage(charityPercentage)) {
    errors.charityPercentage = "Charity percentage must be between 10 and 100";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

module.exports = {
  isEmpty,
  isValidEmail,
  isValidPassword,
  isValidName,
  isValidObjectId,
  isValidScore,
  isValidCharityPercentage,
  isValidDrawNumbers,
  isValidSubscriptionPlan,
  isValidAmount,
  validateRegistration,
  validateLogin,
  validateScoreData,
  validateSubscriptionData,
};
