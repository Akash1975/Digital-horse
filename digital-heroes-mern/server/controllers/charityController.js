const Charity = require("../models/Charity");
const CharityContribution = require("../models/CharityContribution");

exports.getCharities = async (req, res) => {
  try {
    const charities = await Charity.find({
      isActive: true,
    }).sort({
      isFeatured: -1,
      name: 1,
    });

    res.status(200).json({
      success: true,
      charities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getCharity = async (req, res) => {
  try {
    const charity = await Charity.findOne({
      $or: [
        {
          _id: req.params.id,
        },
        {
          slug: req.params.id,
        },
      ],
      isActive: true,
    });

    if (!charity) {
      return res.status(404).json({
        message: "Charity not found",
      });
    }

    res.status(200).json({
      success: true,
      charity,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Charity not found",
    });
  }
};

exports.createCharity = async (req, res) => {
  try {
    const charity = await Charity.create(req.body);

    res.status(201).json({
      success: true,
      message: "Charity created successfully",
      charity,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateCharity = async (req, res) => {
  try {
    const charity = await Charity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!charity) {
      return res.status(404).json({
        message: "Charity not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Charity updated successfully",
      charity,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMyContributions = async (req, res) => {
  try {
    const contributions = await CharityContribution.find({
      user: req.user.id,
    })
      .populate("charity")
      .populate("subscription")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      contributions,
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
