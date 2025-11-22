const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const auth = require("../middleware/auth");





const router = express.Router();

const razor = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Order
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100,   // convert to paise
      currency: "INR",
      receipt: "txn_" + Date.now(),
    };

    const order = await razor.orders.create(options);

    res.json(order);
  } catch (err) {
    console.log("Order Error:", err);
    res.status(500).json({ message: "Order creation failed" });
  }
});

// Verify Payment
router.post("/verify", (req, res) => {
  const { order_id, payment_id, signature } = req.body;

  const sign = order_id + "|" + payment_id;

  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign.toString())
    .digest("hex");

  if (expectedSign === signature) {
    return res.json({ success: true });
  } else {
    return res.json({ success: false });
  }
});

module.exports = router;
