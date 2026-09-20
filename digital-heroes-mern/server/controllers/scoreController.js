const Score = require("../models/Score");

exports.addScore = async (req, res) => {
  try {
    const { score, scoreDate, notes } = req.body;

    const numericScore = Number(score);

    if (
      !Number.isInteger(numericScore) ||
      numericScore < 1 ||
      numericScore > 45
    ) {
      return res.status(400).json({
        message: "Score must be an integer between 1 and 45",
      });
    }

    const date = scoreDate ? new Date(scoreDate) : new Date();

    if (Number.isNaN(date.getTime())) {
      return res.status(400).json({
        message: "Invalid score date",
      });
    }

    date.setHours(0, 0, 0, 0);

    const savedScore = await Score.findOneAndUpdate(
      {
        user: req.user.id,
        scoreDate: date,
      },
      {
        score: numericScore,
        notes: notes || "",
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );

    const scoreCount = await Score.countDocuments({
      user: req.user.id,
    });

    if (scoreCount > 5) {
      const oldScores = await Score.find({
        user: req.user.id,
      })
        .sort({
          scoreDate: -1,
        })
        .skip(5);

      if (oldScores.length > 0) {
        await Score.deleteMany({
          _id: {
            $in: oldScores.map((item) => item._id),
          },
        });
      }
    }

    res.status(201).json({
      success: true,
      message: "Score saved successfully",
      score: savedScore,
    });
  } catch (error) {
    console.error("Add score error:", error.message);

    res.status(400).json({
      success: false,
      message:
        error.code === 11000
          ? "Score already exists for this date"
          : error.message,
    });
  }
};

exports.getMyScores = async (req, res) => {
  try {
    const scores = await Score.find({
      user: req.user.id,
    })
      .sort({
        scoreDate: -1,
      })
      .limit(5);

    res.status(200).json({
      success: true,
      scores,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteScore = async (req, res) => {
  try {
    const score = await Score.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!score) {
      return res.status(404).json({
        message: "Score not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Score deleted successfully",
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
