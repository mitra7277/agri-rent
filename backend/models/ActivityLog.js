// backend/models/ActivityLog.js

const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action: { type: String, required: true }, // e.g. BLOCK_USER, APPROVE_MACHINE
    meta: { type: Object, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);
