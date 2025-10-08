const mongoose = require("mongoose");

const logVisitSchema = new mongoose.Schema(
  {
    brCode: {
      type: String,
      trim: true,
      required: true,
      minlength: [25, "brCode is too short."],
      maxlength: [25, "brCode is too long."],
    },
    sessionNr: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "The sessionNr must be an integer.",
      }
    },
    startedAt: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    // Informations
    resolution: {
      type: [Number],
      validate: {
        validator: arr => arr.length === 2 && arr.every(n => n >= 0),
        message: "Resolution must contain exactly two natural numbers.",
      },
    },
    language: String,
    languages: [String],
    browserName: String,
    browserMajor: Number,
    isMobile: Boolean,
    hasKeybAPI: Boolean,
    dMemoryGB: Number,
    heapLimitMB: {
      type: Number,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "The heapMB must be an integer.",
      }
    },
    threadCount: {
      type: Number,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "The thread count must be an integer.",
      }
    },
    oldUser: Boolean,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// VIRTUAL PROPERTY

const logVisit = mongoose.model("LogVisit", logVisitSchema, "game_log_visit");

module.exports = logVisit;
