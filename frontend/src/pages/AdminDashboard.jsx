// src/pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import Loader from "../components/Loader";

const HERO_IMG =
  "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await axiosInstance.get("/admin/stats");
      setStats(res.data);
    } catch (err) {
      console.log("Admin stats error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        <Loader />
      </div>
    );
  }

  if (!stats) {
    return <p style={{ padding: 20 }}>Failed to load admin stats.</p>;
  }

  return (
    <div style={{ padding: 0, color: "var(--text)" }}>
      {/* HERO */}
      <div style={styles.hero}>
        <img src={HERO_IMG} alt="Admin Dashboard" style={styles.heroImg} />
        <div style={styles.heroText}>
          <h1 style={{ margin: 0 }}>Admin Control Center</h1>
          <p style={{ margin: 0 }}>
            Platform overview: users, machines, bookings & revenue.
          </p>
        </div>
      </div>

      {/* CARDS */}
      <div style={styles.cardsGrid}>
        <div className="card" style={styles.card}>
          <p style={styles.label}>Total Users</p>
          <p style={styles.big}>{stats.totalUsers}</p>
          <p style={styles.sub}>
            Farmers: {stats.totalFarmers} | Owners: {stats.totalOwners}
          </p>
        </div>

        <div className="card" style={styles.card}>
          <p style={styles.label}>Machines Listed</p>
          <p style={styles.big}>{stats.totalMachines}</p>
        </div>

        <div className="card" style={styles.card}>
          <p style={styles.label}>Total Bookings</p>
          <p style={styles.big}>{stats.totalBookings}</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  hero: {
    width: "100%",
    height: 140,
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 20,
    position: "relative",
  },
  heroImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    filter: "brightness(0.55)",
  },
  heroText: {
    position: "absolute",
    bottom: 12,
    left: 16,
    color: "white",
  },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
    gap: 14,
    marginTop: 16,
  },
  card: {
    padding: 14,
    borderRadius: 12,
    background: "white",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  label: {
    fontSize: 13,
    color: "gray",
  },
  big: {
    fontSize: 26,
    fontWeight: 700,
    marginTop: 4,
  },
  sub: {
    marginTop: 4,
    fontSize: 13,
    color: "gray",
  },
};
