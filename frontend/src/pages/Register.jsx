import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "farmer",
    location: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    console.log("REGISTER FORM DATA:", form);

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      alert("All fields are required");
      return;
    }

    try {
      const res = await api.post("/auth/register", form);
      alert("Account Created Successfully!");
      nav("/");
    } catch (err) {
      console.log("REGISTER ERROR:", err);
      alert(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Create Account</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          autoComplete="off"
          value={form.name}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          autoComplete="new-email"
          value={form.email}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          autoComplete="new-password"
          value={form.password}
          onChange={handleChange}
          style={styles.input}
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="farmer">Farmer</option>
          <option value="owner">Owner</option>
        </select>

        <input
          type="text"
          name="location"
          placeholder="Location (Optional)"
          autoComplete="off"
          value={form.location}
          onChange={handleChange}
          style={styles.input}
        />

        <button style={styles.btn} onClick={handleRegister}>
          Create Account
        </button>

        <p style={{ marginTop: 12 }}>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#eef3ee",
  },
  card: {
    width: 360,
    padding: 25,
    background: "white",
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 10,
    marginTop: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 15,
  },
  btn: {
    width: "100%",
    padding: 12,
    marginTop: 15,
    background: "#1b5e20",
    color: "white",
    fontSize: 16,
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
};
