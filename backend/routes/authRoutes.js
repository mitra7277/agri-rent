// backend/routes/authRoutes.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const auth = require("../middleware/auth");

// -------------------------------
// TOKEN CONFIG
// -------------------------------
const ACCESS_EXPIRES_IN = "1d";
const REFRESH_EXPIRES_IN = "7d";

function signAccessToken(user) {
  return jwt.sign(
    { _id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_EXPIRES_IN }
  );
}

function signRefreshToken(user) {
  return jwt.sign(
    { _id: user._id },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: REFRESH_EXPIRES_IN }
  );
}

// -------------------------------
// REGISTER
// -------------------------------
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email & Password required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: role || "farmer",
    });

    const token = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
      refreshToken,
    });
  } catch (err) {
    console.log("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------------------
// LOGIN
// -------------------------------
router.post("/login", async (req, res) => {
  try {
    console.log("👉 LOGIN BODY:", req.body); // debug ke liye

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email & Password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "Your account is blocked" });
    }

    const token = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
      refreshToken,
    });
  } catch (err) {
    console.log("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------------------
// GET LOGGED-IN USER
// -------------------------------
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------------------
// REFRESH ACCESS TOKEN
// -------------------------------
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "No refresh token" });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
    );

    const user = await User.findById(decoded._id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const newToken = signAccessToken(user);

    res.json({ token: newToken });
  } catch (err) {
    console.log("Refresh token error:", err);
    res.status(401).json({ message: "Invalid refresh token" });
  }
});

// -------------------------------
// CREATE ADMIN (one-time only)
// -------------------------------
router.get("/create-admin", async (req, res) => {
  try {
    const existing = await User.findOne({ email: "admin@gmail.com" });
    if (existing) {
      return res.json({ message: "Admin already exists", admin: existing });
    }

    const hashed = await bcrypt.hash("123456", 10);

    const admin = await User.create({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashed,
      role: "admin",
    });

    res.json(admin);
  } catch (err) {
    console.log("Create admin error:", err);
    res.status(500).json({ message: "Admin creation failed" });
  }
});

module.exports = router;
