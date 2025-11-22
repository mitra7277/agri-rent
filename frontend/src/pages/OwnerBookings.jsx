// src/pages/OwnerBookings.jsx

import { useEffect, useState } from "react";
import api from "../services/api";   // ❗ FIXED: removed BASE_URL import
import Loader from "../components/Loader";
import PageHero from "../components/PageHero";
import { toast } from "react-toastify";

// ⭐ FIXED BASE_URL
const BASE_URL = "http://localhost:5000";

export default function OwnerBookings() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    if (!user?._id) return;
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const res = await api.get(`/bookings/owner/${user._id}`);
      setBookings(res.data || []);
    } catch (err) {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (bookingId, newStatus) => {
    try {
      setActionLoadingId(bookingId);

      if (newStatus === "approved") {
        await api.put(`/bookings/approve/${bookingId}`);
      } else if (newStatus === "rejected") {
        await api.put(`/bookings/reject/${bookingId}`);
      }

      toast.success(`Booking ${newStatus}`);

      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: newStatus } : b
        )
      );
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading)
    return (
      <div style={{ padding: 20 }}>
        <Loader />
      </div>
    );

  return (
    <div>
      <PageHero
        title="Bookings Overview"
        subtitle="See all your upcoming, ongoing and past bookings in one timeline."
        image="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80"
      />

      <div style={{ padding: 20, color: "var(--text)" }}>
        <h2>Owner Bookings</h2>
        <p style={{ color: "gray", marginTop: 4 }}>
          Manage all booking requests for your machines.
        </p>

        <div style={styles.grid}>
          {bookings.map((b) => {
            const machine = b.machineId || {};
            const farmer = b.farmerId || {};
            const start = new Date(b.startTime);
            const end = new Date(b.endTime);

            return (
              <div key={b._id} style={styles.card}>
                <div style={styles.imageBox}>
                  <img
                    src={
                      machine.image
                        ? `${BASE_URL}${machine.image}`
                        : "https://images.pexels.com/photos/1268458/pexels-photo-1268458.jpeg"
                    }
                    alt="machine"
                    style={styles.image}
                  />

                  <div style={styles.priceTag}>₹{b.totalPrice}</div>

                  <div style={styles.statusTag(getStatusColor(b.status))}>
                    {b.status.toUpperCase()}
                  </div>
                </div>

                <div style={styles.details}>
                  <h3 style={{ margin: 0 }}>
                    {machine.type} – {machine.model}
                  </h3>

                  <p style={styles.location}>📍 {machine.location}</p>

                  {/* Farmer Details */}
                  <div style={styles.farmerBox}>
                    <div style={styles.farmerAvatar}>
                      {farmer.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: "bold" }}>{farmer.name}</p>
                      <p style={{ margin: 0, fontSize: 12, opacity: 0.7 }}>
                        {farmer.email}
                      </p>
                    </div>
                  </div>

                  <p style={styles.timeText}>
                    🕒 <b>From:</b> {start.toLocaleString()}
                  </p>
                  <p style={styles.timeText}>
                    🕒 <b>To:</b> {end.toLocaleString()}
                  </p>

                  {b.status === "pending" && (
                    <div style={styles.actions}>
                      <button
                        className="btn-primary"
                        style={{ flex: 1 }}
                        disabled={actionLoadingId === b._id}
                        onClick={() => updateStatus(b._id, "approved")}
                      >
                        {actionLoadingId === b._id ? "Updating..." : "Approve"}
                      </button>

                      <button
                        className="btn-secondary"
                        style={{ flex: 1 }}
                        disabled={actionLoadingId === b._id}
                        onClick={() => updateStatus(b._id, "rejected")}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


/* ---------------- STYLES ---------------- */

const styles = {
  grid: {
    marginTop: 20,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(310px, 1fr))",
    gap: 20,
  },
  card: {
    borderRadius: 16,
    overflow: "hidden",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
    border: "1px solid rgba(255,255,255,0.2)",
  },
  imageBox: { position: "relative", height: 160 },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  priceTag: {
    position: "absolute",
    top: 10,
    right: 10,
    background: "rgba(0,0,0,0.7)",
    color: "white",
    padding: "4px 10px",
    borderRadius: 6,
    fontSize: 12,
  },
  statusTag: (bg) => ({
    position: "absolute",
    bottom: 10,
    right: 10,
    background: bg,
    color: "white",
    padding: "6px 12px",
    borderRadius: 16,
    fontSize: 12,
    fontWeight: 600,
  }),
  details: { padding: 14 },
  location: { margin: "4px 0", color: "gray" },
  farmerBox: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
    marginBottom: 8,
  },
  farmerAvatar: {
    width: 38,
    height: 38,
    borderRadius: "50%",
    background: "#1b5e20",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: 700,
    fontSize: 18,
  },
  timeText: { margin: "3px 0", fontSize: 13 },
  actions: { marginTop: 12, display: "flex", gap: 10 },
};

function getStatusColor(status) {
  if (status === "approved") return "#1b5e20";
  if (status === "rejected") return "#c62828";
  return "#c97a00"; // pending
}
