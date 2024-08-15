const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feedbackSchema = new Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const levelSchema = new Schema(
  {
    level: {
      type: Number,
      required: true,
      unique: true,
    },
    hint: {
      type: Boolean,
      default: false,
    },
    instructions: {
      type: String,
      required: true,
    },
    challenge: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    train: {
      type: Array,
      required: true,
    },
    feedbacks: [feedbackSchema],
  },
  {
    timestamps: true,
  }
);

const Level = mongoose.model("Level", levelSchema);

module.exports = Level;
