const mongoose = require("mongoose");

const charitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Charity name is required"],
      trim: true,
      maxlength: 150,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Charity description is required"],
      trim: true,
      maxlength: 3000,
    },

    shortDescription: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },

    logo: {
      type: String,
      default: "",
    },

    coverImage: {
      type: String,
      default: "",
    },

    website: {
      type: String,
      trim: true,
      default: "",
    },

    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    location: {
      type: String,
      trim: true,
      default: "",
    },

    events: [
      {
        title: {
          type: String,
          trim: true,
          required: true,
        },

        description: {
          type: String,
          trim: true,
          default: "",
        },

        eventDate: {
          type: Date,
          required: true,
        },

        location: {
          type: String,
          trim: true,
          default: "",
        },

        image: {
          type: String,
          default: "",
        },
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    totalContributions: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalSupporters: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

charitySchema.index({
  name: "text",
  description: "text",
});

charitySchema.index({ isActive: 1, isFeatured: 1 });

module.exports = mongoose.model("Charity", charitySchema);
