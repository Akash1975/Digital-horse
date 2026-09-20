const User = require("../models/User");
const Charity = require("../models/Charity");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("selectedCharity")
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, selectedCharity, charityPercentage } = req.body;

    const updates = {};

    if (name !== undefined) {
      updates.name = name.trim();
    }

    if (selectedCharity !== undefined) {
      const charity = await Charity.findOne({
        _id: selectedCharity,
        isActive: true,
      });

      if (!charity) {
        return res.status(404).json({
          message: "Selected charity not found",
        });
      }

      updates.selectedCharity = selectedCharity;
    }

    if (charityPercentage !== undefined) {
      const percentage = Number(charityPercentage);

      if (!Number.isFinite(percentage) || percentage < 10 || percentage > 100) {
        return res.status(400).json({
          message: "Charity percentage must be between 10 and 100",
        });
      }

      updates.charityPercentage = percentage;
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    })
      .populate("selectedCharity")
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("selectedCharity")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent deleting admin accounts (optional)
    // if (user.role === "admin") {
    //   return res.status(403).json({
    //     success: false,
    //     message: "Admin user cannot be deleted",
    //   });
    // }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        message: "isActive must be true or false",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        isActive,
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User status updated",
      user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  ...exports,
};
