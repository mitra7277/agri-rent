const express = require("express");
const router = express.Router();
const Machine = require("../models/Machine");
const Booking = require("../models/Booking");
const auth = require("../middleware/auth");


const multer = require("multer");
const path = require("path");

// Default machine images (20 HD images)
const MACHINE_IMAGES = require("../utils/machineImages");

// ---------------------------
// IMAGE UPLOAD STORAGE
// ---------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

// ---------------------------
// ADD MACHINE (MULTI IMAGE)
// ---------------------------
router.post("/add", auth, upload.array("images", 5), async (req, res) => {
  try {
    let imagePaths = [];

    if (req.files && req.files.length > 0) {
      imagePaths = req.files.map((file) => "/uploads/" + file.filename);
    } else {
      const randomIndex = Math.floor(Math.random() * MACHINE_IMAGES.length);
      imagePaths = [MACHINE_IMAGES[randomIndex]];
    }

    const machine = await Machine.create({
      owner: req.user._id,
      type: req.body.type,
      model: req.body.model,
      location: req.body.location,
      description: req.body.description,
      pricePerHour: req.body.pricePerHour,
      images: imagePaths,
      status: "pending",
    });

    res.json({ message: "Machine added successfully", machine });
  } catch (err) {
    console.log("Add machine error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------------
// EDIT MACHINE
// ---------------------------
router.put("/edit/:id", auth, upload.array("images", 5), async (req, res) => {
  try {
    const updates = req.body;

    if (req.files && req.files.length > 0) {
      updates.images = req.files.map((file) => "/uploads/" + file.filename);
    }

    const machine = await Machine.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    res.json(machine);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------------
// DELETE MACHINE
// ---------------------------
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    await Machine.findByIdAndDelete(req.params.id);
    res.json({ message: "Machine deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------------
// GET ALL MACHINES (FILTERS)
// ---------------------------
router.get("/", async (req, res) => {
  try {
    const { q, location, type, minPrice, maxPrice, rating } = req.query;

    let filter = {};

    if (q) filter.$text = { $search: q };
    if (location) filter.location = new RegExp(location, "i");
    if (type) filter.type = type;
    if (minPrice && maxPrice)
      filter.pricePerHour = { $gte: minPrice, $lte: maxPrice };
    if (rating) filter.averageRating = { $gte: rating };

    const machines = await Machine.find(filter)
      .populate("owner", "name")
      .sort({ createdAt: -1 });

    res.json(machines);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ---------------------------
// MACHINE DETAILS + ANALYTICS
// ---------------------------
router.get("/:id", async (req, res) => {
  try {
    const machine = await Machine.findById(req.params.id).populate(
      "owner",
      "name email"
    );

    if (!machine)
      return res.status(404).json({ message: "Machine not found" });

    machine.views = (machine.views || 0) + 1;
    await machine.save();

    const totalBookings = await Booking.countDocuments({
      machineId: req.params.id,
    });

    res.json({
      machine,
      analytics: {
        totalViews: machine.views,
        totalBookings,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// =========================================
// OWNER MACHINE ANALYTICS (WORKING)
// =========================================
router.get("/owner-machine-analytics/:ownerId", async (req, res) => {
  try {
    const ownerId = req.params.ownerId;

    const machines = await Machine.find({ owner: ownerId });

    const data = [];

    for (let m of machines) {
      const bookings = await Booking.find({
        machineId: m._id,
        status: "completed",
      });

      const earnings = bookings.reduce(
        (sum, b) => sum + (b.totalPrice || 0),
        0
      );

      const avgRating = m.ratings?.length
        ? m.ratings.reduce((a, b) => a + b.rating, 0) / m.ratings.length
        : 0;

      data.push({
        machineId: m._id,
        type: m.type,
        model: m.model,
        location: m.location,
        averageRating: avgRating,
        totalBookings: bookings.length,
        earnings,
        image: m.images?.[0] || null,
      });
    }

    const topMachine = data.sort((a, b) => b.earnings - a.earnings)[0] || null;

    res.json({ machines: data, topMachine });
  } catch (err) {
    console.log("Owner analytics error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// EXPORT MUST BE AT BOTTOM
module.exports = router;
