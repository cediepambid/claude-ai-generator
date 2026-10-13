
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "AI Generator API is running.",
  });
});

app.post("/api/generate", (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({
        error: "Please enter a prompt.",
      });
    }

    if (prompt.length > 5000) {
      return res.status(400).json({
        error: "Prompt must be 5,000 characters or fewer.",
      });
    }

    // Mock response muna. Walang API credits na kailangan.
    const response = [
      "Mock AI Response",
      "",
      `You asked: ${prompt.trim()}`,
      "",
      "This is a sample response from the AI Generator.",
      "The backend is working correctly.",
      "Claude API integration will be added later.",
    ].join("\n");

    return res.json({
      success: true,
      response,
      mode: "mock",
    });
  } catch (error) {
    console.error("Generation error:", error);

    return res.status(500).json({
      error: "Something went wrong. Please try again.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
