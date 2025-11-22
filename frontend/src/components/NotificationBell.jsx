// src/components/NotificationBell.jsx
import { useNotifications } from "../context/NotificationContext";

export default function NotificationBell() {
  const { notifications, unreadCount, isOpen, toggleOpen } = useNotifications();

  return (
    <div style={{ position: "relative" }}>
      {/* Bell Button */}
      <button
        onClick={toggleOpen}
        style={styles.button}
        aria-label="Notifications"
      >
        {/* Ping Circle (Outer Glow) */}
        {unreadCount > 0 && (
          <span style={styles.pingWrapper}>
            <span className="notif-ping" />
          </span>
        )}

        {/* Bell Icon */}
        <span style={styles.icon}>🔔</span>

        {/* Red Badge */}
        {unreadCount > 0 && (
          <span style={styles.badge}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div style={styles.dropdown}>
          <div style={styles.dropdownHeader}>
            <span style={{ fontWeight: 600 }}>Notifications</span>
            <span style={{ fontSize: 12, opacity: 0.7 }}>
              {notifications.length === 0
                ? "No notifications"
                : `${notifications.length} total`}
            </span>
          </div>

          <div style={styles.dropdownBody}>
            {notifications.length === 0 ? (
              <div style={styles.emptyState}>
                <span style={{ fontSize: 26 }}>🕊️</span>
                <p style={{ marginTop: 4, fontSize: 13, color: "#6b7280" }}>
                  All clear. No alerts right now.
                </p>
              </div>
            ) : (
              notifications.map((n) => (
                <div key={n.id} style={styles.item}>
                  <div style={styles.itemDot(!n.read)} />
                  <div style={{ flex: 1 }}>
                    <div style={styles.itemTitle}>{n.title}</div>
                    {n.message && (
                      <div style={styles.itemMsg}>{n.message}</div>
                    )}
                  </div>
                  <div style={styles.itemTime}>{n.time}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  button: {
    position: "relative",
    width: 40,
    height: 40,
    borderRadius: 999,
    border: "none",
    cursor: "pointer",
    background:
      "radial-gradient(circle at 30% 0%, #bbf7d0 0, #22c55e 35%, #15803d 100%)",
    boxShadow: "0 0 0 1px rgba(22,163,74,0.35), 0 8px 18px rgba(22,163,74,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    outline: "none",
  },
  icon: {
    fontSize: 20,
    transform: "translateY(1px)",
  },
  badge: {
    position: "absolute",
    top: -3,
    right: -3,
    minWidth: 18,
    height: 18,
    borderRadius: 999,
    background: "#ef4444",
    color: "white",
    fontSize: 11,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 4px",
    boxShadow: "0 0 0 1px rgba(248,250,252,0.9)",
  },
  pingWrapper: {
    position: "absolute",
    width: 44,
    height: 44,
    borderRadius: "999px",
  },
  dropdown: {
    position: "absolute",
    top: 48,
    right: 0,
    width: 290,
    borderRadius: 16,
    background: "rgba(15,23,42,0.98)",
    color: "white",
    boxShadow: "0 18px 40px rgba(15,23,42,0.65)",
    border: "1px solid rgba(148,163,184,0.5)",
    backdropFilter: "blur(18px)",
    zIndex: 50,
    overflow: "hidden",
  },
  dropdownHeader: {
    padding: "10px 12px",
    borderBottom: "1px solid rgba(148,163,184,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: 13,
  },
  dropdownBody: {
    maxHeight: 280,
    overflowY: "auto",
  },
  emptyState: {
    padding: 16,
    textAlign: "center",
  },
  item: {
    display: "flex",
    alignItems: "flex-start",
    gap: 8,
    padding: "9px 12px",
    borderBottom: "1px solid rgba(30,64,175,0.45)",
  },
  itemDot: (unread) => ({
    width: 8,
    height: 8,
    borderRadius: 999,
    marginTop: 6,
    background: unread ? "#22c55e" : "transparent",
    boxShadow: unread ? "0 0 8px rgba(34,197,94,0.9)" : "none",
  }),
  itemTitle: {
    fontSize: 13,
    fontWeight: 600,
  },
  itemMsg: {
    fontSize: 12,
    color: "#cbd5f5",
    marginTop: 2,
  },
  itemTime: {
    fontSize: 11,
    color: "#9ca3af",
    whiteSpace: "nowrap",
    marginLeft: 4,
  },
};
