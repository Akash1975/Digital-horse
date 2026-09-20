const Draw = require("../models/Draw");
const DrawEntry = require("../models/DrawEntry");
const Subscription = require("../models/Subscription");

const generateUniqueNumbers = () => {
  const numbers = new Set();

  while (numbers.size < 5) {
    numbers.add(Math.floor(Math.random() * 45) + 1);
  }

  return [...numbers].sort((a, b) => a - b);
};

exports.getPublishedDraws = async (req, res) => {
  try {
    const draws = await Draw.find({
      status: {
        $in: ["published", "completed"],
      },
    }).sort({
      drawDate: -1,
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

exports.getDraw = async (req, res) => {
  try {
    const draw = await Draw.findById(req.params.id);

    if (!draw) {
      return res.status(404).json({
        message: "Draw not found",
      });
    }

    res.status(200).json({
      success: true,
      draw,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Draw not found",
    });
  }
};

exports.createDraw = async (req, res) => {
  try {
    const draw = await Draw.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Draw created successfully",
      draw,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.simulateDraw = async (req, res) => {
  try {
    const draw = await Draw.findById(req.params.id);

    if (!draw) {
      return res.status(404).json({
        message: "Draw not found",
      });
    }

    const winningNumbers = generateUniqueNumbers();

    draw.winningNumbers = winningNumbers;
    draw.status = "simulated";

    draw.simulationData = {
      generatedAt: new Date(),
      generatedBy: req.user.id,
    };

    await draw.save();

    res.status(200).json({
      success: true,
      message: "Draw simulated successfully",
      winningNumbers,
      draw,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.publishDraw = async (req, res) => {
  try {
    const draw = await Draw.findByIdAndUpdate(
      req.params.id,
      {
        status: "published",
        publishedAt: new Date(),
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!draw) {
      return res.status(404).json({
        message: "Draw not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Draw published successfully",
      draw,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.enterDraw = async (req, res) => {
  try {
    const { entryNumbers, entrySource = "random" } = req.body;

    const draw = await Draw.findById(req.params.id);

    if (!draw || !["published", "simulated"].includes(draw.status)) {
      return res.status(400).json({
        message: "Draw is not open",
      });
    }

    const subscription = await Subscription.findOne({
      user: req.user.id,
      status: "active",
    });

    if (!subscription) {
      return res.status(403).json({
        message: "Active subscription required",
      });
    }

    const numbers = entryNumbers || generateUniqueNumbers();

    if (
      !Array.isArray(numbers) ||
      numbers.length !== 5 ||
      new Set(numbers).size !== 5 ||
      numbers.some(
        (number) => !Number.isInteger(number) || number < 1 || number > 45,
      )
    ) {
      return res.status(400).json({
        message: "Choose 5 unique numbers from 1 to 45",
      });
    }

    if (!["random", "algorithmic"].includes(entrySource)) {
      return res.status(400).json({
        message: "Invalid entry source",
      });
    }

    const entry = await DrawEntry.create({
      draw: draw._id,
      user: req.user.id,
      subscription: subscription._id,
      entryNumbers: [...numbers].sort((a, b) => a - b),
      entrySource,
    });

    res.status(201).json({
      success: true,
      message: "Draw entry created successfully",
      entry,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message:
        error.code === 11000 ? "You already entered this draw" : error.message,
    });
  }
};

exports.getMyEntries = async (req, res) => {
  try {
    const entries = await DrawEntry.find({
      user: req.user.id,
    })
      .populate("draw")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      entries,
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
