import { useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

export default function AddMachine() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    type: "",
    model: "",
    pricePerHour: "",
    location: "",
    description: "",
    latitude: "",
    longitude: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const uploadImage = async () => {
    if (!image) return "";

    const data = new FormData();
    data.append("image", image);

    const res = await api.post("/machines/upload-image", data);
    return res.data.imageUrl;
  };

  const handleSubmit = async () => {
    if (
      !form.type ||
      !form.pricePerHour ||
      !form.location ||
      !form.latitude ||
      !form.longitude
    ) {
      toast.error("Please fill all required fields (including location coordinates)!");
      return;
    }

    try {
      setLoading(true);

      let imageUrl = await uploadImage();

      await api.post("/machines", {
        ownerId: user._id,
        ...form,
        image: imageUrl,
      });

      toast.success("Machine Added Successfully!");
      setLoading(false);

      setForm({
        type: "",
        model: "",
        pricePerHour: "",
        location: "",
        description: "",
        latitude: "",
        longitude: "",
      });

      setImage(null);
      setPreview(null);

    } catch (err) {
      console.error("Error:", err);
      toast.error("Failed to add machine");
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Add New Machine</h2>
      <p style={{ opacity: 0.7 }}>Add your agricultural machine for rental</p>

      <div style={styles.card}>

        {/* IMAGE PREVIEW */}
        <div style={styles.imageBox}>
          {preview ? (
            <img src={preview} alt="preview" style={styles.preview} />
          ) : (
            <div style={styles.placeholder}>Upload Image</div>
          )}
          <input type="file" onChange={handleImage} style={styles.fileInput} />
        </div>

        {/* FORM */}
        <div style={styles.form}>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">Select Machine Type</option>
            <option value="Tractor">Tractor</option>
            <option value="Harvester">Harvester</option>
            <option value="Rotavator">Rotavator</option>
            <option value="Seed Drill">Seed Drill</option>
            <option value="Cultivator">Cultivator</option>
          </select>

          <input
            name="model"
            style={styles.input}
            placeholder="Machine Model"
            value={form.model}
            onChange={handleChange}
          />

          <input
            name="pricePerHour"
            style={styles.input}
            placeholder="Price per hour"
            type="number"
            value={form.pricePerHour}
            onChange={handleChange}
          />

          <input
            name="location"
            style={styles.input}
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
          />

          {/* LATITUDE */}
          <input
            type="number"
            name="latitude"
            placeholder="Latitude"
            value={form.latitude}
            onChange={handleChange}
            style={styles.input}
          />

          {/* LONGITUDE */}
          <input
            type="number"
            name="longitude"
            placeholder="Longitude"
            value={form.longitude}
            onChange={handleChange}
            style={styles.input}
          />

          <textarea
            name="description"
            style={styles.textarea}
            placeholder="Machine Description"
            value={form.description}
            onChange={handleChange}
          />

          <button
            className="btn-primary"
            style={styles.btn}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Machine"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- */
/* STYLES */
/* ---------------------------------- */

const styles = {
  container: {
    padding: 20,
    color: "var(--text)",
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
  },
  card: {
    marginTop: 20,
    padding: 20,
    display: "flex",
    gap: 20,
    background: "var(--card-bg)",
    borderRadius: 12,
    boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
  },
  imageBox: {
    width: 250,
    height: 200,
    background: "#e8e8e8",
    borderRadius: 12,
    position: "relative",
    overflow: "hidden",
  },
  preview: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  placeholder: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#555",
  },
  fileInput: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    background: "#00000070",
    color: "white",
    padding: "6px",
    cursor: "pointer",
  },
  form: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    border: "1px solid #ccc",
    background: "var(--card-bg)",
    color: "var(--text)",
  },
  textarea: {
    padding: 12,
    height: 70,
    borderRadius: 8,
    border: "1px solid #ccc",
    background: "var(--card-bg)",
    color: "var(--text)",
  },
  btn: {
    marginTop: 10,
    padding: 12,
    width: "100%",
    borderRadius: 8,
  },
};
