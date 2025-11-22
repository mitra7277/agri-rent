const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

// Load env + connect DB
dotenv.config();
connectDB();

const app = express();

// =============================
// MIDDLEWARES
// =============================
app.use(express.json({ limit: "10mb" }));

// ⭐ FIXED CORS FOR VERCEL + LOCAL
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://agri-rent-pink.vercel.app",
    ],
    credentials: true,
  })
);

// Serve uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =============================
// ROOT ROUTE FIX ✔
// =============================
app.get("/", (req, res) => {
  res.send("AgriRent Backend Running 🚜🔥");
});

// =============================
// ROUTES
// =============================
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/machines", require("./routes/machineRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/wallet", require("./routes/walletRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/equipment", require("./routes/equipmentRoutes"));
app.use("/api/calendar", require("./routes/calendarRoutes"));
app.use("/api/owner-analytics", require("./routes/ownerAnalyticsRoutes"));

// =============================
// SOCKET.IO
// =============================
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://agri-rent-pink.vercel.app"
    ],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("🔥 Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

// =============================
// START SERVER
// =============================
const PORT = process.env.PORT || 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server running on ${PORT}`)
);
