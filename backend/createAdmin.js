// createAdmin.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

const User = require("./models/User");

// MongoDB Connect
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error:", err));

async function createAdmin() {
  try {
    const email = "admin@gmail.com";

    // Check if exists
    const exist = await User.findOne({ email });
    if (exist) {
      console.log("❗ Admin already exists");
      return process.exit();
    }

    // Create admin
    const hashedPassword = await bcrypt.hash("123456", 10);

    const admin = await User.create({
      name: "Super Admin",
      email: email,
      password: hashedPassword,
      role: "admin",
      location: "India",
    });

    console.log("✅ Admin created successfully:");
    console.log(admin);
    process.exit();
  } catch (err) {
    console.log("❌ Error:", err);
    process.exit();
  }
}

createAdmin();
