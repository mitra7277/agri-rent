import { useState } from "react";
import api from "../services/api";

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!msg.trim()) return;

    const userMsg = { from: "user", text: msg };
    setChat((c) => [...c, userMsg]);

    setLoading(true);

    try {
      const res = await api.post("/voice/ask", { question: msg });
      setChat((c) => [...c, { from: "ai", text: res.data.answer }]);
    } catch {
      setChat((c) => [...c, { from: "ai", text: "AI error" }]);
    }

    setLoading(false);
    setMsg("");
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        style={styles.floatingBtn}
      >
        💬
      </button>

      {/* Chat Window */}
      {open && (
        <div style={styles.chatWindow}>
          <h3>Agri AI Assistant</h3>

          <div style={styles.chatBox}>
            {chat.map((c, i) => (
              <div
                key={i}
                style={{
                  ...styles.msg,
                  alignSelf: c.from === "user" ? "flex-end" : "flex-start",
                  background: c.from === "user" ? "#4caf50" : "#ddd",
                  color: c.from === "user" ? "#fff" : "#000",
                }}
              >
                {c.text}
              </div>
            ))}

            {loading && <p>Thinking...</p>}
          </div>

          <div style={styles.inputRow}>
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Ask something..."
              style={styles.input}
            />
            <button onClick={sendMessage} style={styles.sendBtn}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  floatingBtn: {
    position: "fixed",
    bottom: 20,
    right: 20,
    background: "#1b5e20",
    color: "white",
    borderRadius: "50%",
    padding: 18,
    fontSize: 24,
    border: "none",
    cursor: "pointer",
  },
  chatWindow: {
    position: "fixed",
    bottom: 80,
    right: 20,
    width: 320,
    height: 420,
    background: "white",
    borderRadius: 12,
    padding: 12,
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
  },
  chatBox: {
    flex: 1,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 8,
    padding: 6,
  },
  msg: {
    padding: 10,
    borderRadius: 8,
    maxWidth: "85%",
    fontSize: 14,
  },
  inputRow: {
    display: "flex",
    gap: 6,
  },
  input: {
    flex: 1,
    padding: 8,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  sendBtn: {
    padding: "8px 12px",
    background: "#1b5e20",
    color: "#fff",
    border: "none",
    borderRadius: 6,
  },
};
