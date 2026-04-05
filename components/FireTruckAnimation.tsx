"use client";

import { useEffect, useState } from "react";

export default function FireTruckAnimation() {
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !running) setRunning(true); },
      { threshold: 0.15 }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setRunning(false), 14000);
    return () => clearTimeout(t);
  }, [running]);

  if (!running) return null;

  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: "220px", zIndex: 9999, pointerEvents: "none", overflow: "hidden" }}>
      <style>{`
        @keyframes vhfd-drive {
          from { transform: translateX(110vw); }
          to   { transform: translateX(-820px); }
        }
        @keyframes vhfd-red {
          0%, 49%  { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @keyframes vhfd-blue {
          0%, 49%  { opacity: 0; }
          50%, 100% { opacity: 1; }
        }
        .vhfd-truck {
          animation: vhfd-drive 12s linear forwards;
          position: absolute;
          bottom: 0;
          left: 0;
          width: 800px;
          height: 220px;
        }
        .vhfd-truck img {
          width: 800px;
          height: 220px;
          object-fit: contain;
          object-position: bottom left;
        }
        .vhfd-red  { animation: vhfd-red  0.35s linear infinite; }
        .vhfd-blue { animation: vhfd-blue 0.35s linear infinite; }
      `}</style>

      <div className="vhfd-truck">
        {/* Truck image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/fire-truck.png" alt="" />

        {/* Red light flash */}
        <div className="vhfd-red" style={{
          position: "absolute",
          top: "8px",
          left: "30px",
          width: "200px",
          height: "28px",
          borderRadius: "6px",
          background: "rgba(255,20,20,0.9)",
          boxShadow: "0 0 18px 8px rgba(255,20,20,0.6)",
          pointerEvents: "none",
        }} />

        {/* Blue light flash */}
        <div className="vhfd-blue" style={{
          position: "absolute",
          top: "8px",
          left: "30px",
          width: "200px",
          height: "28px",
          borderRadius: "6px",
          background: "rgba(20,80,255,0.9)",
          boxShadow: "0 0 18px 8px rgba(20,80,255,0.6)",
          pointerEvents: "none",
        }} />
      </div>
    </div>
  );
}
