import express from "express";
import RentOrder from "../models/RentOrder.js";
import Equipment from "../models/Equipment.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create rent order
router.post("/", protect, async (req, res) => {
  try {
    const { equipmentId, hours, date, location } = req.body;

    const equipment = await Equipment.findById(equipmentId);
    if (!equipment) {
      return res.status(404).json({ message: "Equipment not found" });
    }

    const totalAmount = (equipment.pricePerHour || 0) * hours;

    const rent = await RentOrder.create({
      equipment: equipmentId,
      owner: equipment.owner,
      renter: req.user._id,
      hours,
      totalAmount,
      date,
      location,
    });

    res.json(rent);
  } catch (err) {
    console.error("Create rent error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get my rent orders (as renter)
router.get("/my", protect, async (req, res) => {
  try {
    const rents = await RentOrder.find({ renter: req.user._id })
      .populate("equipment")
      .sort({ createdAt: -1 });

    res.json(rents);
  } catch (err) {
    console.error("Get my rents error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Approve/start rent (owner side) -> status = running, equipment unavailable
router.put("/approve/:id", protect, async (req, res) => {
  try {
    const order = await RentOrder.findById(req.params.id).populate("equipment");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // only owner can approve
    if (String(order.owner) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    order.status = "running";
    await order.save();

    order.equipment.available = false;
    await order.equipment.save();

    res.json({ message: "Rent started", order });
  } catch (err) {
    console.error("Approve rent error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Complete rent -> status = completed, equipment available again
router.put("/complete/:id", protect, async (req, res) => {
  try {
    const order = await RentOrder.findById(req.params.id).populate("equipment");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (String(order.owner) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    order.status = "completed";
    await order.save();

    order.equipment.available = true;
    await order.equipment.save();

    res.json({ message: "Rent completed", order });
  } catch (err) {
    console.error("Complete rent error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
