import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

export default function Profile() {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [bookings, setBookings] = useState([]);

  // Load profile + history
  useEffect(() => {
    if (!storedUser) return;
    loadProfile();
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.get(`/profile/${storedUser._id}`);
      setProfile(res.data);
      setAvatarPreview(res.data.avatar || null);
    } catch (err) {
      console.error("Profile load error:", err);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      // assuming farmer bookings route
      const res = await api.get(`/bookings/farmer/${storedUser._id}`);
      setBookings(res.data || []);
    } catch (err) {
      console.error("History load error:", err);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatarFile(file);
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return profile.avatar || "";

    const data = new FormData();
    data.append("avatar", avatarFile);

    const res = await api.post("/profile/upload-avatar", data);
    return res.data.avatarUrl;
  };

  const handleSave = async () => {
    if (!profile) return;
    try {
      setSaving(true);

      let avatarUrl = profile.avatar || "";
      if (avatarFile) {
        avatarUrl = await uploadAvatar();
      }

      const payload = {
        name: profile.name,
        location: profile.location,
        phone: profile.phone,
        bio: profile.bio,
        experienceYears: profile.experienceYears,
        landSize: profile.landSize,
        mainCrops: profile.mainCrops,
        avatar: avatarUrl,
      };

      const res = await api.put(`/profile/${storedUser._id}`, payload);

      const updatedUser = res.data.user;
      // localStorage me basic info update
      localStorage.setItem(
        "user",
        JSON.stringify({
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          location: updatedUser.location,
        })
      );

      toast.success("Profile updated");
      setProfile(res.data.user);
    } catch (err) {
      console.error("Profile save error:", err);
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (!storedUser) {
    return <h2 style={{ padding: 20 }}>Please login first.</h2>;
  }

  if (loading || !profile) {
    return (
      <div style={{ padding: 20 }}>
        <Loader />
      </div>
    );
  }

  return (
    <div style={{ padding: 20, color: "var(--text)" }}>
      <h2>My Profile</h2>
      <p style={{ opacity: 0.7 }}>Manage your details & see your activity.</p>

      <div style={styles.grid}>
        {/* LEFT: PROFILE CARD */}
        <div style={styles.card}>
          <h3>Basic Details</h3>

          <div style={styles.avatarSection}>
            <div style={styles.avatarWrapper}>
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="avatar"
                  style={styles.avatarImg}
                />
              ) : (
                <div style={styles.avatarPlaceholder}>
                  {profile.name?.[0]?.toUpperCase()}
                </div>
              )}
            </div>

            <div>
              <label style={styles.uploadLabel}>
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  style={{ display: "none" }}
                />
              </label>
            </div>
          </div>

          <input
            name="name"
            value={profile.name || ""}
            onChange={handleChange}
            style={styles.input}
            placeholder="Full Name"
          />

          <input
            value={profile.email}
            disabled
            style={{ ...styles.input, opacity: 0.7 }}
            placeholder="Email"
          />

          <input
            name="phone"
            value={profile.phone || ""}
            onChange={handleChange}
            style={styles.input}
            placeholder="Phone Number"
          />

          <input
            name="location"
            value={profile.location || ""}
            onChange={handleChange}
            style={styles.input}
            placeholder="Location / Village"
          />

          <textarea
            name="bio"
            value={profile.bio || ""}
            onChange={handleChange}
            style={styles.textarea}
            placeholder="Short bio (about your farming, etc.)"
          />

          <div style={styles.row}>
            <div style={{ flex: 1 }}>
              <label style={styles.labelSmall}>Experience (years)</label>
              <input
                name="experienceYears"
                type="number"
                value={profile.experienceYears || 0}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.labelSmall}>Land Size</label>
              <input
                name="landSize"
                value={profile.landSize || ""}
                onChange={handleChange}
                style={styles.input}
                placeholder="e.g. 2 acre"
              />
            </div>
          </div>

          <input
            name="mainCrops"
            value={profile.mainCrops || ""}
            onChange={handleChange}
            style={styles.input}
            placeholder="Main Crops (e.g. Wheat, Rice)"
          />

          <button
            className="btn-primary"
            style={{ width: "100%", marginTop: 10 }}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>

        {/* RIGHT: BOOKING HISTORY */}
        <div style={styles.card}>
          <h3>Recent Activity</h3>
          <p style={{ opacity: 0.7, fontSize: 13 }}>
            Your latest machine bookings
          </p>

          {bookings.length === 0 ? (
            <p style={{ marginTop: 10 }}>No bookings yet.</p>
          ) : (
            <div style={{ marginTop: 10, maxHeight: 350, overflowY: "auto" }}>
              {bookings.map((b) => (
                <div key={b._id} style={styles.historyItem}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>
                      {b.machineId?.type} – {b.machineId?.model}
                    </div>
                    <div style={{ fontSize: 12, opacity: 0.8 }}>
                      {new Date(b.startTime).toLocaleString()} →{" "}
                      {new Date(b.endTime).toLocaleString()}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: "bold", fontSize: 14 }}>
                      ₹{b.totalPrice}
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        padding: "2px 6px",
                        borderRadius: 20,
                        background:
                          b.status === "approved"
                            ? "rgba(76,175,80,0.15)"
                            : b.status === "rejected"
                            ? "rgba(244,67,54,0.15)"
                            : "rgba(255,193,7,0.15)",
                        color:
                          b.status === "approved"
                            ? "#2e7d32"
                            : b.status === "rejected"
                            ? "#c62828"
                            : "#f57f17",
                      }}
                    >
                      {b.status?.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1.2fr)",
    gap: 20,
    marginTop: 20,
  },
  card: {
    background: "var(--card-bg)",
    borderRadius: 12,
    padding: 18,
    boxShadow: "0 3px 10px rgba(0,0,0,0.12)",
    color: "var(--text)",
  },
  avatarSection: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    marginBottom: 10,
  },
  avatarWrapper: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    overflow: "hidden",
    background: "#e0e0e0",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 28,
    fontWeight: "bold",
  },
  uploadLabel: {
    background: "#1b5e20",
    color: "white",
    padding: "6px 10px",
    borderRadius: 20,
    fontSize: 12,
    cursor: "pointer",
  },
  input: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
    marginTop: 8,
    fontSize: 14,
    background: "var(--card-bg)",
    color: "var(--text)",
  },
  textarea: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
    marginTop: 8,
    fontSize: 14,
    minHeight: 70,
    resize: "vertical",
    background: "var(--card-bg)",
    color: "var(--text)",
  },
  row: {
    display: "flex",
    gap: 10,
    marginTop: 8,
  },
  labelSmall: {
    fontSize: 12,
    opacity: 0.8,
  },
  historyItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 10,
    borderRadius: 10,
    border: "1px solid #eee",
    marginBottom: 8,
    background: "#fafafa",
  },
};
