import SubscriptionPanel from "./SubscriptionPanel.jsx";
import StockCard from "./StockCard.jsx";

export default function Dashboard({
  user,
  connected,
  stockData,
  subscriptions,
  error,
  onSubscribe,
  onUnsubscribe,
}) {
  return (
    <div className="dashboard">
      {/* ── Header ── */}
      <header className="dashboard-header">
        <div className="header-left">
          <span className="header-logo">📈</span>
          <span className="header-title">StockBroker</span>
        </div>
        <div className="header-right">
          <span className={`status-dot ${connected ? "online" : "offline"}`} />
          <span className="status-label">{connected ? "Live" : "Reconnecting…"}</span>
          <span className="header-user">{user}</span>
        </div>
      </header>

      {/* ── Main layout ── */}
      <main className="dashboard-main">
        {/* Left: subscription panel */}
        <aside className="sidebar">
          <SubscriptionPanel
            subscriptions={subscriptions}
            error={error}
            onSubscribe={onSubscribe}
            onUnsubscribe={onUnsubscribe}
          />
        </aside>

        {/* Right: price cards */}
        <section className="price-grid-area">
          {subscriptions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <p className="empty-text">Subscribe to a stock to see live prices.</p>
            </div>
          ) : (
            <div className="price-grid">
              {subscriptions.map((ticker) => (
                <StockCard
                  key={ticker}
                  ticker={ticker}
                  data={stockData[ticker]}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
