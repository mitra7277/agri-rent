// models/Equipment.js
const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    model: { type: String },
    pricePerHour: { type: Number },
    location: { type: String },
    description: { type: String },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    image: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Equipment", equipmentSchema);
