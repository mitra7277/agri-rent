{machines.map((m) =>
  m.currentLocation?.latitude ? (
    <>
      <Marker
        key={m._id}
        position={[m.currentLocation.latitude, m.currentLocation.longitude]}
        icon={icon}
      >
        <Popup>
          <b>{m.type} — {m.model}</b>
          <br />
          Last update: {new Date(m.currentLocation.updatedAt).toLocaleTimeString()}
        </Popup>
      </Marker>

      {/* ⭐ ROUTE HISTORY LINE */}
      <Polyline
        positions={m.locationHistory.map((p) => [p.latitude, p.longitude])}
        pathOptions={{ color: "green", weight: 4 }}
      />
    </>
  ) : null
)}
