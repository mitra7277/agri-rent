import User from "../models/User.js";
import Machine from "../models/Machine.js";
import Booking from "../models/Booking.js";

export const getAdminStats = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const farmers = await User.countDocuments({ role: "farmer" });
    const owners = await User.countDocuments({ role: "owner" });
    const machines = await Machine.countDocuments();
    const bookings = await Booking.countDocuments();

    res.json({
      totalUsers: users,
      farmers,
      owners,
      machines,
      bookings,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllMachines = async (req, res) => {
  try {
    const machines = await Machine.find().populate("owner", "name");
    res.json(machines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
