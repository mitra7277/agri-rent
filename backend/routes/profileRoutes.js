const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");

const User = require("../models/User");
const auth = require("../middleware/auth");


// -------------------
// MULTER – Avatar Upload
// -------------------
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // backend/uploads
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// -------------------------------------------
// ⭐ 1. UPLOAD AVATAR
// POST /api/profile/upload-avatar
// -------------------------------------------
router.post("/upload-avatar", upload.single("avatar"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ avatarUrl: imageUrl });
});

// -------------------------------------------
// ⭐ 2. GET PROFILE BY ID
// GET /api/profile/:id
// -------------------------------------------
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Profile GET error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------------------------------
// ⭐ 3. UPDATE PROFILE BY ID (NO AUTH NEEDED)
// PUT /api/profile/:id
// -------------------------------------------
router.put("/:id", async (req, res) => {
  try {
    const updateData = {
      name: req.body.name,
      location: req.body.location,
      phone: req.body.phone,
      avatar: req.body.avatar,
      bio: req.body.bio,
      experienceYears: req.body.experienceYears,
      landSize: req.body.landSize,
      mainCrops: req.body.mainCrops,
    };

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Profile updated", user });
  } catch (err) {
    console.error("Profile UPDATE error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------------------------------
// ⭐ 4. GET LOGGED-IN USER PROFILE (AUTH)
// GET /api/profile
// -------------------------------------------
router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json(user);
});

// -------------------------------------------
// ⭐ 5. UPDATE LOGGED-IN USER PROFILE (AUTH)
// PUT /api/profile
// -------------------------------------------
router.put("/", auth, async (req, res) => {
  const updated = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
  }).select("-password");

  res.json(updated);
});

// EXPORT ROUTER
module.exports = router;
