import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

export default function AddReview() {
  const { machineId } = useParams();
  const nav = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  const submitReview = async () => {
    if (rating === 0) return toast.error("Please select a rating!");

    try {
      await api.post("/reviews", {
        machineId,
        userId: user._id,
        rating,
        comment
      });

      toast.success("Review submitted!");
      nav("/farmer/bookings");
    } catch (err) {
      toast.error("Error submitting review");
      console.log(err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Rate This Machine</h2>

      <div style={styles.card}>
        <h3>Your Rating</h3>

        {/* ⭐ Interactive Stars */}
        <div style={styles.starRow}>
          {[1, 2, 3, 4, 5].map((s) => (
            <span
              key={s}
              style={{
                fontSize: 34,
                cursor: "pointer",
                color: (hover || rating) >= s ? "#ffb400" : "#ccc",
                transition: "0.2s"
              }}
              onMouseEnter={() => setHover(s)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(s)}
            >
              ★
            </span>
          ))}
        </div>

        <label style={styles.label}>Write a Review</label>
        <textarea
          style={styles.textarea}
          placeholder="Share your experience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button className="btn-primary" style={styles.btn} onClick={submitReview}>
          Submit Review
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    marginTop: 20,
    background: "white",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 3px 10px rgba(0,0,0,0.1)"
  },
  starRow: {
    display: "flex",
    gap: 8,
    marginTop: 10,
    marginBottom: 20
  },
  label: {
    fontWeight: "bold",
    marginTop: 10
  },
  textarea: {
    width: "100%",
    minHeight: 100,
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
    marginTop: 8
  },
  btn: {
    width: "100%",
    padding: 12,
    marginTop: 20,
    borderRadius: 8
  }
};
