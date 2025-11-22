import { useEffect } from "react";
import api from "../services/api";

export default function BookingDetails() {
  const booking = JSON.parse(localStorage.getItem("currentBooking"));
  const machineId = booking.machineId;

  useEffect(() => {
    startTracking(); // ⭐ GPS tracking start
  }, []);

  const startTracking = () => {
    if (!navigator.geolocation) {
      alert("GPS not supported");
      return;
    }

    navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        await api.put(`/machines/update-location/${machineId}`, {
          latitude,
          longitude,
        });

        console.log("📡 GPS Updated:", latitude, longitude);
      },
      (err) => console.log("GPS Error:", err),
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 5000,
      }
    );
  };

  return (
    <div>
      <h2>Booking In Progress...</h2>
      <p>GPS Tracking Active</p>
    </div>
  );
}
