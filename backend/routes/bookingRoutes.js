const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Machine = require("../models/Machine");
const auth = require("../middleware/auth");


// ----------------------------
// CHECK AVAILABILITY
// ----------------------------
router.get("/check/:machineId", async (req, res) => {
  try {
    const { date } = req.query;

    const existing = await Booking.find({
      machineId: req.params.machineId,
      date,
    });

    res.json({ available: existing.length === 0 });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------------------
// CREATE BOOKING
// ----------------------------
router.post("/create", auth, async (req, res) => {
  try {
    const { machineId, date, hours } = req.body;

    const existing = await Booking.findOne({ machineId, date });
    if (existing)
      return res.status(400).json({ message: "Machine already booked for this date" });

    const machine = await Machine.findById(machineId);
    if (!machine) return res.status(404).json({ message: "Machine not found" });

    const totalPrice = machine.pricePerHour * hours;

    const booking = await Booking.create({
      farmerId: req.user._id,
      machineId,
      date,
      hours,
      totalPrice,
      status: "pending",
    });

    res.json({ message: "Booking created", booking });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------------------
// UPDATE BOOKING STATUS
// ----------------------------
router.put("/status/:id", auth, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------------------
// USER BOOKINGS
// ----------------------------
router.get("/my", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ farmerId: req.user._id }).populate("machineId");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------------------
// MACHINE OWNER BOOKINGS
// ----------------------------
router.get("/owner/:ownerId", auth, async (req, res) => {
  try {
    const machines = await Machine.find({ owner: req.params.ownerId });
    const machineIds = machines.map((m) => m._id);

    const bookings = await Booking.find({ machineId: { $in: machineIds } })
      .populate("farmerId", "name email")
      .populate("machineId");

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// =========================================
// OWNER EARNINGS & ANALYTICS
// =========================================
router.get("/owner-stats/:ownerId", async (req, res) => {
  try {
    const ownerId = req.params.ownerId;

    const machines = await Machine.find({ owner: ownerId });
    const machineIds = machines.map((m) => m._id);

    const bookings = await Booking.find({ machineId: { $in: machineIds } });

    const totalBookings = bookings.length;
    const completed = bookings.filter((b) => b.status === "completed").length;
    const pending = bookings.filter((b) => b.status === "pending").length;

    const totalEarnings = bookings
      .filter((b) => b.status === "completed")
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    const monthly = Array(12).fill(0);

    bookings.forEach((b) => {
      if (b.status === "completed") {
        const month = new Date(b.createdAt).getMonth();
        monthly[month] += b.totalPrice || 0;
      }
    });

    res.json({
      totalBookings,
      completed,
      pending,
      totalEarnings,
      monthlyEarnings: monthly,
    });
  } catch (err) {
    console.log("Owner stats error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
