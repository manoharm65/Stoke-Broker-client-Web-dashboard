# StockBroker Client Web Dashboard

A real-time stock broker dashboard built with **React**, **Node.js/Express**, and **Socket.IO**. Multiple users can log in independently, subscribe to live stock tickers, and watch prices update every second — all pushed server-side via WebSockets.

---

## Features

| Feature | Details |
|---|---|
| **Login** | Email-only session (no password). Multiple users can run in separate tabs. |
| **Subscriptions** | Subscribe/unsubscribe to any of 5 supported tickers: `GOOG`, `TSLA`, `AMZN`, `META`, `NVDA` |
| **Live Prices** | Backend generates realistic ±2% price fluctuations every second |
| **Per-user filtering** | Server pushes only the stocks each user is subscribed to (socket-level filtering) |
| **Visual indicators** | Green ▲ / Red ▼ flash animation on every price tick |
| **Multi-user** | Two users with different subscriptions update independently in real time |

---

## Tech Stack

```
Frontend  → React 18 (Vite) + Socket.IO Client
Backend   → Node.js + Express + Socket.IO
Storage   → In-memory (no database)
```

---

## Project Structure

```
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── App.jsx          # Root: socket wiring, state
│   │   ├── App.css          # Dark-theme styles
│   │   └── components/
│   │       ├── Login.jsx            # Email login screen
│   │       ├── Dashboard.jsx        # Main layout
│   │       ├── SubscriptionPanel.jsx # Sidebar: add/remove tickers
│   │       └── StockCard.jsx        # Live price card with flash animation
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                  # Node.js backend
│   ├── server.js            # Express + Socket.IO + price generator
│   └── package.json
│
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** v18+ (download: https://nodejs.org)
- **npm** v9+ (ships with Node)

---

### 1. Start the Backend

```bash
cd server
npm install
npm start
```

Server runs on **http://localhost:4000**

> For development with auto-reload:
> ```bash
> npm run dev
> ```

---

### 2. Start the Frontend

Open a **second terminal**:

```bash
cd client
npm install
npm run dev
```

App opens at **http://localhost:5173**

---

### 3. Test Multi-User

1. Open **http://localhost:5173** in Tab 1 → log in as `alice@example.com` → subscribe to `TSLA`, `NVDA`
2. Open **http://localhost:5173** in Tab 2 → log in as `bob@example.com` → subscribe to `GOOG`, `META`
3. Watch both dashboards update independently every second with only their respective stocks.

---

## API / Socket Events

### Client → Server

| Event | Payload | Description |
|---|---|---|
| `login` | `{ email }` | Identify the user session |
| `subscribe` | `{ ticker }` | Subscribe to a stock ticker |
| `unsubscribe` | `{ ticker }` | Remove a subscription |

### Server → Client

| Event | Payload | Description |
|---|---|---|
| `login_ack` | `{ success, email }` | Confirms login |
| `price_update` | `{ TICKER: { price, prev, direction } }` | Live tick (only subscribed tickers) |
| `subscribe_ack` | `{ ticker, price, prev, direction }` | Confirms subscription + initial price |
| `subscribe_error` | `{ message }` | Rejected ticker or duplicate sub |
| `unsubscribe_ack` | `{ ticker }` | Confirms removal |

---

## Supported Tickers

| Ticker | Company | Approx Base Price |
|---|---|---|
| `GOOG` | Alphabet | $175 |
| `TSLA` | Tesla | $245 |
| `AMZN` | Amazon | $185 |
| `META` | Meta | $490 |
| `NVDA` | NVIDIA | $870 |

Unsupported tickers are rejected with a clear error message.

---

## Health Check

```bash
curl http://localhost:4000/health
```

Returns current prices and connected user count.

---

## Scripts Reference

| Directory | Command | Action |
|---|---|---|
| `server/` | `npm start` | Start server (production) |
| `server/` | `npm run dev` | Start server with nodemon (watch mode) |
| `client/` | `npm run dev` | Start Vite dev server |
| `client/` | `npm run build` | Build for production |
| `client/` | `npm run preview` | Preview production build locally |

---

## Screenshots

> Login screen → Dashboard with live price cards updating every second.

---

## License

MIT
