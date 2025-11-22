// backend/models/WalletTransaction.js
const mongoose = require("mongoose");

const walletTxnSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["credit", "debit"], // credit = add money, debit = pay from wallet
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    note: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("WalletTransaction", walletTxnSchema);
