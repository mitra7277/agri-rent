export default function Footer() {
  return (
    <footer
      style={{
        marginTop: 40,
        padding: "30px 20px",
        background: "#0f3d17",
        color: "white",
        textAlign: "center",
      }}
    >
      <h3>AgriRent Platform</h3>
      <p>Farmers • Owners • Smart Agriculture Solutions</p>

      <div style={{ marginTop: 12, opacity: 0.8 }}>
        © {new Date().getFullYear()} AgriRent. All rights reserved.
      </div>
    </footer>
  );
}
