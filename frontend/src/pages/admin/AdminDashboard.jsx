// src/pages/admin/AdminDashboard.jsx

import { useEffect, useState } from "react";
import api from "../../services/api";

import { motion } from "framer-motion";

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line, Pie } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadAdminStats();
  }, []);

  const loadAdminStats = async () => {
    try {
      const res = await api.get("/admin/stats");
      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  if (!stats) return <p style={{ padding: 20 }}>Loading Admin Stats...</p>;

  return (
    <div style={styles.container}>
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={styles.title}
      >
        Admin Dashboard
      </motion.h2>

      {/* ---- TOP STATS GRID ---- */}
      <div style={styles.grid}>
        <GlassCard label="Total Users" value={stats.totalUsers} />
        <GlassCard label="Farmers" value={stats.totalFarmers} />
        <GlassCard label="Owners" value={stats.totalOwners} />
        <GlassCard label="Machines" value={stats.totalMachines} />
        <GlassCard label="Bookings" value={stats.totalBookings} />
        <GlassCard label="Completed" value={stats.completedBookings} />
        <GlassCard label="Pending" value={stats.pendingBookings} />
        <GlassCard label="Earnings (₹)" value={stats.totalEarnings} />
      </div>

      {/* ---- CHARTS SECTION ---- */}
      <div style={styles.chartsRow}>
        {/* PIE CHART */}
        <div style={styles.chartBox}>
          <h3>Role Distribution</h3>
          <Pie
            data={{
              labels: ["Farmers", "Owners", "Admins"],
              datasets: [
                {
                  data: [
                    stats.totalFarmers,
                    stats.totalOwners,
                    stats.totalAdmins,
                  ],
                  backgroundColor: ["#1b5e20", "#ff9800", "#1976d2"],
                },
              ],
            }}
          />
        </div>

        {/* LINE CHART */}
        <div style={styles.chartBox}>
          <h3>Monthly Earnings</h3>
          <Line
            data={{
              labels: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ],
              datasets: [
                {
                  label: "Earnings (₹)",
                  data: stats.monthlyEarnings,
                  borderColor: "#1b5e20",
                  backgroundColor: "rgba(27,94,32,0.3)",
                  tension: 0.4,
                },
              ],
            }}
          />
        </div>
      </div>

      {/* ---- TOP MACHINES ---- */}
      <div style={styles.card}>
        <h3>Top Machines</h3>

        <div style={styles.machineGrid}>
          {stats.topMachines.map((m, i) => (
            <motion.div
              key={i}
              style={styles.machineCard}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <p style={styles.machineTitle}>
                {m.type} – {m.model}
              </p>
              <p>Location: {m.location}</p>
              <p>Bookings: {m.totalBookings}</p>
              <p>Earnings: ₹{m.earnings}</p>
              <p>⭐ {m.averageRating.toFixed(1)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function GlassCard({ label, value }) {
  return (
    <motion.div
      style={styles.glassCard}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <p style={styles.cardLabel}>{label}</p>
      <h2 style={styles.cardValue}>{value}</h2>
    </motion.div>
  );
}

const styles = {
  container: {
    padding: "20px",
    color: "var(--text)",
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 18,
  },
  glassCard: {
    padding: 18,
    borderRadius: 15,
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 0 15px rgba(0,0,0,0.15)",
  },
  cardLabel: {
    fontSize: 14,
    opacity: 0.8,
  },
  cardValue: {
    fontSize: 26,
    fontWeight: 700,
    marginTop: 5,
  },

  chartsRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
    marginTop: 25,
  },

  chartBox: {
    background: "white",
    padding: 20,
    borderRadius: 15,
    boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
  },

  card: {
    marginTop: 30,
    background: "white",
    padding: 20,
    borderRadius: 15,
    boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
  },

  machineGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 15,
    marginTop: 10,
  },

  machineCard: {
    padding: 12,
    borderRadius: 12,
    border: "1px solid #eee",
    background: "#fafafa",
  },

  machineTitle: {
    fontWeight: 700,
    fontSize: 16,
  },
};
