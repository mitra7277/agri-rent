import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role");
  const nav = useNavigate();

  const logout = () => {
    localStorage.clear();
    nav("/login");
  };

  return (
    <header
      style={{
        background: "#1b5e20",
        padding: "12px 20px",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
      }}
    >
      {/* Logo */}
      <h2>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          AgriRent 🚜
        </Link>
      </h2>

      {/* Dynamic Menu */}
      <nav style={{ display: "flex", gap: 20 }}>
        {role === "farmer" && (
          <>
            <Link to="/farmer/dashboard" style={link}>Dashboard</Link>
            <Link to="/farmer/machines" style={link}>Machines</Link>
            <Link to="/farmer/bookings" style={link}>Bookings</Link>
            <Link to="/farmer/wallet" style={link}>Wallet</Link>
          </>
        )}

        {role === "owner" && (
          <>
            <Link to="/owner/dashboard" style={link}>Dashboard</Link>
            <Link to="/owner/add-machine" style={link}>Add Machine</Link>
            <Link to="/owner/bookings" style={link}>Bookings</Link>
            <Link to="/owner/earnings" style={link}>Earnings</Link>
          </>
        )}

        {role === "admin" && (
          <>
            <Link to="/admin/dashboard" style={link}>Admin</Link>
            <Link to="/admin/users" style={link}>Users</Link>
            <Link to="/admin/machines" style={link}>Machines</Link>
          </>
        )}
      </nav>

      {/* Right Profile / Logout */}
      <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
        <span>👤 {user?.name}</span>
        <button
          onClick={logout}
          style={{
            background: "white",
            color: "#1b5e20",
            padding: "6px 12px",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

const link = {
  color: "white",
  textDecoration: "none",
  fontWeight: "500",
};
