// src/pages/AdminUsers.jsx
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await axiosInstance.get("/admin/users");
      setUsers(res.data || []);
    } catch (err) {
      console.log("Admin users error:", err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const toggleBlock = async (id) => {
    try {
      setUpdatingId(id);
      const res = await axiosInstance.put(`/admin/users/${id}/toggle-block`);
      toast.success("User updated");
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? res.data.user : u))
      );
    } catch (err) {
      console.log("Toggle block error:", err);
      toast.error("Failed to update user");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        <Loader />
      </div>
    );
  }

  return (
    <div style={{ padding: 0, color: "var(--text)" }}>
      <h2>Manage Users</h2>
      <p style={{ color: "gray", marginTop: 4 }}>
        View and control all farmers & owners on the platform.
      </p>

      <div className="card" style={{ marginTop: 16, padding: 16, background: "white" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Location</th>
                <th>Wallet (₹)</th>
                <th>Status</th>
                <th style={{ width: 140 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td style={{ textTransform: "capitalize" }}>{u.role}</td>
                  <td>{u.location || "—"}</td>
                  <td>{u.walletBalance || 0}</td>
                  <td>
                    {u.isBlocked ? (
                      <span style={styles.badgeRed}>Blocked</span>
                    ) : (
                      <span style={styles.badgeGreen}>Active</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn-secondary"
                      style={{ width: "100%" }}
                      disabled={updatingId === u._id}
                      onClick={() => toggleBlock(u._id)}
                    >
                      {updatingId === u._id
                        ? "Updating..."
                        : u.isBlocked
                        ? "Unblock"
                        : "Block"}
                    </button>
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: 10 }}>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 14,
  },
  badgeGreen: {
    padding: "3px 8px",
    background: "#e5f9e7",
    color: "#0f7b22",
    borderRadius: 12,
    fontSize: 12,
  },
  badgeRed: {
    padding: "3px 8px",
    background: "#ffe5e5",
    color: "#c62828",
    borderRadius: 12,
    fontSize: 12,
  },
};
