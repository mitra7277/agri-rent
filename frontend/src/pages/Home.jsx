// src/pages/Home.jsx

import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "../styles/Home.css";

// ULTRA HD TRACTOR + BALI (PLOUGHING) IMAGES
const TRACTOR_IMAGES = [
  "https://w0.peakpx.com/wallpaper/563/497/HD-wallpaper-farming-hard-work-field-machine-tractor-farm-farmer-ploughing-indian-paddy.jpg",
  "https://images.picxy.com/cache/2019/5/14/a3f8d3584ecfa60c5e46d260bacfe268.jpg",
  "https://www.hizuno.com/uploads/tractor_plowing_2fa4633c9d.jpg",
  "https://knot9prod.s3.amazonaws.com/thumbnails/811151/hover_811151005.jpg",
  "https://www.mahindratractor.com/sites/default/files/2025-02/benefits-of-tractor-ploughing-machines-in-modern-farming-detail.webp",
  "https://www.mahindratractor.com/sites/default/files/2025-08/Blog%204%20How%20Tractor%20Implements%20Help%20Small%20Farmers%20Increase%20Crop%20Yields%20in%20Uttar%20Pradesh-Detail.webp",
  "https://images.pexels.com/photos/8486001/pexels-photo-8486001.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/4484078/pexels-photo-4484078.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/175389/pexels-photo-175389.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/1164778/pexels-photo-1164778.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/248880/pexels-photo-248880.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/2165688/pexels-photo-2165688.jpeg?auto=compress&cs=tinysrgb&w=1200",


  "https://images.pexels.com/photos/1595104/pexels-photo-1595104.jpeg?auto=compress&cs=tinysrgb&w=1200",
];

export default function Home() {
  return (
    <div className="landing-container">

      {/* -------------------- TOP NAV -------------------- */}
      <nav className="landing-nav">
        <div className="nav-left">
          <span className="logo-dot" />
          <span className="nav-logo">AgriRent</span>
        </div>

        <ul className="nav-links">
          <li><a href="#how">How it works</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#gallery">Machines</a></li>
          <li><a href="#testimonials">Farmers</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>

        <div className="nav-actions">
          <Link to="/login" className="nav-login-btn">Login</Link>
          <Link to="/register" className="nav-primary-btn">Register</Link>
        </div>
      </nav>

      {/* -------------------- HERO SECTION -------------------- */}
      <section className="hero-section">
        <div className="hero-bg-overlay" />

        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            Smart Farming Starts Here 🚜
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Rent tractors, harvesters and agri equipment on-demand.  
            Farmer-friendly pricing. Trusted owners. Real-time booking.
          </motion.p>

          <div className="hero-buttons">
            <Link to="/login" className="btn-primary hero-btn">Farmer Login</Link>
            <Link to="/register" className="btn-secondary hero-btn">Join as Owner</Link>
          </div>

          <div className="hero-stats">
            <div>
              <strong>500+</strong>
              <span>Machines Listed</span>
            </div>
            <div>
              <strong>2K+</strong>
              <span>Happy Farmers</span>
            </div>
            <div>
              <strong>120+</strong>
              <span>Villages Covered</span>
            </div>
          </div>
        </div>

        {/* HERO SIDE CARDS (3 tractors) */}
        <div className="hero-side-cards">
          {[TRACTOR_IMAGES[0], TRACTOR_IMAGES[1], TRACTOR_IMAGES[2]].map(
            (img, i) => (
              <motion.div
                key={i}
                className="hero-machine-card"
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 * i }}
              >
                <img src={img} alt={`tractor-${i}`} />
                <div className="hero-machine-info">
                  <span className="badge">Available</span>
                  <p>Power Tractor #{i + 1}</p>
                  <span className="price">₹ 800 / hr</span>
                </div>
              </motion.div>
            )
          )}
        </div>
      </section>

      {/* -------------------- HOW IT WORKS -------------------- */}
      <section className="how-section" id="how">
        <h2>How AgriRent Works</h2>
        <p className="section-sub">
          3 simple steps — farmers ke liye fully digital, but super simple.
        </p>

        <div className="how-grid">
          {[
            {
              step: "01",
              title: "Browse Nearby Machines",
              text: "Location ke basis pe tractors, harvesters aur implements dekho.",
            },
            {
              step: "02",
              title: "Instant Booking & Payment",
              text: "Date & time select karo, booking confirm karo, wallet/cash se payment.",
            },
            {
              step: "03",
              title: "Machine Arrives On Time",
              text: "Owner se direct coordinate. Transparent pricing, no hidden cost.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              className="how-card"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
            >
              <span className="how-step">{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      
      {/* -------------------- FEATURES -------------------- */}
      <section className="features-section" id="features">
        <h2>Why Farmers Love AgriRent?</h2>

        <div className="feature-grid">
          {[
            {
              icon: "🚜",
              title: "Easy Machine Rentals",
              text: "2–3 click me booking complete. No long calls, no confusion.",
            },
            {
              icon: "💰",
              title: "Affordable Pricing",
              text: "Transparent hourly rates, advance estimate, no hidden cost.",
            },
            {
              icon: "📍",
              title: "Nearby Machines",
              text: "Gaon ke aas-paas ka machine list, travel cost kam.",
            },
            {
              icon: "⭐",
              title: "Trusted Owners",
              text: "Rating system se only verified owners & machines.",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              className="feature-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
            >
              <div className="f-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* -------------------- TRACTOR GALLERY -------------------- */}
      <section className="gallery-section" id="gallery">
        <h2>Popular Tractors & Machines</h2>
        <p className="section-sub">
          Real field-ready machines — har season ke liye options ready.
        </p>

        <div className="tractor-scroll">
          {TRACTOR_IMAGES.map((src, i) => (
            <motion.div
              key={i}
              className="tractor-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: (i % 5) * 0.07 }}
            >
              <img src={src} alt={`tractor-${i}`} />
              <div className="tractor-info">
                <p className="tractor-title">Tractor #{i + 1}</p>
                <span className="tractor-tag">Available for rent</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* -------------------- TESTIMONIALS -------------------- */}
      <section className="testimonials-section" id="testimonials">
        <h2>What Farmers Say</h2>

        <div className="testimonial-grid">
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              className="testimonial-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: (i % 4) * 0.1 }}
            >
              <img
                src={`https://randomuser.me/api/portraits/men/${10 + i}.jpg`}
                alt="user"
                className="t-img"
              />
              <h4>Farmer #{i + 1}</h4>
              <p>
                “AgriRent ki wajah se mere gaon me timely tractor mil gaya.  
                Crop time pe ho gayi, diesel aur time dono bacha.”
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* -------------------- CTA -------------------- */}
      <section className="cta-section" id="contact">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          Ready to Start Your Smart Farming Journey?
        </motion.h2>

        <p className="section-sub">
          Ab machine dhoondhne ki tension khatam. App open karo — booking karo — kaam shuru.
        </p>

        <div className="cta-actions">
          <Link to="/register" className="btn-primary big-btn">Get Started Now</Link>
          <Link to="/login" className="btn-secondary big-btn">I already have an account</Link>
        </div>
      </section>

      {/* -------------------- FOOTER -------------------- */}
      <footer className="landing-footer">
        <div className="footer-cols">
          <div>
            <h4>AgriRent</h4>
            <p>Smart farming & machine sharing platform for Indian farmers.</p>
          </div>
          <div>
            <h5>For Farmers</h5>
            <ul>
              <li>Browse Machines</li>
              <li>Create Booking</li>
              <li>Wallet & Payments</li>
            </ul>
          </div>
          <div>
            <h5>For Owners</h5>
            <ul>
              <li>List Machine</li>
              <li>Manage Bookings</li>
              <li>Earnings Dashboard</li>
            </ul>
          </div>
          <div>
            <h5>Support</h5>
            <ul>
              <li>Help & FAQ</li>
              <li>Contact</li>
              <li>Terms & Policy</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} AgriRent — Smart Farming for Everyone 🚜</span>
        </div>
      </footer>

    </div>
  );
}
