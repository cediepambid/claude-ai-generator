
const express = require("express");
const cors = require("cors");
const Anthropic = require("@anthropic-ai/sdk");
const dotenv = require("dotenv");

// Load environment variables from .env
const dotenvResult = dotenv.config();

("ENV file loaded:", !dotenvResult.error);
(
  "Anthropic key available:",
  Boolean(process.env.ANTHROPIC_API_KEY)
);
(
  "Anthropic key length:",
  (process.env.ANTHROPIC_API_KEY || "").length
);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "100kb" }));

// Initialize Anthropic only when an API key is configured
const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    })
  : null;

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "AI Generator API is running.",
    aiConfigured: Boolean(anthropic),
  });
});

// Generate AI response
app.post("/api/generate", async (req, res) => {
  try {
    const { prompt } = req.body || {};

    // Validate prompt
    if (typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({
        error: "Please enter a prompt.",
      });
    }

    if (prompt.length > 5000) {
      return res.status(400).json({
        error: "Prompt must be 5,000 characters or fewer.",
      });
    }

    // Check API configuration
    if (!anthropic) {
      console.error("ANTHROPIC_API_KEY is not configured.");

      return res.status(500).json({
        error: "AI service is not configured. Please check the backend environment variables.",
      });
    }

    // Call Claude API
    const message = await anthropic.messages.create({
      model: process.env.CLAUDE_MODEL || "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt.trim(),
        },
      ],
    });

    // Extract text response
    const response = message.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n");

    return res.json({
      success: true,
      response,
      mode: "claude",
    });
  } catch (error) {
    // Never log the API key
    console.error("Generation error:", {
      status: error.status || "unknown",
      message: error.message || "Unknown error",
    });

    if (error.status === 401) {
      return res.status(502).json({
        error: "AI authentication failed. Check the API key configuration.",
      });
    }

    if (error.status === 429) {
      return res.status(429).json({
        error: "AI usage limit reached. Check your API credits and limits.",
      });
    }

   if ([400, 403, 404].includes(error.status)) {
  return res.status(502).json({
    error: "Claude API request failed. Please check the server configuration.",
  });
}

    return res.status(502).json({
      error: "Unable to generate a response right now. Please try again.",
    });
  }
});

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({
    error: "API endpoint not found.",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
