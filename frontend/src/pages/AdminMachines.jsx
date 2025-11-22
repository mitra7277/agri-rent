// src/pages/AddMachine.jsx

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import PageHero from "../components/PageHero";

export default function AddMachine() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [type, setType] = useState("");
  const [model, setModel] = useState("");
  const [location, setLocation] = useState(user?.location || "");
  const [pricePerHour, setPricePerHour] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]); // File[]
  const [previewUrls, setPreviewUrls] = useState([]); // string[]
  const [loading, setLoading] = useState(false);

  // small estimator sliders
  const [hoursPerDay, setHoursPerDay] = useState(6);
  const [daysPerMonth, setDaysPerMonth] = useState(20);

  const estimatedMonthly = useMemo(() => {
    const p = Number(pricePerHour) || 0;
    return p * hoursPerDay * daysPerMonth;
  }, [pricePerHour, hoursPerDay, daysPerMonth]);

  // handle image select
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 5); // max 5
    setImages(files);

    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviewUrls(urls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!type.trim() || !model.trim() || !location.trim() || !pricePerHour) {
      toast.error("Please fill all required fields.");
      return;
    }

    if (!images.length) {
      toast.error("Please upload at least 1 machine image.");
      return;
    }

    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("type", type);
      fd.append("model", model);
      fd.append("location", location);
      fd.append("pricePerHour", pricePerHour);
      fd.append("description", description);

      // backend: upload.array("images", 5)
      images.forEach((file) => {
        fd.append("images", file);
      });

      await api.post("/machines/add", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Machine added successfully 🤝");
      navigate("/owner/dashboard");
    } catch (err) {
      console.log("Add machine error:", err);
      toast.error(
        err.response?.data?.message || "Failed to add machine, try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* TOP HERO BANNER */}
      <PageHero
        title="Add New Machine"
        subtitle="List your tractor or equipment for farmers to rent easily."
        image="https://images.pexels.com/photos/1268458/pexels-photo-1268458.jpeg?auto=compress&cs=tinysrgb&w=1200"
      />

      <div style={styles.page}>
        <div style={styles.headerRow}>
          <div>
            <h2 style={{ marginBottom: 4 }}>Machine Details</h2>
            <p style={{ color: "#64748b", fontSize: 14 }}>
              Fill the machine information carefully so that farmers can trust
              and book quickly.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={styles.formGrid}>
          {/* LEFT: BASIC INFO */}
          <div style={styles.leftCol}>
            {/* type + model */}
            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>
                  Machine Type <span style={styles.req}>*</span>
                </label>
                <input
                  style={styles.input}
                  placeholder="e.g. Tractor, Rotavator, Harvester"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>
                  Model <span style={styles.req}>*</span>
                </label>
                <input
                  style={styles.input}
                  placeholder="e.g. Mahindra 575 DI"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                />
              </div>
            </div>

            {/* location */}
            <div style={styles.field}>
              <label style={styles.label}>
                Location <span style={styles.req}>*</span>
              </label>
              <input
                style={styles.input}
                placeholder="Village / City, District"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            {/* price */}
            <div style={styles.field}>
              <label style={styles.label}>
                Price per hour (₹) <span style={styles.req}>*</span>
              </label>
              <input
                style={styles.input}
                type="number"
                min="0"
                placeholder="e.g. 800"
                value={pricePerHour}
                onChange={(e) => setPricePerHour(e.target.value)}
              />
            </div>

            {/* description */}
            <div style={styles.field}>
              <label style={styles.label}>Description</label>
              <textarea
                style={styles.textarea}
                rows={4}
                placeholder="Condition, usage, fuel, operator availability, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ marginTop: 12, width: "100%" }}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Machine"}
            </button>
          </div>

          {/* RIGHT: IMAGES + STATS */}
          <div style={styles.rightCol}>
            {/* Image upload card */}
            <div style={styles.card}>
              <label style={styles.label}>Machine Images (max 5)</label>

              <div style={styles.uploadBox}>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                  id="machine-images-input"
                />
                <label
                  htmlFor="machine-images-input"
                  style={styles.uploadLabel}
                >
                  <span style={{ fontSize: 28, marginBottom: 4 }}>📷</span>
                  <span>Click to upload or drag & drop</span>
                  <span style={{ fontSize: 12, color: "#64748b" }}>
                    High quality images increase bookings
                  </span>
                </label>
              </div>

              {/* Previews */}
              {previewUrls.length > 0 && (
                <div style={styles.previewGrid}>
                  {previewUrls.map((src, idx) => (
                    <div key={idx} style={styles.previewItem}>
                      <img src={src} alt={`preview-${idx}`} style={styles.previewImg} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Earning Estimator card */}
            <div style={styles.card}>
              <h3 style={{ marginBottom: 8 }}>Earning Estimator</h3>
              <p style={{ fontSize: 13, color: "#64748b", marginBottom: 12 }}>
                Just an estimate to show potential monthly income based on your
                price per hour.
              </p>

              <div style={styles.sliderRow}>
                <span style={styles.sliderLabel}>Hours per day</span>
                <b>{hoursPerDay} hrs</b>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(Number(e.target.value))}
                style={{ width: "100%" }}
              />

              <div style={{ height: 12 }} />

              <div style={styles.sliderRow}>
                <span style={styles.sliderLabel}>Days per month</span>
                <b>{daysPerMonth} days</b>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                value={daysPerMonth}
                onChange={(e) => setDaysPerMonth(Number(e.target.value))}
                style={{ width: "100%" }}
              />

              <div style={styles.earningBox}>
                <span style={{ fontSize: 13, color: "#64748b" }}>
                  Estimated Monthly Earning
                </span>
                <div style={styles.earningValue}>₹ {estimatedMonthly}</div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  page: {
    padding: 20,
    color: "var(--text)",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "1.4fr 1.1fr",
    gap: 18,
    alignItems: "flex-start",
  },
  leftCol: {
    background: "var(--card-bg)",
    padding: 18,
    borderRadius: 14,
    boxShadow: "0 4px 12px rgba(15,23,42,0.08)",
  },
  rightCol: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  row: {
    display: "flex",
    gap: 12,
  },
  field: {
    marginBottom: 12,
    flex: 1,
  },
  label: {
    fontSize: 13,
    marginBottom: 4,
    display: "block",
    color: "#4b5563",
  },
  req: {
    color: "#dc2626",
    marginLeft: 2,
  },
  input: {
    width: "100%",
    padding: "9px 10px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    fontSize: 14,
    outline: "none",
  },
  textarea: {
    width: "100%",
    padding: "9px 10px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    fontSize: 14,
    outline: "none",
    resize: "vertical",
  },

  card: {
    background: "var(--card-bg)",
    padding: 16,
    borderRadius: 14,
    boxShadow: "0 4px 12px rgba(15,23,42,0.08)",
  },

  uploadBox: {
    marginTop: 6,
    borderRadius: 12,
    border: "1px dashed #9ca3af",
    padding: 14,
    textAlign: "center",
    background: "#f9fafb",
  },
  uploadLabel: {
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: 3,
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    color: "#374151",
  },

  previewGrid: {
    marginTop: 10,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
    gap: 8,
  },
  previewItem: {
    borderRadius: 10,
    overflow: "hidden",
    border: "1px solid #e5e7eb",
    height: 80,
  },
  previewImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  sliderRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 13,
    marginBottom: 4,
  },
  sliderLabel: {
    color: "#6b7280",
  },
  earningBox: {
    marginTop: 12,
    padding: 10,
    borderRadius: 12,
    background: "#ecfdf3",
    border: "1px solid #bbf7d0",
  },
  earningValue: {
    fontSize: 22,
    fontWeight: 700,
    color: "#15803d",
  },
};
