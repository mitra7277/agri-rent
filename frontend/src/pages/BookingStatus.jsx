// src/pages/BookingStatus.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Loader from "../components/Loader";

const BASE_URL = "http://localhost:5000";

export default function BookingStatus() {
  const user = JSON.parse(localStorage.getItem("user"));
  const nav = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all | active | completed | cancelled

  useEffect(() => {
    if (!user?._id) return;
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/bookings/farmer/${user._id}`);
      const list = (res.data || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setBookings(list);
    } catch (err) {
      console.log("Farmer bookings error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filter === "all") return true;

    if (filter === "active") {
      return b.status === "pending" || b.status === "approved";
    }

    if (filter === "completed") {
      return b.status === "completed";
    }

    if (filter === "cancelled") {
      return b.status === "rejected" || b.status === "cancelled";
    }

    return true;
  });

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <Loader />
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      {/* HERO */}
      <div style={styles.hero}>
        <div>
          <h1 style={styles.heroTitle}>My Bookings</h1>
          <p style={styles.heroSubtitle}>
            Track all your machine rental requests, payments and status in one place.
          </p>
        </div>
        <div style={styles.heroBadge}>
          <span role="img" aria-label="tractor">
            🚜
          </span>{" "}
          {bookings.length} total bookings
        </div>
      </div>

      {/* FILTER CHIPS */}
      <div style={styles.filterRow}>
        <FilterChip
          label="All"
          active={filter === "all"}
          onClick={() => setFilter("all")}
        />
        <FilterChip
          label="Active"
          active={filter === "active"}
          onClick={() => setFilter("active")}
        />
        <FilterChip
          label="Completed"
          active={filter === "completed"}
          onClick={() => setFilter("completed")}
        />
        <FilterChip
          label="Cancelled"
          active={filter === "cancelled"}
          onClick={() => setFilter("cancelled")}
        />
      </div>

      {/* EMPTY STATE */}
      {filteredBookings.length === 0 && (
        <div style={styles.emptyCard}>
          <div style={styles.emptyIcon}>📭</div>
          <h3 style={{ marginBottom: 6 }}>No bookings in this category</h3>
          <p style={{ margin: 0, color: "#6b7280", fontSize: 14 }}>
            You haven&apos;t booked any machines yet, or they don&apos;t match this filter.
          </p>
          <button
            className="btn-primary"
            style={{ marginTop: 14 }}
            onClick={() => nav("/farmer/machines")}
          >
            Find Machines
          </button>
        </div>
      )}

      {/* BOOKINGS LIST */}
      <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 12 }}>
        {filteredBookings.map((b) => {
          const m = b.machineId || {};
          const start = b.startTime ? new Date(b.startTime) : null;
          const end = b.endTime ? new Date(b.endTime) : null;

          // image handle: support uploads + external url
          let imgSrc = "";
          if (m.images && m.images.length > 0) {
            imgSrc = m.images[0].startsWith("http")
              ? m.images[0]
              : `${BASE_URL}${m.images[0]}`;
          } else if (m.image) {
            imgSrc = m.image.startsWith("http") ? m.image : `${BASE_URL}${m.image}`;
          } else {
            imgSrc =
              "https://images.pexels.com/photos/175338/pexels-photo-175338.jpeg?auto=compress&cs=tinysrgb&w=800";
          }

          return (
            <div key={b._id} style={styles.bookingCard}>
              {/* LEFT IMAGE */}
              <div style={styles.imageWrapper}>
                <img src={imgSrc} alt={m.type} style={styles.image} />
              </div>

              {/* MIDDLE INFO */}
              <div style={{ flex: 1 }}>
                <div style={styles.cardHeader}>
                  <div>
                    <p style={styles.machineTitle}>
                      {m.type || "Machine"} – {m.model || "Model"}
                    </p>
                    <p style={styles.machineLocation}>📍 {m.location || "Location not set"}</p>
                  </div>
                  <StatusPill status={b.status} />
                </div>

                <div style={styles.metaRow}>
                  <InfoTag
                    label="Start"
                    value={start ? formatDateTime(start) : "—"}
                  />
                  <InfoTag
                    label="End"
                    value={end ? formatDateTime(end) : "—"}
                  />
                  <InfoTag
                    label="Hours"
                    value={b.totalHours ? `${b.totalHours} hr` : "—"}
                  />
                  <InfoTag
                    label="Total"
                    value={b.totalPrice ? `₹${b.totalPrice}` : "—"}
                  />
                </div>

                <p style={styles.notes}>
                  Payment:{" "}
                  <strong style={{ textTransform: "capitalize" }}>
                    {b.paymentMethod || "cash"}
                  </strong>
                  {b.transactionId && (
                    <>
                      {" "}
                      · Txn ID: <span style={{ fontFamily: "monospace" }}>{b.transactionId}</span>
                    </>
                  )}
                </p>
              </div>

              {/* RIGHT ACTIONS */}
              <div style={styles.actionCol}>
                <button
                  className="btn-secondary"
                  style={styles.actionBtn}
                  onClick={() => nav(`/machine/${m._id}`)}
                >
                  View Machine
                </button>

                {b.status === "pending" && (
                  <button
                    className="btn-primary"
                    style={styles.actionBtnFilled}
                    onClick={() => nav(`/farmer/book/${m._id}`)}
                  >
                    Complete Booking
                  </button>
                )}

                {b.status === "approved" && b.paymentStatus !== "paid" && (
                  <button
                    className="btn-primary"
                    style={styles.actionBtnFilled}
                    onClick={() => nav(`/farmer/book/${m._id}`)}
                  >
                    Pay Now
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- SMALL COMPONENTS ---------- */

function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 12px",
        borderRadius: 999,
        border: active ? "1px solid #16a34a" : "1px solid #e2e8f0",
        background: active ? "rgba(22,163,74,0.08)" : "#ffffff",
        color: active ? "#166534" : "#64748b",
        fontSize: 13,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

function StatusPill({ status = "pending" }) {
  let bg = "#e2e8f0";
  let color = "#0f172a";
  let label = status.toUpperCase();

  if (status === "pending") {
    bg = "#fef3c7";
    color = "#92400e";
    label = "PENDING";
  } else if (status === "approved") {
    bg = "#dcfce7";
    color = "#166534";
    label = "APPROVED";
  } else if (status === "completed") {
    bg = "#dbeafe";
    color = "#1d4ed8";
    label = "COMPLETED";
  } else if (status === "rejected" || status === "cancelled") {
    bg = "#fee2e2";
    color = "#b91c1c";
    label = "CANCELLED";
  }

  return (
    <span
      style={{
        padding: "4px 10px",
        borderRadius: 999,
        background: bg,
        color,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: 0.3,
      }}
    >
      {label}
    </span>
  );
}

function InfoTag({ label, value }) {
  return (
    <div style={{ minWidth: 120 }}>
      <div style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase" }}>
        {label}
      </div>
      <div style={{ fontSize: 13, color: "#111827" }}>{value}</div>
    </div>
  );
}

function formatDateTime(date) {
  return `${date.toLocaleDateString()} · ${date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

/* ---------- STYLES ---------- */

const styles = {
  hero: {
    borderRadius: 16,
    padding: 18,
    background:
      "linear-gradient(135deg, #ecfdf5 0%, #dcfce7 40%, #e0f2fe 100%)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    border: "1px solid #bbf7d0",
  },
  heroTitle: {
    margin: 0,
    fontSize: 22,
    fontWeight: 700,
    color: "#064e3b",
  },
  heroSubtitle: {
    marginTop: 4,
    marginBottom: 0,
    fontSize: 14,
    color: "#166534",
  },
  heroBadge: {
    padding: "6px 12px",
    borderRadius: 999,
    background: "rgba(15,23,42,0.07)",
    fontSize: 13,
    color: "#0f172a",
  },
  filterRow: {
    marginTop: 12,
    marginBottom: 12,
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },
  emptyCard: {
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    background: "#f9fafb",
    border: "1px dashed #cbd5f5",
    textAlign: "center",
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 6,
  },
  bookingCard: {
    display: "flex",
    gap: 14,
    padding: 14,
    borderRadius: 14,
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    boxShadow: "0 8px 18px rgba(15,23,42,0.04)",
  },
  imageWrapper: {
    width: 120,
    height: 90,
    borderRadius: 12,
    overflow: "hidden",
    background: "#e5e7eb",
    flexShrink: 0,
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
  },
  machineTitle: {
    margin: 0,
    fontWeight: 600,
    fontSize: 15,
    color: "#0f172a",
  },
  machineLocation: {
    margin: 0,
    marginTop: 2,
    fontSize: 13,
    color: "#6b7280",
  },
  metaRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 14,
    marginTop: 8,
  },
  notes: {
    marginTop: 6,
    fontSize: 12,
    color: "#6b7280",
  },
  actionCol: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    justifyContent: "center",
    marginLeft: 8,
  },
  actionBtn: {
    fontSize: 13,
    padding: "6px 10px",
    borderRadius: 999,
  },
  actionBtnFilled: {
    fontSize: 13,
    padding: "6px 10px",
    borderRadius: 999,
  },
};
