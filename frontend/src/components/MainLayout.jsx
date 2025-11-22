// src/components/MainLayout.jsx

import Sidebar from "./Sidebar";
import NotificationBell from "./NotificationBell";
import { useAuth } from "../context/AuthContext";

export default function MainLayout({ children }) {
  const { user } = useAuth() || {};

  const roleLabel =
    user?.role === "owner"
      ? "Owner Panel"
      : user?.role === "admin"
      ? "Admin Panel"
      : "Farmer Panel";

  return (
    <div style={styles.wrapper}>
      {/* LEFT SIDEBAR */}
      <aside style={styles.sidebar}>
        <Sidebar />
      </aside>

      {/* RIGHT SIDE: HEADER + CONTENT + FOOTER */}
      <div style={styles.main}>
        {/* HEADER */}
        <header style={styles.header}>
          <div>
            <div style={styles.appName}>AgriRent</div>
            <div style={styles.appSub}>{roleLabel}</div>
          </div>

          <div style={styles.headerRight}>
            {/* Simple search bar (just UI) */}
            <div style={styles.searchBox}>
              <span style={{ fontSize: 14, marginRight: 6 }}>🔍</span>
              <input
                placeholder="Search machines, bookings..."
                style={styles.searchInput}
              />
            </div>

            {/* 🔔 Ultra Pro Notification Bell */}
            <NotificationBell />

            {/* User Avatar */}
            <div style={styles.userAvatar}>
              {(user?.name || "U")[0].toUpperCase()}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main style={styles.content}>{children}</main>

        {/* FOOTER */}
        <footer style={styles.footer}>
          <span>© {new Date().getFullYear()} AgriRent</span>
          <span style={{ fontSize: 12, opacity: 0.7 }}>
            Built for smart farming & machine sharing 🚜
          </span>
        </footer>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    width: "100vw",
    height: "100vh",
    background:
      "radial-gradient(circle at top left, #bbf7d0 0, #ecfdf5 24%, #e5e7eb 60%, #0f172a 130%)",
    overflow: "hidden",
  },
  sidebar: {
    width: 250,
    minWidth: 250,
    height: "100vh",
    background: "var(--sidebar)",
    boxShadow: "0 0 40px rgba(15,23,42,0.4)",
    zIndex: 5,
  },
  main: {
    flex: 1,
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    backdropFilter: "blur(12px)",
  },
  header: {
    height: 64,
    padding: "12px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom: "1px solid rgba(148,163,184,0.3)",
    background:
      "linear-gradient(135deg, rgba(15,23,42,0.9), rgba(22,101,52,0.9))",
    color: "white",
  },
  appName: {
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: 0.5,
  },
  appSub: {
    fontSize: 12,
    opacity: 0.78,
    marginTop: 2,
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },
  searchBox: {
    display: "flex",
    alignItems: "center",
    padding: "4px 10px",
    borderRadius: 999,
    background: "rgba(15,23,42,0.7)",
    border: "1px solid rgba(148,163,184,0.7)",
  },
  searchInput: {
    border: "none",
    outline: "none",
    background: "transparent",
    color: "#e5e7eb",
    fontSize: 13,
    width: 220,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: "999px",
    background:
      "radial-gradient(circle at 30% 0, #facc15 0, #ea580c 40%, #b91c1c 100%)",
    boxShadow: "0 8px 18px rgba(185,28,28,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    fontWeight: 700,
  },
  content: {
    flex: 1,
    padding: 20,
    overflowY: "auto",
  },
  footer: {
    height: 40,
    padding: "6px 18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: 12,
    color: "#e5e7eb",
    background: "rgba(15,23,42,0.95)",
    borderTop: "1px solid rgba(30,64,175,0.6)",
  },
};
