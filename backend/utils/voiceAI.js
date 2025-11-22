const axios = require("axios");

// FREE HUGGINGFACE MODEL (NO API KEY NEEDED)
const MODEL_URL =
  "https://api-inference.huggingface.co/models/google/flan-t5-large";

async function askAI(question) {
  try {
    const response = await axios.post(
      MODEL_URL,
      { inputs: question },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 20000,
      }
    );

    const answer = response.data[0]?.generated_text || "I didn't understand.";
    return answer;
  } catch (err) {
    console.log("AI Error:", err.message);
    return "AI server busy. Try again.";
  }
}

module.exports = askAI;
