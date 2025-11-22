const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Machine = require("../models/Machine");
const Booking = require("../models/Booking");
const Notification = require("../models/Notification");
const ActivityLog = require("../models/ActivityLog");
const Setting = require("../models/Setting");

// FIXED: Correct middleware import
const auth = require("../middleware/auth");   // ✔ MUST BE THIS

// --------------------------
// ADMIN GUARD
// --------------------------
async function isAdmin(req, res, next) {
  try {
    const admin = await User.findById(req.user._id);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Admin only access" });
    }
    req.admin = admin;
    next();
  } catch (err) {
    console.error("Admin guard error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
}

// Protect ALL admin routes
router.use(auth, isAdmin);

// Helper: Activity log
async function logActivity(adminId, action, meta = {}) {
  try {
    await ActivityLog.create({ admin: adminId, action, meta });
  } catch (err) {
    console.log("Activity Log Error:", err.message);
  }
}

// =====================================================
// 1) ADMIN DASHBOARD STATS
// =====================================================
router.get("/stats", async (req, res) => {
  try {
    const [
      totalUsers,
      totalFarmers,
      totalOwners,
      totalAdmins,
      totalMachines,
      totalBookings
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "farmer" }),
      User.countDocuments({ role: "owner" }),
      User.countDocuments({ role: "admin" }),
      Machine.countDocuments(),
      Booking.countDocuments()
    ]);

    const lastBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("machineId")
      .populate("farmerId", "name");

    res.json({
      totalUsers,
      totalFarmers,
      totalOwners,
      totalAdmins,
      totalMachines,
      totalBookings,
      totalEarnings: 0,
      lastBookings
    });
  } catch (err) {
    console.error("Admin stats error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// =====================================================
// 2) USERS MANAGEMENT
// =====================================================
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select("-password");
    res.json(users);
  } catch (err) {
    console.error("Admin users error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Toggle Block
router.put("/users/:id/toggle-block", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = !user.isBlocked;
    await user.save();

    await logActivity(req.admin._id, "TOGGLE_BLOCK_USER", {
      user: req.params.id,
      isBlocked: user.isBlocked
    });

    res.json({ user });
  } catch (err) {
    console.error("Toggle block error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// =====================================================
// 3) MACHINES MANAGEMENT
// =====================================================
router.get("/machines", async (req, res) => {
  try {
    const machines = await Machine.find().populate("owner", "name email");
    res.json(machines);
  } catch (err) {
    console.error("Admin machines error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/machines/:id/approve", async (req, res) => {
  try {
    const machine = await Machine.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    );
    res.json(machine);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/machines/:id/reject", async (req, res) => {
  try {
    const machine = await Machine.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );
    res.json(machine);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/machines/:id", async (req, res) => {
  try {
    await Machine.findByIdAndDelete(req.params.id);
    res.json({ message: "Machine deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// =====================================================
// 4) BOOKINGS LIST
// =====================================================
router.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("machineId")
      .populate("farmerId", "name email");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// =====================================================
// 5) SETTINGS + NOTIFICATIONS
// =====================================================
router.get("/settings", async (req, res) => {
  try {
    const settings = await Setting.find();
    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/settings", async (req, res) => {
  try {
    const { key, value } = req.body;
    const setting = await Setting.findOneAndUpdate(
      { key },
      { value },
      { new: true, upsert: true }
    );
    res.json(setting);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/notifications", async (req, res) => {
  try {
    const list = await Notification.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/notifications", async (req, res) => {
  try {
    const notif = await Notification.create(req.body);
    res.json(notif);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
