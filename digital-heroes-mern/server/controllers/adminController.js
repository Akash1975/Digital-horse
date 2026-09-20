const User = require("../models/User");
const Draw = require("../models/Draw");
const Winner = require("../models/Winner");
const Charity = require("../models/Charity");
const Payment = require("../models/Payment");
const CharityContribution = require("../models/CharityContribution");

exports.getDashboardStats = async (req, res) => {
  try {
    const [
      users,
      activeUsers,
      draws,
      winners,
      charities,
      successfulPayments,
      contributions,
    ] = await Promise.all([
      User.countDocuments(),

      User.countDocuments({
        isActive: true,
      }),

      Draw.countDocuments(),

      Winner.countDocuments(),

      Charity.countDocuments({
        isActive: true,
      }),

      Payment.countDocuments({
        status: "succeeded",
      }),

      CharityContribution.aggregate([
        {
          $match: {
            status: "completed",
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$amount",
            },
          },
        },
      ]),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        users,
        activeUsers,
        draws,
        winners,
        charities,
        successfulPayments,
        totalCharityContributions: contributions[0]?.total || 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllDraws = async (req, res) => {
  try {
    const draws = await Draw.find().populate("createdBy", "name email").sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      draws,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllWinners = async (req, res) => {
  try {
    const winners = await Winner.find()
      .populate("user", "name email")
      .populate("draw")
      .populate("drawEntry")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      winners,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("user", "name email")
      .populate("subscription")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteCharity = async (req, res) => {
  try {
    const charity = await Charity.findByIdAndUpdate(
      req.params.id,
      {
        isActive: false,
      },
      {
        new: true,
      },
    );

    if (!charity) {
      return res.status(404).json({
        message: "Charity not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Charity deactivated successfully",
      charity,
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
