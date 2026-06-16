const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// ─── Supported tickers & base prices ────────────────────────────────────────
const SUPPORTED_TICKERS = ["GOOG", "TSLA", "AMZN", "META", "NVDA"];

const prices = {
  GOOG: 175.0,
  TSLA: 245.0,
  AMZN: 185.0,
  META: 490.0,
  NVDA: 870.0,
};

const previousPrices = { ...prices };

// socketId -> { email, subscriptions: Set<ticker> }
const userSessions = new Map();

// ─── Price generator (ticks every 1 second) ──────────────────────────────────
function fluctuate(current) {
  const pct = (Math.random() * 4 - 2) / 100; // ±2%
  const next = current * (1 + pct);
  return Math.round(next * 100) / 100;
}

setInterval(() => {
  // Update every ticker
  SUPPORTED_TICKERS.forEach((ticker) => {
    previousPrices[ticker] = prices[ticker];
    prices[ticker] = fluctuate(prices[ticker]);
  });

  // Push only subscribed tickers to each connected socket
  userSessions.forEach((session, socketId) => {
    if (session.subscriptions.size === 0) return;

    const payload = {};
    session.subscriptions.forEach((ticker) => {
      payload[ticker] = {
        price: prices[ticker],
        prev: previousPrices[ticker],
        direction: prices[ticker] >= previousPrices[ticker] ? "up" : "down",
      };
    });

    io.to(socketId).emit("price_update", payload);
  });
}, 1000);

// ─── Socket.IO events ────────────────────────────────────────────────────────
io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("login", ({ email }) => {
    userSessions.set(socket.id, {
      email,
      subscriptions: new Set(),
    });
    console.log(`User logged in: ${email} (${socket.id})`);
    socket.emit("login_ack", { success: true, email });
  });

  socket.on("subscribe", ({ ticker }) => {
    const session = userSessions.get(socket.id);
    if (!session) {
      socket.emit("subscribe_error", { message: "Not logged in." });
      return;
    }

    const t = ticker.toUpperCase().trim();
    if (!SUPPORTED_TICKERS.includes(t)) {
      socket.emit("subscribe_error", {
        message: `Unsupported ticker "${t}". Supported: ${SUPPORTED_TICKERS.join(", ")}.`,
      });
      return;
    }

    if (session.subscriptions.has(t)) {
      socket.emit("subscribe_error", {
        message: `Already subscribed to ${t}.`,
      });
      return;
    }

    session.subscriptions.add(t);
    console.log(`${session.email} subscribed to ${t}`);

    // Send current price immediately so the card populates right away
    socket.emit("subscribe_ack", {
      ticker: t,
      price: prices[t],
      prev: prices[t],
      direction: "up",
    });
  });

  socket.on("unsubscribe", ({ ticker }) => {
    const session = userSessions.get(socket.id);
    if (!session) return;

    const t = ticker.toUpperCase().trim();
    session.subscriptions.delete(t);
    console.log(`${session.email} unsubscribed from ${t}`);
    socket.emit("unsubscribe_ack", { ticker: t });
  });

  socket.on("disconnect", () => {
    const session = userSessions.get(socket.id);
    if (session) {
      console.log(`User disconnected: ${session.email} (${socket.id})`);
    }
    userSessions.delete(socket.id);
  });
});

// ─── REST: health check ───────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    connectedUsers: userSessions.size,
    prices,
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Stock broker server running on http://localhost:${PORT}`);
});
