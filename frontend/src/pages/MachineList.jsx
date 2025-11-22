// src/pages/MachineList.jsx

import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:5000";

export default function MachineList() {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    loadMachines();
  }, []);

  const loadMachines = async () => {
    try {
      setLoading(true);
      const res = await api.get("/machines");
      setMachines(res.data || []);
    } catch (err) {
      console.log("Machines load error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ... (yahan aapke filters ka existing code rahega)

  return (
    <div style={{ padding: 24 }}>
      <h2>Find Machines</h2>
      <p style={{ color: "#64748b", marginTop: 4 }}>
        Search, filter and book the perfect machine for your farm.
      </p>

      {/* yahan aapka filter UI rahega (search, type, price, etc.) */}

      <div
        style={{
          marginTop: 20,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {machines.map((m) => {
          // image src handle: http URL vs /uploads
          const imgSrc = m.image
            ? m.image.startsWith("http")
              ? m.image
              : `${BASE_URL}${m.image}`
            : "https://via.placeholder.com/400x250?text=Machine";

          return (
            <div
              key={m._id}
              style={{
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                background: "#ffffff",
                padding: 10,
                boxShadow: "0 4px 10px rgba(15,23,42,0.06)",
              }}
            >
              <img
                src={imgSrc}
                alt={m.type}
                style={{
                  width: "100%",
                  height: 150,
                  objectFit: "cover",
                  borderRadius: 10,
                  marginBottom: 8,
                }}
              />

              <p style={{ margin: 0, fontWeight: 600 }}>
                {m.type} – {m.model}
              </p>
              <p style={{ margin: "2px 0", fontSize: 13 }}>📍 {m.location}</p>
              <p style={{ margin: "2px 0", fontSize: 13 }}>
                ⭐ {m.averageRating || 0}
              </p>

              <p style={{ marginTop: 4, fontSize: 14, fontWeight: 600 }}>
                ₹{m.pricePerHour}/hr
              </p>

              <button
                className="btn-primary"
                style={{ width: "100%", marginTop: 8 }}
                onClick={() => nav(`/farmer/book/${m._id}`)}
              >
                Book Now
              </button>
            </div>
          );
        })}

        {machines.length === 0 && !loading && (
          <p style={{ color: "#94a3b8" }}>No machines found.</p>
        )}
      </div>
    </div>
  );
}
