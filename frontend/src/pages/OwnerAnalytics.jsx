// src/pages/OwnerAnalytics.jsx

import { useEffect, useState } from "react";
import api from "../services/api";  // ❗ FIXED: Removed BASE_URL import
import Loader from "../components/Loader";
import PageHero from "../components/PageHero";

// ⭐ ADD THIS (your API domain)
const BASE_URL = "http://localhost:5000";

export default function OwnerAnalytics() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [data, setData] = useState(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const res = await api.get(`/machines/owner-machine-analytics/${user._id}`);
      setData(res.data);
    } catch (err) {
      console.log("Analytics error:", err);
    }
  };

  if (!data) {
    return (
      <div style={{ padding: 20 }}>
        <Loader />
      </div>
    );
  }

  const top = data.topMachine;

  return (
    <div style={{ paddingBottom: 40 }}>

      <PageHero
        title="Machine Analytics"
        subtitle="Track performance, bookings and earnings of every machine."
        image="https://images.unsplash.com/photo-1564078516393-cf04bd966897?auto=format&fit=crop&w=1200&q=80"
      />

      <div style={{ padding: 20, color: "var(--text)" }}>

        {top && (
          <div style={styles.topCard}>
            <div style={styles.topLeft}>
              <img
                src={
                  top.image
                    ? `${BASE_URL}${top.image}`
                    : "https://images.pexels.com/photos/1268458/pexels-photo-1268458.jpeg"
                }
                style={styles.topImage}
                alt="machine"
              />

              <div style={styles.topBadge}>🔥 Top Machine</div>
            </div>

            <div style={styles.topRight}>
              <h3 style={{ marginBottom: 6 }}>
                {top.type} — {top.model}
              </h3>

              <p>📍 {top.location}</p>

              <p style={styles.statsLine}>
                ⭐ Rating: <b>{top.averageRating?.toFixed(1)}</b>
              </p>

              <p style={styles.statsLine}>
                📊 Total Bookings: <b>{top.totalBookings}</b>
              </p>

              <p style={styles.statsLine}>
                💰 Total Earnings:{" "}
                <b style={{ color: "#1b5e20" }}>₹ {top.earnings}</b>
              </p>
            </div>
          </div>
        )}

        <h3 style={{ marginTop: 25, marginBottom: 10 }}>
          Machine-wise Analytics
        </h3>

        <div style={styles.grid}>
          {data.machines.map((m) => (
            <div key={m.machineId} style={styles.card}>
              <div style={styles.imageWrapper}>
                <img
                  src={
                    m.image
                      ? `${BASE_URL}${m.image}`
                      : "https://images.pexels.com/photos/1268458/pexels-photo-1268458.jpeg"
                  }
                  style={styles.image}
                  alt="machine"
                />
                <div style={styles.rateTag}>
                  ⭐ {m.averageRating.toFixed(1)}
                </div>
              </div>

              <div style={{ padding: 12 }}>
                <h3 style={styles.title}>{m.type}</h3>
                <p style={styles.subtitle}>{m.model}</p>
                <p style={styles.location}>📍 {m.location}</p>

                <div style={styles.infoRow}>
                  <span>Bookings</span>
                  <b>{m.totalBookings}</b>
                </div>

                <div style={styles.infoRow}>
                  <span>Earnings</span>
                  <b style={{ color: "#1b5e20" }}>₹ {m.earnings}</b>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}


/* ---------------- STYLES ---------------- */

const styles = {
  topCard: {
    marginTop: 20,
    display: "grid",
    gridTemplateColumns: "1.1fr 1.6fr",
    gap: 20,
    borderRadius: 18,
    padding: 16,
    background: "var(--card-bg)",
    boxShadow: "0 4px 18px rgba(0,0,0,0.15)",
  },
  topLeft: {
    position: "relative",
    borderRadius: 14,
    overflow: "hidden",
    boxShadow: "0 8px 18px rgba(0,0,0,0.25)",
  },
  topImage: {
    width: "100%",
    height: 220,
    objectFit: "cover",
  },
  topBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    background: "#ff5722",
    color: "white",
    padding: "5px 10px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
  },
  topRight: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  statsLine: {
    margin: "6px 0",
    fontSize: 14,
  },
  grid: {
    marginTop: 15,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 18,
  },
  card: {
    borderRadius: 14,
    background: "var(--card-bg)",
    overflow: "hidden",
    boxShadow: "0 3px 10px rgba(0,0,0,0.12)",
    transition: "0.3s",
  },
  imageWrapper: { position: "relative", overflow: "hidden" },
  image: {
    width: "100%",
    height: 150,
    objectFit: "cover",
  },
  rateTag: {
    position: "absolute",
    bottom: 10,
    right: 10,
    background: "rgba(255,255,255,0.9)",
    padding: "4px 10px",
    borderRadius: 10,
    fontWeight: 600,
    fontSize: 12,
    color: "#1b5e20",
  },
  title: { margin: 0, fontSize: 18, fontWeight: 700 },
  subtitle: { margin: "4px 0", color: "gray", fontSize: 13 },
  location: { margin: "4px 0", fontSize: 14 },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 8,
    fontSize: 14,
  },
};
