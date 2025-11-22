const express = require("express");
const router = express.Router();

const Equipment = require("../models/Equipment");
const auth = require("../middleware/auth");

const { recommendEquipment } = require("../utils/recommend");

// Add new equipment (owner)
router.post("/", auth, async (req, res) => {
  try {
    const equipment = await Equipment.create({
      ...req.body,
      owner: req.user._id,
    });
    res.json(equipment);
  } catch (err) {
    console.error("Add equipment error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all available equipments
router.get("/", async (req, res) => {
  try {
    const equipments = await Equipment.find({})
      .populate("owner", "name phone location");

    res.json(equipments);
  } catch (err) {
    console.error("Get equipments error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get equipments of logged-in owner
router.get("/my", auth, async (req, res) => {
  try {
    const equipments = await Equipment.find({ owner: req.user._id });
    res.json(equipments);
  } catch (err) {
    console.error("Get my equipments error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Recommendation endpoint
router.get("/recommend/:location/:type", async (req, res) => {
  try {
    const { location, type } = req.params;

    const equipments = await Equipment.find({});
    const recommended = recommendEquipment(equipments, location, type);

    res.json(recommended);
  } catch (err) {
    console.error("Recommend error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
