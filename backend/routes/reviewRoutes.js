const express = require("express");
const router = express.Router();

const Review = require("../models/Review");
const Machine = require("../models/Machine");
const auth = require("../middleware/auth");


// --------------------------------------------------
// ⭐ POST REVIEW (with auth)
// POST /api/reviews/:machineId
// --------------------------------------------------
router.post("/:machineId", auth, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    // 1. Create new review
    const review = await Review.create({
      machine: req.params.machineId,
      user: req.user._id,
      rating,
      comment,
    });

    // 2. Recalculate Machine Average Rating
    const allReviews = await Review.find({ machine: req.params.machineId });

    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) /
      allReviews.length;

    // 3. Update machine rating
    await Machine.findByIdAndUpdate(req.params.machineId, {
      rating: avgRating,
      totalBookings: allReviews.length, // you can use another field for totalRatings
    });

    res.status(201).json({
      message: "Review added successfully",
      review,
    });
  } catch (err) {
    console.error("Review POST error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// --------------------------------------------------
// ⭐ GET ALL REVIEWS FOR A MACHINE
// GET /api/reviews/:machineId
// --------------------------------------------------
router.get("/:machineId", async (req, res) => {
  try {
    const reviews = await Review.find({
      machine: req.params.machineId,
    }).populate("user", "name");

    res.json(reviews);
  } catch (err) {
    console.error("Review GET error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
