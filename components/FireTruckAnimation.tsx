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
        @keyframes vhfd-lights {
          0%   { filter: drop-shadow(0 0 18px #ff1111) drop-shadow(0 0 30px #ff1111); }
          49%  { filter: drop-shadow(0 0 18px #ff1111) drop-shadow(0 0 30px #ff1111); }
          50%  { filter: drop-shadow(0 0 18px #1144ff) drop-shadow(0 0 30px #1144ff); }
          99%  { filter: drop-shadow(0 0 18px #1144ff) drop-shadow(0 0 30px #1144ff); }
          100% { filter: drop-shadow(0 0 18px #ff1111) drop-shadow(0 0 30px #ff1111); }
        }
        .vhfd-truck {
          animation: vhfd-drive 12s linear forwards;
          position: absolute;
          bottom: 0;
          left: 0;
        }
        .vhfd-truck img {
          width: 800px;
          height: 220px;
          object-fit: contain;
          object-position: bottom left;
          animation: vhfd-lights 0.4s linear infinite;
        }
      `}</style>

      <div className="vhfd-truck">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/fire-truck.png" alt="" />
      </div>
    </div>
  );
}
