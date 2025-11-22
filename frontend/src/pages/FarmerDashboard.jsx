// src/pages/FarmerDashboard.jsx

import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import PageHero from "../components/PageHero";

const BASE_URL = "http://localhost:5000";

// 🌟 HD Machine Banner Image (Perfect for Hackathon)
const HERO_MACHINE_IMG =
  "https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=1600";

;


export default function FarmerDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [machines, setMachines] = useState([]);
  const [nearestMachines, setNearestMachines] = useState([]);

  const [stats, setStats] = useState({
    totalBookings: 0,
    activeBookings: 0,
    approvedBookings: 0,
    totalSpent: 0,
  });

  // =====================
  // LOAD DASHBOARD DATA
  // =====================
  useEffect(() => {
    if (!user?._id) return;
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const bookingRes = await api.get(`/bookings/farmer/${user._id}`);
      const machineRes = await api.get("/machines");

      const allBookings = bookingRes.data || [];
      const allMachines = machineRes.data || [];

      setBookings(allBookings);
      setMachines(allMachines);

      const totalBookings = allBookings.length;
      const activeBookings = allBookings.filter(
        (b) => b.status === "pending" || b.status === "approved"
      ).length;

      const approved = allBookings.filter((b) => b.status === "approved");
      const totalSpent = approved.reduce(
        (sum, b) => sum + (b.totalPrice || 0),
        0
      );

      setStats({
        totalBookings,
        activeBookings,
        approvedBookings: approved.length,
        totalSpent,
      });
    } catch (err) {
      console.log("Farmer dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  // =====================
  // NEAREST MACHINE
  // =====================
  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Location not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const res = await api.post("/machines/nearest", {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });

        setNearestMachines(res.data || []);
      } catch (err) {
        console.log("Nearest machine error:", err);
      }
    });
  };

  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        <Loader />
      </div>
    );
  }

  const recentBookings = [...bookings]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  let recommendedMachines = [...machines].sort(
    (a, b) => (b.averageRating || 0) - (a.averageRating || 0)
  );

  if (user?.location) {
    recommendedMachines = recommendedMachines.sort((a, b) => {
      const aSame = a.location === user.location ? 1 : 0;
      const bSame = b.location === user.location ? 1 : 0;
      return bSame - aSame;
    });
  }

  recommendedMachines = recommendedMachines.slice(0, 4);

  return (
    <div style={{ padding: 0 }}>
      {/* 🔥 TOP HERO WITH MACHINE IMAGE */}
      <PageHero
        title="Farmer Dashboard"
        subtitle="Track bookings, spending, and get machine recommendations."
        image={HERO_MACHINE_IMG}
      />

      <div style={{ padding: 24 }}>
        {/* HEADER */}
        <div style={styles.headerRow}>
          <div>
            <h2>Welcome, {user?.name || "Farmer"} 👋</h2>
            <p style={{ color: "#64748b", marginTop: 4 }}>
              Overview of your bookings and machine suggestions.
            </p>
          </div>

          <button className="btn-primary" onClick={() => nav("/farmer/machines")}>
            + Book New Machine
          </button>
        </div>

        {/* STATS */}
        <div style={styles.statsGrid}>
          <div className="card" style={styles.statCard}>
            <p style={styles.statLabel}>Total Bookings</p>
            <p style={styles.statNumber}>{stats.totalBookings}</p>
          </div>

          <div className="card" style={styles.statCard}>
            <p style={styles.statLabel}>Active</p>
            <p style={{ ...styles.statNumber, color: "#c97a00" }}>
              {stats.activeBookings}
            </p>
          </div>

          <div className="card" style={styles.statCard}>
            <p style={styles.statLabel}>Approved</p>
            <p style={{ ...styles.statNumber, color: "#16a34a" }}>
              {stats.approvedBookings}
            </p>
          </div>

          <div className="card" style={styles.statCard}>
            <p style={styles.statLabel}>Total Spent</p>
            <p style={{ ...styles.statNumber, color: "#0f766e" }}>
              ₹{stats.totalSpent}
            </p>
          </div>
        </div>

        {/* PANELS */}
        <div style={styles.twoCol}>
          {/* LEFT - Recent Bookings */}
          <div className="card" style={styles.panel}>
            <div style={styles.panelHeader}>
              <h3>Recent Bookings</h3>
              <button
                className="btn-secondary"
                onClick={() => nav("/farmer/bookings")}
              >
                View All
              </button>
            </div>

            {recentBookings.length === 0 ? (
              <p style={{ color: "#94a3b8" }}>No bookings yet.</p>
            ) : (
              recentBookings.map((b) => {
                const machine = b.machineId || {};
                const start = new Date(b.startTime);

                return (
                  <div key={b._id} style={styles.bookingCard}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <div>
                        <p style={{ margin: 0, fontWeight: 600 }}>
                          {machine.type} – {machine.model}
                        </p>
                        <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>
                          📍 {machine.location}
                        </p>
                        <p style={{ marginTop: 4, fontSize: 13 }}>
                          Start: {start.toLocaleString()}
                        </p>
                      </div>

                      <span style={getStatusPillStyle(b.status)}>
                        {b.status.toUpperCase()}
                      </span>
                    </div>

                    <p style={{ marginTop: 6, fontSize: 13 }}>
                      Total: <b>₹{b.totalPrice}</b>
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {/* RIGHT - Recommended Machines */}
          <div className="card" style={styles.panel}>
            <h3>Recommended Machines</h3>

            {recommendedMachines.length === 0 ? (
              <p style={{ color: "#94a3b8" }}>No machines available.</p>
            ) : (
              <div style={styles.machineGrid}>
                {recommendedMachines.map((m) => (
                  <div key={m._id} style={styles.machineCard}>
                    {m.image && (
                      <img
                        src={`${BASE_URL}${m.image}`}
                        alt={m.type}
                        style={styles.machineImage}
                      />
                    )}

                    <p style={{ margin: "6px 0", fontWeight: 600 }}>
                      {m.type} – {m.model}
                    </p>

                    <p style={{ margin: 0, fontSize: 13 }}>📍 {m.location}</p>

                    <p style={{ margin: "4px 0", fontSize: 13 }}>
                      ⭐ {m.averageRating || 0}
                    </p>

                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>
                      ₹{m.pricePerHour}/hr
                    </p>

                    <button
                      className="btn-primary"
                      style={{ marginTop: 8, width: "100%" }}
                      onClick={() => nav(`/farmer/book/${m._id}`)}
                    >
                      Book Now
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------- STYLES ----------------

const styles = {
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 16,
    marginTop: 20,
  },
  statCard: {
    padding: 16,
    borderRadius: 18,
    background: "linear-gradient(135deg,#ecfdf3,#dcfce7)",
    boxShadow: "0 10px 25px rgba(22,163,74,0.12)",
    border: "1px solid #bbf7d0",
  },
  statLabel: { fontSize: 13, color: "#64748b" },
  statNumber: { fontSize: 24, fontWeight: "bold", marginTop: 4 },
  twoCol: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
    marginTop: 24,
  },
  panel: {
    borderRadius: 18,
    padding: 18,
    background: "#ffffff",
    boxShadow: "0 10px 25px rgba(15,23,42,0.06)",
  },
  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "center",
  },
  bookingCard: {
    padding: 10,
    marginBottom: 8,
    borderRadius: 12,
    border: "1px solid #e2e8f0",
    background: "#f8fafc",
  },
  machineGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 12,
  },
  machineCard: {
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: 10,
    background: "#ffffff",
  },
  machineImage: {
    width: "100%",
    height: 90,
    borderRadius: 10,
    objectFit: "cover",
    marginBottom: 6,
    background: "#e2e8f0",
  },
};

function getStatusPillStyle(status) {
  let bg = "#e2e8f0";
  let color = "#0f172a";

  if (status === "pending") {
    bg = "#fef9c3";
    color = "#a16207";
  } else if (status === "approved") {
    bg = "#dcfce7";
    color = "#166534";
  } else if (status === "rejected") {
    bg = "#fee2e2";
    color = "#b91c1c";
  }

  return {
    padding: "3px 10px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 600,
    background: bg,
    color,
  };
}

