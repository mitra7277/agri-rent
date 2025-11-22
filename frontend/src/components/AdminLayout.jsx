// src/components/AdminLayout.jsx

import { Link, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AIAssistant from "./AIAssistant";

export default function MainLayout({ children }) {
  return (
    <>
      {children}
      <AIAssistant />
    </>
  );
}


export default function AdminLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/login");
    }
  }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
      {/* LEFT SIDEBAR */}
      <div
        style={{
          width: 240,
          background: "#1b5e20",
          color: "white",
          padding: "20px",
        }}
      >
        <h2 style={{ marginBottom: 20 }}>Admin Panel</h2>

        <ul style={{ listStyle: "none", padding: 0 }}>
          <li style={{ marginBottom: 12 }}>
            <Link to="/admin/dashboard" style={linkStyle}>Dashboard</Link>
          </li>

          <li style={{ marginBottom: 12 }}>
            <Link to="/admin/users" style={linkStyle}>Users</Link>
          </li>

          <li style={{ marginBottom: 12 }}>
            <Link to="/admin/machines" style={linkStyle}>Machines</Link>
          </li>
        </ul>
      </div>

      {/* RIGHT CONTENT (VERY IMPORTANT: OUTLET) */}
      <div style={{ flex: 1, background: "#f5f5f5", padding: 20 }}>
        <Outlet />   {/* ⭐ Without this Admin pages WILL NOT LOAD */}
      </div>
    </div>
  );
}


const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: 16,
};
