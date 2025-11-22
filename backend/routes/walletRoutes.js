// backend/routes/walletRoutes.js
const express = require("express");
const router = express.Router();
const WalletTransaction = require("../models/WalletTransaction");
const User = require("../models/User");
const auth = require("../middleware/auth");



/*
=========================================================
 WALLET ROUTES (CLEAN + FINAL)
 Base URL: /api/wallet
=========================================================
*/

// ------------------------------------
// 1) GET TRANSACTION HISTORY  (KEEP FIRST)
//    GET /api/wallet/:id/transactions
// ------------------------------------
router.get("/:id/transactions", auth, async (req, res) => {
  try {
    const userId = req.params.id;

    // (optional) ensure user is owner of this wallet
    if (String(req.user._id) !== String(userId) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not allowed" });
    }

    const tx = await WalletTransaction.find({ user: userId })
      .sort({ createdAt: -1 });

    res.json(tx);
  } catch (err) {
    console.error("Transaction GET error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------------------------
// 2) GET WALLET BALANCE
//    GET /api/wallet/:id
// ------------------------------------
router.get("/:id", auth, async (req, res) => {
  try {
    const userId = req.params.id;

    if (String(req.user._id) !== String(userId) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not allowed" });
    }

    const user = await User.findById(userId).select("walletBalance");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ balance: user.walletBalance || 0 });
  } catch (err) {
    console.error("Wallet GET error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------------------------
// 3) ADD MONEY TO WALLET
//    POST /api/wallet/add   { amount }
// ------------------------------------
router.post("/add", auth, async (req, res) => {
  try {
    const { amount } = req.body;

    const amt = Number(amount);
    if (!amt || amt <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.walletBalance = (user.walletBalance || 0) + amt;
    await user.save();

    await WalletTransaction.create({
      user: user._id,
      amount: amt,
      type: "credit",
      message: "Wallet Recharge Successful",
    });

    res.json({ balance: user.walletBalance });
  } catch (err) {
    console.error("Add Money Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------------------------
// 4) DEDUCT MONEY (FOR BOOKINGS)
//    POST /api/wallet/deduct   { amount }
// ------------------------------------
router.post("/deduct", auth, async (req, res) => {
  try {
    const { amount } = req.body;
    const amt = Number(amount);

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!amt || amt <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    if ((user.walletBalance || 0) < amt) {
      return res.status(400).json({ message: "Not enough balance" });
    }

    user.walletBalance = (user.walletBalance || 0) - amt;
    await user.save();

    await WalletTransaction.create({
      user: user._id,
      amount: amt,
      type: "debit",
      message: "Booking Payment Deducted",
    });

    res.json({ balance: user.walletBalance });
  } catch (err) {
    console.error("Deduct Money Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
