import { useEffect, useRef, useState } from "react";

export default function StockCard({ ticker, data }) {
  const [flash, setFlash] = useState(null);
  const prevDir = useRef(null);

  useEffect(() => {
    if (!data) return;
    if (prevDir.current !== null) {
      setFlash(data.direction);
      const id = setTimeout(() => setFlash(null), 600);
      return () => clearTimeout(id);
    }
    prevDir.current = data.direction;
  }, [data?.price]);

  const direction = data?.direction ?? "up";
  const price = data?.price ?? "—";
  const change =
    data && data.prev
      ? ((data.price - data.prev) / data.prev) * 100
      : 0;

  return (
    <div className={`stock-card ${flash ? `flash-${flash}` : ""}`}>
      <div className="card-header">
        <span className="card-ticker">{ticker}</span>
        <span className={`card-badge ${direction}`}>
          {direction === "up" ? "▲" : "▼"}
        </span>
      </div>

      <div className={`card-price ${direction}`}>
        ${typeof price === "number" ? price.toFixed(2) : price}
      </div>

      <div className={`card-change ${direction}`}>
        {direction === "up" ? "+" : ""}
        {change.toFixed(3)}%
      </div>
    </div>
  );
}
