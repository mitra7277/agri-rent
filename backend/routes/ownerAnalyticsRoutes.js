// backend/routes/ownerAnalyticsRoutes.js
const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Machine = require("../models/Machine");
const auth = require("../middleware/auth");




// ⭐ 1) OWNER STATS (Bookings + Earnings)
router.get("/owner-stats/:ownerId", auth, async (req, res) => {
  try {
    const ownerId = req.params.ownerId;

    const bookings = await Booking.find().populate("machineId");

    const ownerBookings = bookings.filter(
      (b) => String(b.machineId?.owner) === String(ownerId)
    );

    const totalEarnings = ownerBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    const completed = ownerBookings.filter((b) => b.status === "completed").length;
    const pending = ownerBookings.filter((b) => b.status === "pending").length;

    let monthlyEarnings = Array(12).fill(0);
    ownerBookings.forEach((b) => {
      const month = new Date(b.startTime).getMonth();
      monthlyEarnings[month] += b.totalPrice || 0;
    });

    res.json({
      totalBookings: ownerBookings.length,
      totalEarnings,
      completed,
      pending,
      monthlyEarnings,
    });
  } catch (err) {
    console.log("Owner stats error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ⭐ 2) MACHINE ANALYTICS (Top machine + list)
router.get("/owner-machine-analytics/:ownerId", auth, async (req, res) => {
  try {
    const ownerId = req.params.ownerId;

    const machines = await Machine.find({ owner: ownerId });
    const bookings = await Booking.find().populate("machineId");

    const list = [];

    machines.forEach((m) => {
      const mBookings = bookings.filter(
        (b) => String(b.machineId?._id) === String(m._id)
      );

      const earnings = mBookings.reduce((s, b) => s + (b.totalPrice || 0), 0);

      list.push({
        machineId: m._id,
        type: m.type,
        model: m.model,
        location: m.location,
        image: m.image,
        totalBookings: mBookings.length,
        averageRating: m.averageRating || 0,
        earnings,
      });
    });

    const topMachine =
      list.length > 0 ? list.sort((a, b) => b.earnings - a.earnings)[0] : null;

    res.json({
      topMachine,
      machines: list,
    });
  } catch (err) {
    console.log("Owner machine analytics error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
