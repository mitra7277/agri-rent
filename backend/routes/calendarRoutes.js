const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

// GET machine booked dates
router.get("/:machineId", async (req, res) => {
  try {
    const bookings = await Booking.find({
      machineId: req.params.machineId,
      status: "approved",
    });

    const dates = bookings.map((b) => ({
      start: b.startTime,
      end: b.endTime,
    }));

    res.json(dates);
  } catch (err) {
    console.log("Calendar Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
