// backend/models/Notification.js

const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },

    // all | farmers | owners | single
    targetType: {
      type: String,
      enum: ["all", "farmers", "owners", "single"],
      default: "all",
    },

    // if targetType === "single"
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
