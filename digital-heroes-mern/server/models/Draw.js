const mongoose = require("mongoose");

const drawWinnerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    matchedNumbers: {
      type: Number,
      enum: [3, 4, 5],
      required: true,
    },

    winningNumbers: {
      type: [Number],
      required: true,
    },

    matchedScoreNumbers: {
      type: [Number],
      default: [],
    },

    prizeAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    proofImage: {
      type: String,
      default: "",
    },

    proofSubmittedAt: {
      type: Date,
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },

    reviewComment: {
      type: String,
      trim: true,
      default: "",
    },

    payoutStatus: {
      type: String,
      enum: ["pending", "processing", "paid", "failed"],
      default: "pending",
    },

    paidAt: {
      type: Date,
      default: null,
    },

    transactionReference: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    _id: true,
  },
);

const drawSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      default: "Monthly Digital Heroes Draw",
    },

    drawMonth: {
      type: String,
      required: true,
      match: [/^\d{4}-(0[1-9]|1[0-2])$/, "Use YYYY-MM format"],
    },

    drawType: {
      type: String,
      enum: ["random", "algorithmic"],
      default: "random",
    },

    status: {
      type: String,
      enum: ["draft", "simulated", "published", "completed", "cancelled"],
      default: "draft",
    },

    drawDate: {
      type: Date,
      required: true,
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    totalParticipants: {
      type: Number,
      default: 0,
      min: 0,
    },

    activeSubscriberCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalPrizePool: {
      type: Number,
      default: 0,
      min: 0,
    },

    carriedJackpot: {
      type: Number,
      default: 0,
      min: 0,
    },

    winningNumbers: {
      type: [Number],
      default: [],
      validate: {
        validator: function (numbers) {
          return numbers.every(
            (number) => Number.isInteger(number) && number >= 1 && number <= 45,
          );
        },
        message: "Winning numbers must be between 1 and 45",
      },
    },

    prizeTiers: {
      fiveMatch: {
        percentage: {
          type: Number,
          default: 40,
          min: 0,
          max: 100,
        },

        poolAmount: {
          type: Number,
          default: 0,
          min: 0,
        },

        winnerCount: {
          type: Number,
          default: 0,
          min: 0,
        },

        amountPerWinner: {
          type: Number,
          default: 0,
          min: 0,
        },

        rollover: {
          type: Boolean,
          default: true,
        },
      },

      fourMatch: {
        percentage: {
          type: Number,
          default: 35,
          min: 0,
          max: 100,
        },

        poolAmount: {
          type: Number,
          default: 0,
          min: 0,
        },

        winnerCount: {
          type: Number,
          default: 0,
          min: 0,
        },

        amountPerWinner: {
          type: Number,
          default: 0,
          min: 0,
        },

        rollover: {
          type: Boolean,
          default: false,
        },
      },

      threeMatch: {
        percentage: {
          type: Number,
          default: 25,
          min: 0,
          max: 100,
        },

        poolAmount: {
          type: Number,
          default: 0,
          min: 0,
        },

        winnerCount: {
          type: Number,
          default: 0,
          min: 0,
        },

        amountPerWinner: {
          type: Number,
          default: 0,
          min: 0,
        },

        rollover: {
          type: Boolean,
          default: false,
        },
      },
    },

    winners: {
      type: [drawWinnerSchema],
      default: [],
    },

    simulationData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

drawSchema.index({ drawMonth: 1 }, { unique: true });
drawSchema.index({ status: 1 });
drawSchema.index({ drawDate: 1 });

module.exports = mongoose.model("Draw", drawSchema);
