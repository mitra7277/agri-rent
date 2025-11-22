// src/components/Sidebar.jsx

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

import {
  FaHome,
  FaTruck,
  FaList,
  FaWallet,
  FaPlus,
  FaChartBar,
  FaUserCircle,
  FaUserShield,
  FaUsers,
  FaCogs,
} from "react-icons/fa";

// Unsplash banner image
const BANNER_IMG =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80";

export default function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();
  const nav = useNavigate();

  const [collapsed, setCollapsed] = useState(false);

  if (!user) return null;

  const isActive = (path) => location.pathname.startsWith(path);

  // MENU LOGIC
  const menus = {
    farmer: [
      { title: "Dashboard", icon: <FaHome />, url: "/farmer/dashboard" },
      { title: "Find Machines", icon: <FaTruck />, url: "/farmer/machines" },
      { title: "My Bookings", icon: <FaList />, url: "/farmer/bookings" },
      { title: "Wallet", icon: <FaWallet />, url: "/farmer/wallet" },
    ],

    owner: [
      { title: "Dashboard", icon: <FaHome />, url: "/owner/dashboard" },
      { title: "Add Machine", icon: <FaPlus />, url: "/owner/add-machine" },
      { title: "Bookings", icon: <FaList />, url: "/owner/bookings" },
      { title: "Earnings", icon: <FaWallet />, url: "/owner/earnings" },
      { title: "Analytics", icon: <FaChartBar />, url: "/owner/analytics" },
    ],

    admin: [
      { title: "Admin Dashboard", icon: <FaUserShield />, url: "/admin/dashboard" },
      { title: "Users", icon: <FaUsers />, url: "/admin/users" },
      { title: "Machines", icon: <FaCogs />, url: "/admin/machines" },
    ],
  };

  const menu = menus[user.role] || [];

  // ROLE SWITCH FOR DEV
  const switchRole = (newRole) => {
    const updated = { ...user, role: newRole };
    localStorage.setItem("user", JSON.stringify(updated));
    nav(`/${newRole}/dashboard`);
    window.location.reload();
  };

  return (
    <div
      style={{
        ...styles.container,
        width: collapsed ? "70px" : "230px",
        transition: "0.25s",
      }}
    >
      {/* COLLAPSE BUTTON */}
      <button style={styles.toggleBtn} onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? "➡" : "⬅"}
      </button>

      {/* TOP BANNER WITH IMAGE */}
      <div style={styles.bannerBox}>
        <img src={BANNER_IMG} alt="AgriRent" style={styles.bannerImg} />
        {!collapsed && <h2 style={styles.bannerText}>AgriRent</h2>}
      </div>

      {/* PROFILE BOX */}
      <div style={styles.profileBox}>
        <div style={styles.avatar}>{user.name?.[0]?.toUpperCase()}</div>

        {!collapsed && (
          <div>
            <div style={styles.userName}>{user.name}</div>
            <div style={styles.userLoc}>{user.location || "—"}</div>

            <button style={styles.profileBtn} onClick={() => nav("/profile")}>
              <FaUserCircle size={13} /> Profile
            </button>
          </div>
        )}
      </div>

      {/* ROLE SWITCH (DEV ONLY) */}
      {process.env.NODE_ENV === "development" && !collapsed && (
        <select
          style={styles.roleDropdown}
          value={user.role}
          onChange={(e) => switchRole(e.target.value)}
        >
          <option value="farmer">Farmer</option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
        </select>
      )}

      {/* MENU */}
      <div style={styles.menu}>
        {menu.map((m) => (
          <Link
            key={m.url}
            to={m.url}
            style={{
              ...styles.link,
              background: isActive(m.url)
                ? "rgba(255,255,255,0.25)"
                : "transparent",
            }}
          >
            <span style={styles.icon}>{m.icon}</span>
            {!collapsed && m.title}
          </Link>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "var(--sidebar)",
    height: "100vh",
    padding: "18px 12px",
    color: "#fff",
    position: "relative",
    boxShadow: "3px 0 10px rgba(0,0,0,0.25)",
  },

  toggleBtn: {
    position: "absolute",
    top: 15,
    right: -15,
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "var(--primary)",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },

  /* ------- TOP BANNER IMAGE -------- */
  bannerBox: {
    width: "100%",
    height: 90,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
    position: "relative",
  },

  bannerImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    filter: "brightness(0.55)",
  },

  bannerText: {
    position: "absolute",
    bottom: 10,
    left: 12,
    color: "white",
    fontSize: 20,
    fontWeight: 700,
  },

  profileBox: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    paddingBottom: 12,
    marginBottom: 12,
    borderBottom: "1px solid rgba(255,255,255,0.25)",
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    fontWeight: 700,
  },

  userName: { fontWeight: 600, fontSize: 15 },
  userLoc: { fontSize: 12, opacity: 0.7, marginTop: -4 },

  profileBtn: {
    marginTop: 4,
    padding: "3px 8px",
    background: "#fff",
    color: "var(--primary)",
    border: "none",
    borderRadius: 20,
    fontSize: 12,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 4,
  },

  menu: { display: "flex", flexDirection: "column", gap: 8, marginTop: 10 },

  link: {
    padding: "10px 12px",
    borderRadius: 10,
    textDecoration: "none",
    color: "white",
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 15,
  },

  icon: { fontSize: 18 },

  roleDropdown: {
    width: "100%",
    padding: "6px 10px",
    borderRadius: 10,
    border: "none",
    marginBottom: 12,
    background: "#fff",
    color: "#1b5e20",
    fontWeight: "bold",
  },
};
