import { useEffect, useState } from "react";
import api from "../services/api";

export default function DateCalendar({ machineId, onSelect }) {
  const [booked, setBooked] = useState([]);

  useEffect(() => {
    loadBookedDates();
  }, []);

  const loadBookedDates = async () => {
    const res = await api.get(`/calendar/${machineId}`);
    setBooked(res.data);
  };

  const isBooked = (date) => {
    return booked.some((b) => {
      const start = new Date(b.start);
      const end = new Date(b.end);
      const d = new Date(date);
      return d >= start && d <= end;
    });
  };

  const getDates = () => {
    const today = new Date();
    const days = [];

    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      days.push(d);
    }
    return days;
  };

  return (
    <div style={styles.box}>
      <h3>Select Date</h3>

      <div style={styles.grid}>
        {getDates().map((d, i) => {
          const bookedDay = isBooked(d);

          return (
            <div
              key={i}
              onClick={() => !bookedDay && onSelect(d)}
              style={{
                ...styles.day,
                background: bookedDay ? "#ffdddd" : "#ddffdd",
                cursor: bookedDay ? "not-allowed" : "pointer",
              }}
            >
              {d.toDateString()}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  box: { padding: 15, background: "white", borderRadius: 10 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: 10,
  },
  day: {
    padding: 8,
    borderRadius: 8,
    border: "1px solid #ccc",
    textAlign: "center",
    fontSize: 14,
  },
};
