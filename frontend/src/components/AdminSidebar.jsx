import Header from "./Header";
import Footer from "./Footer";

export default function AdminLayout() {
  return (
    <div style={{ display: "flex" }}>
      <Header />

      <div style={{ display: "flex", width: "100%" }}>
        
        {/* Sidebar */}
        <div
          style={{
            width: 220,
            background: "#1b5e20",
            color: "white",
            minHeight: "100vh",
            padding: 20,
          }}
        >
          <h2>Admin Panel</h2>

          <ul style={{ marginTop: 20, listStyle: "none", padding: 0 }}>
            <li style={{ margin: "12px 0" }}>
              <Link to="/admin/dashboard" style={{ color: "white" }}>
                Dashboard
              </Link>
            </li>
            <li style={{ margin: "12px 0" }}>
              <Link to="/admin/users" style={{ color: "white" }}>
                Users
              </Link>
            </li>
            <li style={{ margin: "12px 0" }}>
              <Link to="/admin/machines" style={{ color: "white" }}>
                Machines
              </Link>
            </li>
          </ul>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: 20 }}>
          <Outlet />
        </div>
      </div>

      <Footer />
    </div>
  );
}
