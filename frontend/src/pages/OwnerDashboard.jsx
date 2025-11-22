// src/pages/OwnerDashboard.jsx

import { useEffect, useState } from "react";
import api from "../services/api";   // ❗ FIXED: removed { BASE_URL }
import Loader from "../components/Loader";

// Chart.js
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

// ⭐ BASE_URL FIXED HERE
const BASE_URL = "http://localhost:5000"; 

const HERO_IMG =
  "https://images.unsplash.com/photo-1590559899731-a382839e5549?auto=format&fit=crop&w=1200&q=80";

export default function OwnerDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?._id) return;
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [statsRes, analyticsRes] = await Promise.all([
        api.get(`/bookings/owner-stats/${user._id}`),
        api.get(`/machines/owner-machine-analytics/${user._id}`),
      ]);
      setStats(statsRes.data);
      setAnalytics(analyticsRes.data);
    } catch (err) {
      console.log("Owner dashboard error:", err.response || err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats || !analytics) {
    return (
      <div style={{ padding: 20 }}>
        <Loader />
      </div>
    );
  }

  const { topMachine, machines } = analytics;

  const monthly = stats.monthlyEarnings || Array(12).fill(0);
  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  const totalYear = monthly.reduce((a, b) => a + b, 0);
  const lastMonth = monthly[11] || 0;
  const prevMonth = monthly[10] || 0;
  const diff = lastMonth - prevMonth;
  const trend = diff > 0 ? "up" : diff < 0 ? "down" : "flat";

  return (
    <div style={{ padding: 20, color: "var(--text)" }}>

      {/* HERO SECTION */}
      <div style={styles.hero}>
        <img src={HERO_IMG} style={styles.heroImg} />

        <div style={styles.heroText}>
          <h1>Owner Dashboard</h1>
          <p>Manage machines, bookings & earnings in one place.</p>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div style={styles.summaryGrid}>
        <div style={{ ...styles.card, background: "#1b5e20", color: "white" }}>
          <p style={styles.label}>Total Earnings</p>
          <p style={styles.big}>₹{stats.totalEarnings}</p>
          <p style={styles.sub}>This year</p>
        </div>

        <div style={{ ...styles.card, background: "#1565c0", color: "white" }}>
          <p style={styles.label}>Total Bookings</p>
          <p style={styles.big}>{stats.totalBookings}</p>
          <p style={styles.sub}>All time</p>
        </div>

        <div style={{ ...styles.card, background: "#ef6c00", color: "white" }}>
          <p style={styles.label}>Completed</p>
          <p style={styles.big}>{stats.completed}</p>
          <p style={styles.sub}>Successfully served</p>
        </div>

        <div style={{ ...styles.card, background: "#8e24aa", color: "white" }}>
          <p style={styles.label}>Pending</p>
          <p style={styles.big}>{stats.pending}</p>
          <p style={styles.sub}>Awaiting action</p>
        </div>
      </div>

      {/* MONTHLY CHART */}
      <div style={styles.chartCard}>
        <h3>Monthly Earnings (₹)</h3>
        <Line
          data={{
            labels: months,
            datasets: [
              {
                label: "Earnings",
                data: monthly,
                borderColor: "#1b5e20",
                backgroundColor: "rgba(27,94,32,0.2)",
                tension: 0.3,
              },
            ],
          }}
          options={{ plugins: { legend: { display: false } } }}
        />
      </div>

      {/* QUICK REPORT */}
      <div style={styles.quickGrid}>
        <div style={styles.quickItem}>
          <span>Total Year Earnings</span>
          <b>₹{totalYear}</b>
        </div>

        <div style={styles.quickItem}>
          <span>Last Month</span>
          <b>₹{lastMonth}</b>
        </div>

        <div style={styles.quickItem}>
          <span>Compared to previous month</span>
          <b
            style={{
              color:
                trend === "up"
                  ? "#2e7d32"
                  : trend === "down"
                  ? "#c62828"
                  : "#666",
            }}
          >
            {trend === "flat"
              ? "No change"
              : `${trend === "up" ? "↑" : "↓"} ₹${Math.abs(diff)}`}
          </b>
        </div>
      </div>

      {/* TOP MACHINE */}
      <div style={styles.topCard}>
        <h3>Top Performing Machine</h3>

        {!topMachine ? (
          <p style={{ color: "gray" }}>No data available.</p>
        ) : (
          <div style={styles.topRow}>
            <img
              src={
                topMachine.image
                  ? `${BASE_URL}${topMachine.image}`
                  : "https://images.unsplash.com/photo-1608571423904-47659c7755b3"
              }
              style={styles.topImg}
            />

            <div>
              <p style={styles.topTitle}>
                {topMachine.type} – {topMachine.model}
              </p>
              <p>📍 {topMachine.location}</p>
              <p>
                ⭐ {topMachine.averageRating?.toFixed(1)} ({topMachine.totalBookings} bookings)
              </p>
              <p>
                Total Earnings: <b style={{ color: "#1b5e20" }}>₹{topMachine.earnings}</b>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* MACHINE-WISE CARDS */}
      <div style={styles.machineCard}>
        <h3>Machine-wise Performance</h3>

        {machines.length === 0 ? (
          <p style={{ color: "gray" }}>No analytics available.</p>
        ) : (
          <div style={styles.machineGrid}>
            {machines.map((m) => (
              <div key={m.machineId} style={styles.mCard}>
                <p style={styles.mTitle}>{m.type} – {m.model}</p>
                <p>📍 {m.location}</p>
                <p>Bookings: {m.totalBookings}</p>
                <p>⭐ {m.averageRating?.toFixed(1)}</p>
                <p style={styles.mEarn}>₹{m.earnings}</p>
              </div>
            ))}
          </div>
        )}
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
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 16,
  },
  card: {
    padding: 14,
    borderRadius: 14,
  },
  label: { fontSize: 13, opacity: 0.8 },
  big: { fontSize: 28, fontWeight: 700 },
  sub: { fontSize: 12, opacity: 0.8 },
  chartCard: {
    marginTop: 22,
    padding: 18,
    borderRadius: 14,
    background: "var(--card-bg)",
  },
  quickGrid: {
    marginTop: 20,
    padding: 16,
    borderRadius: 14,
    background: "var(--card-bg)",
    display: "grid",
    gap: 8,
  },
  quickItem: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 14,
  },
  topCard: {
    marginTop: 24,
    padding: 18,
    borderRadius: 14,
    background: "var(--card-bg)",
  },
  topRow: { display: "flex", gap: 16 },
  topImg: {
    width: 180,
    height: 150,
    objectFit: "cover",
    borderRadius: 12,
  },
  topTitle: { fontWeight: 700, fontSize: 18 },
  machineCard: {
    marginTop: 24,
    padding: 18,
    borderRadius: 14,
    background: "var(--card-bg)",
  },
  machineGrid: {
    marginTop: 12,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
  },
  mCard: {
    padding: 12,
    borderRadius: 12,
    background: "#fff",
    border: "1px solid #ddd",
  },
  mTitle: { fontWeight: 600 },
  mEarn: { marginTop: 6, fontWeight: 700, color: "#1b5e20" },
};
