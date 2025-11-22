const mongoose = require("mongoose");

const machineSchema = new mongoose.Schema(
  {
    type: String,
    model: String,
    pricePerHour: Number,
    location: String,

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // ⭐ CURRENT LIVE LOCATION
    currentLocation: {
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
      updatedAt: { type: Date },
    },

    // ⭐ ROUTE HISTORY
    locationHistory: [
      {
        latitude: Number,
        longitude: Number,
        time: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Machine", machineSchema);
