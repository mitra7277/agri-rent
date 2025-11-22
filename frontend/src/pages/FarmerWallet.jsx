// src/pages/FarmerWallet.jsx

import { useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const DEFAULT_MACHINE_IMAGE =
  "https://images.pexels.com/photos/4619400/pexels-photo-4619400.jpeg?auto=compress&cs=tinysrgb&w=800";

export default function FarmerWallet() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [addAmount, setAddAmount] = useState("");
  const [addMethod, setAddMethod] = useState("upi");

  useEffect(() => {
    if (!user?._id) return;
    loadWallet();
  }, []);

  // LOAD BALANCE + TRANSACTIONS
  const loadWallet = async () => {
    try {
      setLoading(true);

      const [balRes, txRes] = await Promise.all([
        api.get(`/wallet/${user._id}`),
        api.get(`/wallet/${user._id}/transactions`),
      ]);

      setBalance(balRes.data?.balance || 0);
      setTransactions(txRes.data || []);
    } catch (err) {
      console.log("Wallet error:", err);
      toast.error("Failed to load wallet, showing demo data");

      // fallback demo so UI looks full
      setBalance(5020);
      setTransactions([
        {
          _id: 1,
          amount: 1200,
          type: "credit",
          status: "success",
          message: "Wallet Recharge Successful",
          createdAt: "2025-11-21T10:00:00.000Z",
        },
        {
          _id: 2,
          amount: 700,
          type: "debit",
          status: "success",
          message: "Booking Payment Deducted",
          createdAt: "2025-11-20T09:10:00.000Z",
        },
        {
          _id: 3,
          amount: 500,
          type: "credit",
          status: "pending",
          message: "UPI Payment Pending",
          createdAt: "2025-11-19T08:30:00.000Z",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ADD MONEY (real API call + UI update)
  const handleAddMoney = async (e) => {
    e.preventDefault();
    const amt = Number(addAmount);

    if (!amt || amt <= 0) {
      toast.error("Enter a valid amount");
      return;
    }

    try {
      const res = await api.post("/wallet/add", { amount: amt });
      setBalance(res.data?.balance || 0);

      // reload transactions
      await loadWallet();

      setShowAddMoney(false);
      setAddAmount("");
      toast.success("Amount added to wallet");
    } catch (err) {
      console.log("Add money error:", err);
      toast.error("Failed to add money");
    }
  };

  // STATS
  const totalAdded = transactions
    .filter((t) => t.type === "credit")
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const totalSpent = transactions
    .filter((t) => t.type === "debit")
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const successCount = transactions.filter((t) => t.status !== "failed").length;

  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        <Loader />
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>My Wallet</h2>
      <p style={{ color: "#64748b" }}>
        Add money and pay quickly for your machine bookings.
      </p>

      {/* TOP SECTION: BALANCE + MINI STATS */}
      <div style={styles.topRow}>
        {/* MAIN BALANCE CARD */}
        <div style={styles.balanceCard}>
          <div>
            <p style={{ fontSize: 14, opacity: 0.9 }}>Current Balance</p>
            <h1 style={{ fontSize: 40, marginTop: 4 }}>₹{balance}</h1>
            <p style={{ fontSize: 12, marginTop: 2, opacity: 0.9 }}>
              Linked to your AgriRent account
            </p>
          </div>

          <div style={{ textAlign: "right" }}>
            <button
              onClick={() => setShowAddMoney(true)}
              style={styles.addMoneyBtn}
            >
              + Add Money
            </button>
            <p style={{ marginTop: 6, fontSize: 12, opacity: 0.9 }}>
              Recommended for fast bookings
            </p>
          </div>
        </div>

        {/* SIDE MINI STATS */}
        <div style={styles.smallStatsCol}>
          <MiniStat label="Total Added" value={`₹${totalAdded}`} color="#22c55e" />
          <MiniStat label="Total Spent" value={`₹${totalSpent}`} color="#ef4444" />
          <MiniStat
            label="Successful Payments"
            value={successCount}
            color="#3b82f6"
          />
        </div>
      </div>

      {/* RECENT TRANSACTIONS */}
      <div style={styles.txnCard}>
        <div style={styles.txnHeader}>
          <h3 style={{ margin: 0 }}>Recent Transactions</h3>
          <span style={styles.txnHint}>
            {transactions.length} transaction
            {transactions.length !== 1 ? "s" : ""} shown
          </span>
        </div>

        {transactions.length === 0 ? (
          <p style={{ color: "#94a3b8", marginTop: 8 }}>
            No transactions yet. Add money or make a booking to see history.
          </p>
        ) : (
          <div style={{ marginTop: 10 }}>
            {transactions.map((t) => (
              <div key={t._id || t.id} style={styles.txnRow}>
                {/* colored side bar */}
                <div
                  style={{
                    width: 4,
                    alignSelf: "stretch",
                    borderRadius: 999,
                    background:
                      t.type === "credit"
                        ? "linear-gradient(180deg,#bbf7d0,#22c55e)"
                        : "linear-gradient(180deg,#fecaca,#ef4444)",
                  }}
                />

                {/* image */}
                <img
                  src={DEFAULT_MACHINE_IMAGE}
                  alt="machine"
                  style={styles.txnImage}
                />

                {/* info */}
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 600 }}>
                    {t.message || (t.type === "credit"
                      ? "Wallet Recharge"
                      : "Booking Payment")}
                  </p>
                  <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>
                    {new Date(t.createdAt || new Date()).toLocaleString()}
                  </p>
                </div>

                {/* amount */}
                <p
                  style={{
                    margin: 0,
                    fontWeight: 700,
                    fontSize: 15,
                    color: t.type === "credit" ? "#16a34a" : "#b91c1c",
                    minWidth: 80,
                    textAlign: "right",
                  }}
                >
                  {t.type === "credit" ? "+" : "-"}₹{t.amount}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ADD MONEY MODAL */}
      {showAddMoney && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modalBox}>
            <h3>Add Money to Wallet</h3>
            <p style={{ fontSize: 13, color: "#6b7280" }}>
              Amount will be securely added to your AgriRent balance.
            </p>

            <form onSubmit={handleAddMoney} style={{ marginTop: 10 }}>
              <label style={styles.label}>
                Amount (₹)
                <input
                  type="number"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  placeholder="Enter amount"
                  style={styles.input}
                />
              </label>

              <label style={styles.label}>
                Payment Method
                <select
                  value={addMethod}
                  onChange={(e) => setAddMethod(e.target.value)}
                  style={styles.input}
                >
                  <option value="upi">UPI (PhonePe / GPay)</option>
                  <option value="card">Debit / Credit Card</option>
                  <option value="netbanking">Net Banking</option>
                </select>
              </label>

              <div style={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setShowAddMoney(false)}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
                <button type="submit" style={styles.primaryBtn}>
                  Add ₹{addAmount || 0}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- SMALL COMPONENT ---------- */

function MiniStat({ label, value, color }) {
  return (
    <div style={styles.miniStat}>
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: 999,
          background: color,
          marginRight: 6,
        }}
      />
      <div
        style={{
          fontSize: 11,
          color: "#6b7280",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 14, fontWeight: 600 }}>{value}</div>
    </div>
  );
}

/* ---------- STYLES ---------- */

const styles = {
  topRow: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 2.1fr) minmax(0, 1fr)",
    gap: 16,
    marginTop: 12,
    marginBottom: 20,
  },
  balanceCard: {
    borderRadius: 18,
    padding: 20,
    background:
      "linear-gradient(135deg, #22c55e 0%, #16a34a 45%, #4ade80 100%)",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 18px 35px rgba(22,163,74,0.4)",
  },
  addMoneyBtn: {
    padding: "10px 18px",
    borderRadius: 999,
    border: "none",
    background: "white",
    color: "#16a34a",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: 14,
    boxShadow: "0 8px 20px rgba(15,23,42,0.25)",
  },
  smallStatsCol: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  miniStat: {
    borderRadius: 14,
    padding: 10,
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    boxShadow: "0 8px 18px rgba(15,23,42,0.04)",
    display: "flex",
    alignItems: "center",
    gap: 4,
    justifyContent: "space-between",
  },
  txnCard: {
    marginTop: 4,
    background: "#ffffff",
    borderRadius: 16,
    padding: 18,
    boxShadow: "0 10px 25px rgba(15,23,42,0.06)",
    border: "1px solid #e5e7eb",
  },
  txnHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  txnHint: {
    fontSize: 13,
    color: "#9ca3af",
  },
  txnRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 0",
    borderBottom: "1px solid #e5e7eb",
  },
  txnImage: {
    width: 52,
    height: 52,
    borderRadius: 12,
    objectFit: "cover",
    flexShrink: 0,
  },
  modalBackdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(15,23,42,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  modalBox: {
    width: 360,
    background: "#ffffff",
    borderRadius: 18,
    padding: 18,
    boxShadow: "0 20px 45px rgba(15,23,42,0.5)",
  },
  label: {
    display: "block",
    fontSize: 13,
    color: "#374151",
    marginTop: 10,
  },
  input: {
    width: "100%",
    marginTop: 4,
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid #d1d5db",
    fontSize: 14,
  },
  modalActions: {
    marginTop: 16,
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
  },
  cancelBtn: {
    padding: "8px 14px",
    borderRadius: 999,
    border: "1px solid #e5e7eb",
    background: "#ffffff",
    cursor: "pointer",
    fontSize: 13,
  },
  primaryBtn: {
    padding: "8px 16px",
    borderRadius: 999,
    border: "none",
    background: "#16a34a",
    color: "#ffffff",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 13,
  },
};
