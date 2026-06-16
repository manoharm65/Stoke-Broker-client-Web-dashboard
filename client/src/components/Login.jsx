import { useState } from "react";

export default function Login({ onLogin, connected }) {
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setErr("Please enter your email.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setErr("Please enter a valid email address.");
      return;
    }
    setErr("");
    onLogin(trimmed);
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-logo">📈</div>
        <h1 className="login-title">StockBroker</h1>
        <p className="login-subtitle">Real-time market dashboard</p>

        <form onSubmit={handleSubmit} className="login-form">
          <label className="field-label" htmlFor="email">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            className="field-input"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
          />
          {err && <p className="field-error">{err}</p>}

          <button
            type="submit"
            className="btn-primary"
            disabled={!connected}
          >
            {connected ? "Enter Dashboard" : "Connecting…"}
          </button>
        </form>

        <p className="login-note">No password needed — email identifies your session.</p>
      </div>
    </div>
  );
}
