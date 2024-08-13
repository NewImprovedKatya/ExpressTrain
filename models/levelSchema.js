const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const levelSchema = new Schema(
  {
    level: {
      type: Number,
      required: true,
      unique: true,
    },
    array: [],
    instructions: {
      type: String,
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    hint: {
        type: Boolean,
        default: false
    }
  },
  {
    timestamps: true,
  }
);

const Level = mongoose.model("Level", levelSchema);

module.exports = Level;