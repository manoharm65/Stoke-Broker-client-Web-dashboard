import { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import Login from "./components/Login.jsx";
import Dashboard from "./components/Dashboard.jsx";

const SERVER_URL = "http://localhost:4000";

export default function App() {
  const [user, setUser] = useState(null);
  const [connected, setConnected] = useState(false);
  const [stockData, setStockData] = useState({});
  const [subscriptions, setSubscriptions] = useState([]);
  const [error, setError] = useState("");
  const socketRef = useRef(null);

  // Connect socket once on mount
  useEffect(() => {
    const socket = io(SERVER_URL, { autoConnect: true });
    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("login_ack", ({ email }) => {
      setUser(email);
    });

    socket.on("price_update", (payload) => {
      setStockData((prev) => ({ ...prev, ...payload }));
    });

    socket.on("subscribe_ack", ({ ticker, price, prev, direction }) => {
      setSubscriptions((prev) =>
        prev.includes(ticker) ? prev : [...prev, ticker]
      );
      setStockData((prev) => ({
        ...prev,
        [ticker]: { price, prev, direction },
      }));
      setError("");
    });

    socket.on("subscribe_error", ({ message }) => {
      setError(message);
    });

    socket.on("unsubscribe_ack", ({ ticker }) => {
      setSubscriptions((prev) => prev.filter((t) => t !== ticker));
      setStockData((prev) => {
        const next = { ...prev };
        delete next[ticker];
        return next;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleLogin = useCallback((email) => {
    socketRef.current?.emit("login", { email });
  }, []);

  const handleSubscribe = useCallback((ticker) => {
    setError("");
    socketRef.current?.emit("subscribe", { ticker });
  }, []);

  const handleUnsubscribe = useCallback((ticker) => {
    socketRef.current?.emit("unsubscribe", { ticker });
  }, []);

  if (!user) {
    return (
      <Login
        onLogin={handleLogin}
        connected={connected}
      />
    );
  }

  return (
    <Dashboard
      user={user}
      connected={connected}
      stockData={stockData}
      subscriptions={subscriptions}
      error={error}
      onSubscribe={handleSubscribe}
      onUnsubscribe={handleUnsubscribe}
    />
  );
}
