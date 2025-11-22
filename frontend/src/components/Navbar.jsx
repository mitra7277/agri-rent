import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

export default function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div style={{
      height: 60,
      background: "var(--navbar-bg)",
      color: "var(--text)",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: "0 20px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
    }}>
      <button 
        onClick={toggleTheme}
        className="btn-primary"
        style={{ fontSize: 14 }}
      >
        {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
      </button>
    </div>
  );
}
