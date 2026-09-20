const Winner = require("../models/Winner");

exports.getMyWinners = async (req, res) => {
  try {
    const winners = await Winner.find({
      user: req.user.id,
    })
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

exports.submitProof = async (req, res) => {
  try {
    const { proofImage, proofPublicId } = req.body;

    if (!proofImage) {
      return res.status(400).json({
        message: "Proof image is required",
      });
    }

    const winner = await Winner.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!winner) {
      return res.status(404).json({
        message: "Winner record not found",
      });
    }

    winner.proofImage = proofImage;
    winner.proofPublicId = proofPublicId || "";
    winner.proofSubmittedAt = new Date();
    winner.verificationStatus = "pending";

    await winner.save();

    res.status(200).json({
      success: true,
      message: "Proof submitted successfully",
      winner,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getPendingWinners = async (req, res) => {
  try {
    const winners = await Winner.find({
      verificationStatus: "pending",
    })
      .populate("user")
      .populate("draw")
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

exports.reviewWinner = async (req, res) => {
  try {
    const { verificationStatus, reviewComment = "" } = req.body;

    if (!["approved", "rejected"].includes(verificationStatus)) {
      return res.status(400).json({
        message: "Verification status must be approved or rejected",
      });
    }

    const winner = await Winner.findByIdAndUpdate(
      req.params.id,
      {
        verificationStatus,
        reviewComment,
        reviewedBy: req.user.id,
        reviewedAt: new Date(),
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!winner) {
      return res.status(404).json({
        message: "Winner not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Winner reviewed successfully",
      winner,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updatePayout = async (req, res) => {
  try {
    const { payoutStatus, paymentReference = "" } = req.body;

    const allowedStatuses = ["pending", "processing", "paid", "failed"];

    if (!allowedStatuses.includes(payoutStatus)) {
      return res.status(400).json({
        message: "Invalid payout status",
      });
    }

    const updateData = {
      payoutStatus,
      paymentReference,
    };

    if (payoutStatus === "paid") {
      updateData.paidAt = new Date();
    } else {
      updateData.paidAt = null;
    }

    const winner = await Winner.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!winner) {
      return res.status(404).json({
        message: "Winner not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payout updated successfully",
      winner,
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
