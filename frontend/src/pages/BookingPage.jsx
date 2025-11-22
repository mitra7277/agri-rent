// src/pages/BookingPage.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

export default function BookingPage() {
  const { id } = useParams();
  const nav = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [machine, setMachine] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    date: "",
    startTime: "",
    hours: 1,
    paymentMode: "wallet",
  });

  const [totalPrice, setTotalPrice] = useState(0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ======================================
  // LOAD MACHINE + EXISTING BOOKINGS
  // ======================================
  useEffect(() => {
    loadMachine();
    loadBookedSlots();
  }, [id]);

  const loadMachine = async () => {
    try {
      const res = await api.get(`/machines/${id}`);
      setMachine(res.data);
      setTotalPrice(res.data.pricePerHour);
    } catch (err) {
      toast.error("Error loading machine");
    } finally {
      setLoading(false);
    }
  };

  const loadBookedSlots = async () => {
    const res = await api.get(`/bookings/machine/${id}`);
    setBookedSlots(res.data);
  };

  // PRICE UPDATE AUTOMATIC
  useEffect(() => {
    if (!machine) return;
    setTotalPrice((form.hours || 1) * machine.pricePerHour);
  }, [form.hours, machine]);

  // ======================================
  // LIVE TRACKING (RUN ONLY AFTER MACHINE LOAD)
  // ======================================
  useEffect(() => {
    if (!machine?._id) return;

    const interval = setInterval(() => {
      if (!navigator.geolocation) return;

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords;

          await api.put(`/machines/update-location/${machine._id}`, {
            latitude,
            longitude,
          });

          console.log("📍 GPS sent:", latitude, longitude);
        },
        (err) => console.log("GPS Error:", err),
        { enableHighAccuracy: true }
      );
    }, 10000);

    return () => clearInterval(interval);
  }, [machine]);

  // ======================================
  // RAZORPAY PAYMENT
  // ======================================
  const startPayment = async (amount) => {
    try {
      const res = await api.post("/pay/create-order", { amount });

      const options = {
        key: "RAZORPAY_KEY_ID",
        amount: res.data.amount,
        currency: "INR",
        name: "AgriRent Payment",
        description: "Machine Booking Payment",
        order_id: res.data.id,

        handler: async function (response) {
          const verifyRes = await api.post("/pay/verify", {
            order_id: response.razorpay_order_id,
            payment_id: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          });

          if (verifyRes.data.success) {
            toast.success("Payment Successful!");
          } else {
            toast.error("Payment Verification Failed");
          }
        },

        theme: { color: "#1b5e20" },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      toast.error("Payment Failed");
    }
  };

  // ======================================
  // HANDLE BOOKING
  // ======================================
  const handleBook = async () => {
    if (!user) return toast.error("Please login first!");

    if (!form.date || !form.startTime || !form.hours) {
      return toast.error("All fields are required");
    }

    const hoursNum = Number(form.hours);
    if (hoursNum <= 0) return toast.error("Invalid hours");

    const start = new Date(`${form.date}T${form.startTime}`);
    const end = new Date(start.getTime() + hoursNum * 60 * 60 * 1000);

    try {
      const payload = {
        machineId: machine._id,
        farmerId: user._id,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        totalPrice: hoursNum * machine.pricePerHour,
        paymentMode: form.paymentMode,
      };

      await api.post("/bookings", payload);

      toast.success("Booking created!");
      nav("/farmer/bookings");
    } catch (err) {
      toast.error(err.response?.data?.message || "Booking failed");
    }
  };

  if (loading || !machine) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Book {machine.type}</h2>

      {/* MACHINE CARD */}
      <div className="card" style={{ padding: 20, marginTop: 10 }}>
        <img
          src={machine.image}
          style={{
            width: "100%",
            height: 200,
            borderRadius: 10,
            objectFit: "cover",
          }}
          alt="machine"
        />

        <h3>
          {machine.type} – {machine.model}
        </h3>
        <p>📍 {machine.location}</p>
        <p>₹ {machine.pricePerHour} / hour</p>
      </div>

      {/* UNAVAILABLE SLOTS */}
      <div className="card" style={{ padding: 20, marginTop: 20 }}>
        <h3>Unavailable Slots</h3>

        {bookedSlots.length === 0 ? (
          <p style={{ color: "green" }}>All slots available</p>
        ) : (
          bookedSlots.map((slot, i) => (
            <p key={i} style={slotStyle}>
              {new Date(slot.startTime).toLocaleString()} →{" "}
              {new Date(slot.endTime).toLocaleString()}
            </p>
          ))
        )}
      </div>

      {/* FORM */}
      <div className="card" style={{ padding: 20, marginTop: 20 }}>
        <h3>Booking Details</h3>

        <label style={label}>Date</label>
        <input type="date" name="date" style={input} onChange={handleChange} />

        <label style={label}>Start Time</label>
        <input
          type="time"
          name="startTime"
          style={input}
          onChange={handleChange}
        />

        <label style={label}>Hours</label>
        <input
          type="number"
          name="hours"
          value={form.hours}
          min="1"
          style={input}
          onChange={handleChange}
        />

        {/* PAYMENT MODE */}
        <label style={label}>Payment Mode</label>
        <div style={{ display: "flex", gap: 20, marginBottom: 10 }}>
          <label>
            <input
              type="radio"
              name="paymentMode"
              value="wallet"
              checked={form.paymentMode === "wallet"}
              onChange={handleChange}
            />{" "}
            Wallet
          </label>

          <label>
            <input
              type="radio"
              name="paymentMode"
              value="cash"
              checked={form.paymentMode === "cash"}
              onChange={handleChange}
            />{" "}
            Cash on Service
          </label>
        </div>

        {/* PRICE SUMMARY */}
        <div
          className="card"
          style={{ background: "#f5f5f5", padding: 12, marginTop: 10 }}
        >
          <p>Price per hour: ₹ {machine.pricePerHour}</p>
          <p>Total hours: {form.hours}</p>
          <h3>Total Price: ₹ {totalPrice}</h3>
        </div>

        <button className="btn-primary" onClick={handleBook} style={{ marginTop: 15 }}>
          Confirm Booking
        </button>

        {/* ONLINE PAYMENT OPTION */}
        <button
          className="btn-secondary"
          style={{ marginTop: 10 }}
          onClick={() => startPayment(totalPrice)}
        >
          Pay ₹{totalPrice} Online
        </button>
      </div>
    </div>
  );
}

// =========================
// STYLES
// =========================

const input = {
  width: "100%",
  padding: 10,
  borderRadius: 8,
  border: "1px solid #ccc",
  marginBottom: 10,
};

const label = {
  fontSize: 14,
  fontWeight: 600,
  marginBottom: 4,
  marginTop: 8,
};

const slotStyle = {
  padding: 8,
  borderRadius: 8,
  background: "#ffe5e5",
  border: "1px solid red",
  marginBottom: 6,
};
