const express = require("express");
const askAI = require("../utils/voiceAI");

const router = express.Router();

router.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Question required" });
    }

    const answer = await askAI(question);

    res.json({ answer });
  } catch (err) {
    console.log("Voice Assistant Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
