# Stock Broker Client Dashboard

Real-time stock dashboard. Users log in with their email, pick stocks to watch, and prices update live via WebSockets — no page refresh needed. Multiple users work independently in different tabs.

## Stack

- **Frontend** — React 18 + Vite
- **Backend** — Node.js, Express, Socket.IO
- **Storage** — in-memory (no DB)

## Project layout

```
├── client/
│   └── src/
│       ├── App.jsx                    # socket setup, global state
│       ├── App.css
│       └── components/
│           ├── Login.jsx              # email login form
│           ├── Dashboard.jsx          # page layout
│           ├── SubscriptionPanel.jsx  # add / remove tickers
│           └── StockCard.jsx          # live price card
├── server/
│   └── server.js                      # Express + Socket.IO + price engine
└── README.md
```

## Running locally

You need Node v18+. Two terminals.

**Terminal 1 — server**
```bash
cd server
npm install
npm start        # or: npm run dev  (nodemon watch mode)
```
Runs on `http://localhost:4000`

**Terminal 2 — client**
```bash
cd client
npm install
npm run dev
```
Opens on `http://localhost:5173`

## How it works

1. Enter your email to log in — no password, the email just identifies the session on the server.
2. Subscribe to any of the 5 supported tickers: `GOOG`, `TSLA`, `AMZN`, `META`, `NVDA`. Anything else gets rejected.
3. The server runs a `setInterval` that ticks every second, nudging each stock price by a random ±2% and pushing only the subscribed tickers to each socket connection.
4. Each browser tab is its own socket session — two tabs with different emails get different price streams.

## Socket events

**Client → Server**

| event | payload |
|---|---|
| `login` | `{ email }` |
| `subscribe` | `{ ticker }` |
| `unsubscribe` | `{ ticker }` |

**Server → Client**

| event | payload |
|---|---|
| `login_ack` | `{ email }` |
| `price_update` | `{ TICKER: { price, prev, direction } }` |
| `subscribe_ack` | `{ ticker, price, prev, direction }` |
| `subscribe_error` | `{ message }` |
| `unsubscribe_ack` | `{ ticker }` |

## Health check

```bash
curl http://localhost:4000/health
```

Returns live prices and number of connected users.
