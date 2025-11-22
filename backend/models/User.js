const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["farmer", "owner", "admin"],
      default: "farmer",
    },

    // Optional profile details
    location: { type: String },
    phone: { type: String },
    avatar: { type: String },
    bio: { type: String },
    experienceYears: { type: Number, default: 0 },
    landSize: { type: String },
    mainCrops: { type: String },

    walletBalance: { type: Number, default: 0 },

    isBlocked: { type: Boolean, default: false },

    refreshToken: { type: String, default: "" },
  },
  { timestamps: true }
);

// Password hashing — runs ONLY when password changed
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("User", userSchema);
