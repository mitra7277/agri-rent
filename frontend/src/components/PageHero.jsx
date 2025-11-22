// src/components/PageHero.jsx

import React from "react";

export default function PageHero({ title, subtitle, image }) {
  return (
    <div
      style={{
        position: "relative",
        borderRadius: 18,
        overflow: "hidden",
        height: 220,
        marginBottom: 20,
        boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
        backgroundColor: "#111",
      }}
    >
      {/* Background image */}
      <img
        src={image}
        alt={title}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: "brightness(0.55)",
        }}
      />

      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.8), rgba(0,0,0,0.1))",
        }}
      />

      {/* Text content */}
      <div
        style={{
          position: "absolute",
          left: 24,
          bottom: 24,
          color: "white",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700 }}>{title}</h1>
        {subtitle && (
          <p
            style={{
              marginTop: 6,
              maxWidth: 420,
              fontSize: 14,
              opacity: 0.9,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
