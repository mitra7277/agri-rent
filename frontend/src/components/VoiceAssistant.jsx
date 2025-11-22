// src/components/VoiceAssistant.jsx

import { useState } from "react";
import api from "../services/api";

export default function VoiceAssistant() {
  const [listening, setListening] = useState(false);
  const [text, setText] = useState("");
  const [answer, setAnswer] = useState("");

  // Browser support check
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  let mic;

  // Start listening in Hindi
  const startListening = () => {
    if (!SpeechRecognition) {
      alert("Your browser does NOT support speech recognition.");
      return;
    }

    mic = new SpeechRecognition();
    mic.lang = "hi-IN";
    mic.continuous = false;
    mic.interimResults = false;

    mic.start();

    setListening(true);
    setText("🎤 Listening...");

    mic.onresult = (e) => {
      const speech = e.results[0][0].transcript;
      setText("You said: " + speech);
      askAssistant(speech);
    };

    mic.onerror = () => {
      setListening(false);
      setText("❌ Error: Please try again.");
    };

    mic.onend = () => {
      setListening(false);
    };
  };

  const stopListening = () => {
    if (mic) mic.stop();
    setListening(false);
  };

  // Send question to backend "/voice/ask"
  const askAssistant = async (question) => {
    try {
      const res = await api.post("/voice/ask", { question });
      setAnswer(res.data.answer);
      speak(res.data.answer);
    } catch (err) {
      console.log("Voice Assistant Error:", err);
      setAnswer("❌ Error from server.");
    }
  };

  // Speak response in Hindi
  const speak = (msg) => {
    const tts = new SpeechSynthesisUtterance(msg);
    tts.lang = "hi-IN";
    window.speechSynthesis.speak(tts);
  };

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "0 auto" }}>
      <h2>🎤 AI Voice Assistant (Hindi)</h2>

      <div className="card" style={{ padding: 20, marginTop: 20 }}>
        <p>Try speaking:</p>
        <li>“tractor ka rent kya hai?”</li>
        <li>“rotavator ka istemaal kaise hota hai?”</li>
        <li>“kaun si fasal kis season me hoti hai?”</li>
        <br />

        {listening ? (
          <button className="btn-primary" onClick={stopListening}>
            🔴 Stop Listening
          </button>
        ) : (
          <button className="btn-primary" onClick={startListening}>
            🎤 Start Talking
          </button>
        )}

        <h3 style={{ marginTop: 20 }}>You said:</h3>
        <p>{text}</p>

        <h3 style={{ marginTop: 20 }}>Assistant:</h3>
        <p style={{ fontSize: 18, color: "green" }}>{answer}</p>
      </div>
    </div>
  );
}
