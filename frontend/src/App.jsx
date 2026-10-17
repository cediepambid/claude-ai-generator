
import { useState } from "react";
import {
  Sparkles,
  Copy,
  LoaderCircle,
  WandSparkles,
  RotateCcw,
} from "lucide-react";
import "./App.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3001";

function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleGenerate(event) {
    event.preventDefault();

    if (!prompt.trim()) {
      setError("Please enter a prompt first.");
      return;
    }

    setLoading(true);
    setError("");
    setResponse("");
    setCopied(false);

    try {
      const result = await fetch(`${API_URL}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await result.json();

      if (!result.ok) {
        throw new Error(data.error || "Unable to generate a response.");
      }

      setResponse(data.response);
    } catch (err) {
      setError(
        err.message === "Failed to fetch"
          ? "Cannot connect to the backend. Please check the backend URL and try again."
          : err.message
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(response);
      setCopied(true);
    } catch {
      setError("Copy failed. Please select and copy the response manually.");
    }
  }

  function handleReset() {
    setPrompt("");
    setResponse("");
    setError("");
    setCopied(false);
  }

  return (
    <div className="app-shell">
      <header className="navbar">
        <a className="brand" href="/">
          <span className="brand-logo">
            <Sparkles size={21} />
          </span>
          <span>Claude Generator</span>
        </a>

        <span className="demo-badge">
          <span className="status-dot" />
          DEMO MODE
        </span>
      </header>

      <main className="main-content">
        <div className="eyebrow">
          <WandSparkles size={16} />
          YOUR AI WRITING ASSISTANT
        </div>

        <h1>
          Bring your ideas
          <br />
          <span>to life.</span>
        </h1>

        <p className="subtitle">
          Describe what you need. Generate ideas, draft content,
          and turn your thoughts into something great.
        </p>

        <form className="prompt-card" onSubmit={handleGenerate}>
          <div className="input-heading">
            <label htmlFor="prompt">What would you like to create?</label>
            <span className="character-count">{prompt.length}/5000</span>
          </div>

          <textarea
            id="prompt"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Example: Write a friendly, professional email asking to schedule a meeting..."
            maxLength={5000}
            rows={5}
            disabled={loading}
          />

          <div className="prompt-actions">
            <span className="helper-text">
              <Sparkles size={14} />
              Be specific for better results
            </span>

            <button
              className="generate-button"
              type="submit"
              disabled={loading || !prompt.trim()}
            >
              {loading ? (
                <>
                  <LoaderCircle className="spin" size={18} />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Generate
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="error-box" role="alert">
            {error}
          </div>
        )}

        <section className="result-card" aria-live="polite">
          <div className="result-topbar">
            <div className="result-title">
              <span className="result-logo">
                <WandSparkles size={18} />
              </span>
              <div>
                <h2>Generated response</h2>
                <p>Your result will appear below</p>
              </div>
            </div>

            {response && (
              <div className="result-actions">
                <button
                  className="icon-button"
                  type="button"
                  onClick={handleCopy}
                  title="Copy response"
                >
                  <Copy size={15} />
                  {copied ? "Copied!" : "Copy"}
                </button>

                <button
                  className="icon-button reset-button"
                  type="button"
                  onClick={handleReset}
                  title="Start over"
                >
                  <RotateCcw size={15} />
                </button>
              </div>
            )}
          </div>

          <div className={`result-body ${response ? "has-content" : ""}`}>
            {loading ? (
              <div className="loading-state">
                <LoaderCircle className="spin" size={24} />
                <span>Preparing your response...</span>
              </div>
            ) : response ? (
              response
            ) : (
              <div className="empty-state">
                <Sparkles size={25} />
                <p>Ready when you are.</p>
                <span>Enter a prompt above and click Generate.</span>
              </div>
            )}
          </div>

          {response && (
            <div className="demo-notice">
              <span className="status-dot" />
              Mock response — Claude API is not connected yet.
            </div>
          )}
        </section>

        <div className="feature-row">
          <span><Sparkles size={15} /> Simple to use</span>
          <span><Copy size={15} /> Easy to copy</span>
          <span><WandSparkles size={15} /> API-ready</span>
        </div>
      </main>

      <footer>
        <span>Claude Generator</span>
        <span>Built with React &amp; Node.js</span>
      </footer>
    </div>
  );
}

export default App;
