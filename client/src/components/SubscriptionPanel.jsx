import { useState } from "react";

const SUPPORTED = ["GOOG", "TSLA", "AMZN", "META", "NVDA"];

export default function SubscriptionPanel({
  subscriptions,
  error,
  onSubscribe,
  onUnsubscribe,
}) {
  const [input, setInput] = useState("");

  function handleAdd(e) {
    e.preventDefault();
    const t = input.trim().toUpperCase();
    if (t) {
      onSubscribe(t);
      setInput("");
    }
  }

  return (
    <div className="sub-panel">
      <h2 className="sub-panel-title">Subscriptions</h2>

      {/* Quick-pick buttons */}
      <div className="quick-picks">
        {SUPPORTED.map((t) => (
          <button
            key={t}
            className={`quick-btn ${subscriptions.includes(t) ? "active" : ""}`}
            onClick={() =>
              subscriptions.includes(t) ? onUnsubscribe(t) : onSubscribe(t)
            }
          >
            {t}
          </button>
        ))}
      </div>

      {/* Manual input */}
      <form onSubmit={handleAdd} className="sub-form">
        <input
          className="field-input"
          placeholder="Ticker (e.g. TSLA)"
          value={input}
          onChange={(e) => setInput(e.target.value.toUpperCase())}
          maxLength={5}
        />
        <button type="submit" className="btn-primary sub-btn">
          Add
        </button>
      </form>

      {error && <p className="field-error">{error}</p>}

      {/* Active list */}
      {subscriptions.length > 0 && (
        <ul className="sub-list">
          {subscriptions.map((t) => (
            <li key={t} className="sub-item">
              <span className="sub-ticker">{t}</span>
              <button
                className="remove-btn"
                onClick={() => onUnsubscribe(t)}
                title={`Remove ${t}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      {subscriptions.length === 0 && (
        <p className="sub-empty">No active subscriptions.</p>
      )}
    </div>
  );
}
