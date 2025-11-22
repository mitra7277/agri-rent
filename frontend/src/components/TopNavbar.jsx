import { Link } from "react-router-dom";
import "./topnav.css";

export default function TopNavbar() {
  return (
    <nav className="topnav">
      <div className="nav-container">

        {/* 🔰 BRAND NAME */}
        <div className="brand">
          <Link to="/">AgriRent</Link>
        </div>

        {/* 🔰 NAV LINKS */}
        <ul className="nav-links">
          <li><Link to="/about">About JFS</Link></li>
          <li><Link to="/hire">Hire</Link></li>
          <li><Link to="/rent">Rent</Link></li>
          <li><Link to="/partners">Partnerships</Link></li>
          <li><Link to="/fpo">FPO</Link></li>
          <li><Link to="/news">Newsroom</Link></li>
          <li><Link to="/contact">Contact Us</Link></li>
        </ul>

      </div>
    </nav>
  );
}
