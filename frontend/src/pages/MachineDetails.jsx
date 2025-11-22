// src/pages/MachineDetails.jsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";                 // ⭐ FIXED
import Loader from "../components/Loader";
import PageHero from "../components/PageHero";

const BASE_URL = "http://localhost:5000";          // ⭐ FIXED

export default function MachineDetails() {
  const { id } = useParams();
  const nav = useNavigate();

  const [machine, setMachine] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/machines/${id}`);
        setMachine(res.data);
      } catch (err) {
        console.log("Error loading machine:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading)
    return (
      <div style={{ padding: 20 }}>
        <Loader />
      </div>
    );

  if (!machine)
    return (
      <div style={{ padding: 20 }}>
        <h2>Machine Not Found</h2>
        <button className="btn-primary" onClick={() => nav(-1)}>
          Go Back
        </button>
      </div>
    );

  const heroImage = machine.image
    ? machine.image.startsWith("http")
      ? machine.image
      : `${BASE_URL}${machine.image}`
    : "https://images.unsplash.com/photo-1592982537447-7440770cbfc8?auto=format&fit=crop&w=1200&q=80";

  const owner = machine.owner || machine.ownerId || {};

  return (
    <div>

      <PageHero
        title={`${machine.type} – ${machine.model}`}
        subtitle={machine.location}
        image={heroImage}
      />

      <div style={{ padding: 20 }}>

        <button className="btn-secondary" onClick={() => nav(-1)} style={{ marginBottom: 16 }}>
          ← Back
        </button>

        <div style={styles.wrapper}>

          {/* IMAGE LEFT */}
          <div style={styles.imageBox}>
            <img
              src={heroImage}
              alt={machine.type}
              style={styles.image}
            />

            <div style={styles.priceTag}>₹ {machine.pricePerHour} /hr</div>
            <div style={styles.ratingTag}>⭐ {machine.averageRating?.toFixed(1) || 0}</div>
          </div>

          {/* RIGHT INFO */}
          <div style={styles.infoBox}>
            <h2 style={{ marginBottom: 6 }}>
              {machine.type} – {machine.model}
            </h2>
            <p style={{ color: "gray" }}>📍 {machine.location}</p>

            <div style={styles.featuresRow}>
              <span style={styles.featureChip}>
                ⭐ {machine.averageRating || 0} ({machine.totalRatings || 0} reviews)
              </span>

              <span style={{ ...styles.featureChip, background: "#e8f5e9", color: "#1b5e20" }}>
                ₹ {machine.pricePerHour} / hour
              </span>
            </div>

            {machine.description && (
              <>
                <h3 style={styles.sectionTitle}>Description</h3>
                <p style={styles.descText}>{machine.description}</p>
              </>
            )}

            {/* OWNER CARD */}
            <div style={styles.ownerCard}>
              <div style={styles.ownerAvatar}>
                {owner.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <h3 style={{ marginBottom: 4 }}>Owner</h3>
                <p><b>{owner.name}</b></p>
                {owner.email && <p>📧 {owner.email}</p>}
                {owner.location && <p>📍 {owner.location}</p>}
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, marginTop: 18 }}>
              <button
                className="btn-primary"
                onClick={() => nav(`/farmer/book/${machine._id}`)}
                style={{ flex: 1 }}
              >
                Book This Machine
              </button>

              <a
                href={`https://wa.me/?text=I%20am%20interested%20in%20your%20${machine.type}%20(${machine.model})%20on%20AgriRent`}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
                style={{
                  flex: 1,
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                WhatsApp
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------
// STYLES
// ------------------------------------------------
const styles = {
  wrapper: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1.8fr",
    gap: 24,
  },
  imageBox: {
    position: "relative",
    borderRadius: 18,
    overflow: "hidden",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
  },
  image: {
    width: "100%",
    height: 320,
    objectFit: "cover",
  },
  priceTag: {
    position: "absolute",
    top: 15,
    right: 15,
    background: "rgba(0,0,0,0.7)",
    color: "white",
    padding: "6px 12px",
    borderRadius: 8,
    fontSize: 13,
  },
  ratingTag: {
    position: "absolute",
    bottom: 15,
    right: 15,
    background: "rgba(255,255,255,0.9)",
    color: "#1b5e20",
    padding: "6px 12px",
    borderRadius: 8,
    fontWeight: "bold",
    fontSize: 13,
  },
  infoBox: {
    background: "var(--card-bg)",
    padding: 20,
    borderRadius: 18,
    boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
  },
  featuresRow: {
    display: "flex",
    gap: 10,
    margin: "10px 0 16px 0",
  },
  featureChip: {
    padding: "5px 12px",
    background: "#f0f0f0",
    borderRadius: 999,
    fontSize: 13,
  },
  sectionTitle: {
    marginTop: 14,
    marginBottom: 6,
    fontSize: 18,
  },
  descText: {
    lineHeight: 1.6,
    color: "gray",
  },
  ownerCard: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "#f5f5f5",
    padding: 14,
    borderRadius: 12,
    marginTop: 14,
  },
  ownerAvatar: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    background: "#1b5e20",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
};
