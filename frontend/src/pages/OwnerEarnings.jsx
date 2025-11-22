// src/pages/OwnerEarnings.jsx

import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";

import { Line, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import PageHero from "../components/PageHero";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function OwnerEarnings() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [stats, setStats] = useState(null);
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?._id) return;
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [earnRes, machineRes] = await Promise.all([
        api.get(`/bookings/owner-earnings/${user._id}`),
        api.get(`/machines`),
      ]);

      setStats(earnRes.data || null);
      setMachines(machineRes.data || []);
    } catch (err) {
      console.log("Owner earnings load error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div style={{ padding: 20 }}>
        <Loader />
      </div>
    );
  }

  const machineWise = stats.machineWise || {};
  const bookings = stats.bookings || [];

  const ownerMachines = machines.filter((m) => {
    const ownerId = m.owner?._id || m.owner;
    return String(ownerId) === String(user._id);
  });

  const machineLabels = ownerMachines.map(
    (m) => `${m.type}${m.model ? " – " + m.model : ""}`
  );
  const machineValues = ownerMachines.map((m) => machineWise[m._id] || 0);

  const machineBarData = {
    labels: machineLabels,
    datasets: [
      {
        label: "Earnings (₹)",
        data: machineValues,
        backgroundColor: "rgba(27,94,32,0.3)",
        borderColor: "#1b5e20",
        borderWidth: 1,
      },
    ],
  };

  const dailyMap = {};
  bookings.forEach((b) => {
    const d = new Date(b.createdAt);
    const key = d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
    if (!dailyMap[key]) dailyMap[key] = 0;
    dailyMap[key] += b.totalPrice || 0;
  });

  const dailyLabels = Object.keys(dailyMap);
  const dailyValues = Object.values(dailyMap);

  const dailyLineData = {
    labels: dailyLabels,
    datasets: [
      {
        label: "Daily Earnings (₹)",
        data: dailyValues,
        borderColor: "#1565c0",
        backgroundColor: "rgba(21,101,192,0.2)",
        tension: 0.3,
        pointRadius: 4,
      },
    ],
  };

  let walletCount = 0;
  let cashCount = 0;

  bookings.forEach((b) => {
    if (b.paymentMode === "wallet") walletCount++;
    else cashCount++;
  });

  const paymentData = {
    labels: ["Wallet", "Cash"],
    datasets: [
      {
        data: [walletCount, cashCount],
        backgroundColor: ["rgba(46,125,50,0.7)", "rgba(255,143,0,0.7)"],
        borderColor: ["#2e7d32", "#ff8f00"],
      },
    ],
  };

  return (
    <div>

      <PageHero
        title="Earnings & Payouts"
        subtitle="Track your daily, monthly and machine-wise earnings in real-time."
        image="https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=1200&q=80"
      />

      <div style={{ padding: 20 }}>

        <div style={styles.headerRow}>
          <div>
            <h2>Owner Earnings Dashboard 💰</h2>
            <p style={{ color: "gray", marginTop: 4 }}>
              Check your total earnings, trends, and machine-wise performance.
            </p>
          </div>
          <div style={styles.ownerBox}>
            <span style={{ fontSize: 12, opacity: 0.8 }}>Logged in as</span>
            <div style={{ fontWeight: 600 }}>{user?.name}</div>
          </div>
        </div>

        <div style={styles.summaryGrid}>
          <div style={{ ...styles.summaryCard, background: "linear-gradient(135deg,#1b5e20,#43a047)" }}>
            <p style={styles.summaryLabel}>Total Earnings</p>
            <p style={styles.summaryValue}>₹ {stats.totalEarnings}</p>
            <p style={styles.summaryHint}>All-time</p>
          </div>

          <div style={{ ...styles.summaryCard, background: "linear-gradient(135deg,#1565c0,#42a5f5)" }}>
            <p style={styles.summaryLabel}>This Month</p>
            <p style={styles.summaryValue}>₹ {stats.monthEarnings}</p>
            <p style={styles.summaryHint}>Current month</p>
          </div>

          <div style={{ ...styles.summaryCard, background: "linear-gradient(135deg,#ef6c00,#ffa726)" }}>
            <p style={styles.summaryLabel}>Today</p>
            <p style={styles.summaryValue}>₹ {stats.todayEarnings}</p>
            <p style={styles.summaryHint}>Since midnight</p>
          </div>

          <div style={{ ...styles.summaryCard, background: "linear-gradient(135deg,#4a148c,#7b1fa2)" }}>
            <p style={styles.summaryLabel}>Total Bookings</p>
            <p style={styles.summaryValue}>{stats.totalBookings}</p>
            <p style={styles.summaryHint}>Approved + Completed</p>
          </div>
        </div>

        <div style={styles.chartRow}>
          <div style={styles.chartCard}>
            <h3>Daily Earnings</h3>
            {dailyLabels.length === 0 ? (
              <p style={{ color: "gray" }}>No earnings yet.</p>
            ) : (
              <Line data={dailyLineData} />
            )}
          </div>

          <div style={styles.chartCard}>
            <h3>Payment Mode Split</h3>
            {walletCount + cashCount === 0 ? (
              <p style={{ color: "gray" }}>No data.</p>
            ) : (
              <div style={{ maxWidth: 260, margin: "0 auto" }}>
                <Doughnut data={paymentData} />
              </div>
            )}
          </div>
        </div>

        <div style={styles.chartCardWide}>
          <h3>Machine-wise Earnings</h3>
          {ownerMachines.length === 0 ? (
            <p style={{ color: "gray" }}>No machines yet.</p>
          ) : (
            <Bar data={machineBarData} />
          )}
        </div>

        <h3 style={{ marginTop: 24 }}>Detailed Machine-wise Stats</h3>

        <div style={styles.machineGrid}>
          {ownerMachines.map((m) => (
            <div key={m._id} style={styles.machineCard}>
              <h4>{m.type}{m.model ? " – " + m.model : ""}</h4>
              <p style={{ fontSize: 13, color: "gray" }}>📍 {m.location}</p>
              <p style={{ marginTop: 6 }}>
                <b style={{ color: "#1b5e20" }}>₹ {machineWise[m._id] || 0}</b>
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ownerBox: {
    padding: "8px 14px",
    borderRadius: 12,
    background: "var(--card-bg)",
  },
  summaryGrid: {
    marginTop: 20,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 16,
  },
  summaryCard: {
    padding: 14,
    borderRadius: 16,
    color: "white",
  },
  summaryLabel: {
    fontSize: 12,
    opacity: 0.9,
  },
  summaryValue: {
    fontSize: 26,
    fontWeight: 700,
    marginTop: 4,
  },
  summaryHint: {
    marginTop: 4,
    opacity: 0.8,
  },
  chartRow: {
    marginTop: 22,
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr",
    gap: 16,
  },
  chartCard: {
    padding: 16,
    borderRadius: 16,
    background: "var(--card-bg)",
  },
  chartCardWide: {
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    background: "var(--card-bg)",
  },
  machineGrid: {
    marginTop: 14,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14,
  },
  machineCard: {
    padding: 12,
    background: "white",
    borderRadius: 12,
    border: "1px solid #ddd",
  },
};
