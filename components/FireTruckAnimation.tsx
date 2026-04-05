"use client";

import { useEffect, useState } from "react";

// Wheel positions (as % of image width/height) — tuned to the PNG
// Front wheel center: ~21% x, 88% y
// Rear wheel center:  ~72% x, 88% y
const TRUCK_W = 700;
const TRUCK_H = 420;
const DISPLAY_H = 130; // rendered height in px
const DISPLAY_W = Math.round(TRUCK_W * (DISPLAY_H / TRUCK_H)); // ~208px... let's use 500px tall version

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
    const t = setTimeout(() => setRunning(false), 12000);
    return () => clearTimeout(t);
  }, [running]);

  if (!running) return null;

  // Display size — keep aspect ratio, height = 140px
  const H = 140;
  const W = Math.round((1318 / 782) * H); // image is 1318x782 approx

  // Wheel centers as fraction of image
  const frontWheelX = Math.round(W * 0.225);
  const rearWheelX  = Math.round(W * 0.715);
  const wheelY      = Math.round(H * 0.885);
  const frontR      = Math.round(H * 0.155);
  const rearR       = Math.round(H * 0.155);

  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, height: `${H}px`, zIndex: 9999, pointerEvents: "none", overflow: "hidden" }}>
      <style>{`
        @keyframes vhfd-drive {
          from { transform: translateX(105vw); }
          to   { transform: translateX(-${W + 40}px); }
        }
        @keyframes vhfd-wheel {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes vhfd-red {
          0%,49%  { opacity: 1; }
          50%,100% { opacity: 0; }
        }
        @keyframes vhfd-blue {
          0%,49%  { opacity: 0; }
          50%,100% { opacity: 1; }
        }
        .vhfd-truck { animation: vhfd-drive 11s linear forwards; position: absolute; bottom: 0; left: 0; }
        .vhfd-wheel-front { transform-origin: ${frontWheelX}px ${wheelY}px; animation: vhfd-wheel 0.45s linear infinite; }
        .vhfd-wheel-rear  { transform-origin: ${rearWheelX}px ${wheelY}px;  animation: vhfd-wheel 0.45s linear infinite; }
        .vhfd-red  { animation: vhfd-red  0.35s linear infinite; }
        .vhfd-blue { animation: vhfd-blue 0.35s linear infinite; }
      `}</style>

      <div className="vhfd-truck">
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
          {/* The PNG truck image */}
          <image href="/images/fire-truck.png" x="0" y="0" width={W} height={H} preserveAspectRatio="xMidYMid meet" />

          {/* Spinning front wheel overlay */}
          <g className="vhfd-wheel-front">
            <circle cx={frontWheelX} cy={wheelY} r={frontR} fill="none" />
            {[0,60,120,180,240,300].map((deg) => (
              <line key={deg}
                x1={frontWheelX + (frontR * 0.35) * Math.cos(deg * Math.PI / 180)}
                y1={wheelY      + (frontR * 0.35) * Math.sin(deg * Math.PI / 180)}
                x2={frontWheelX + (frontR * 0.78) * Math.cos(deg * Math.PI / 180)}
                y2={wheelY      + (frontR * 0.78) * Math.sin(deg * Math.PI / 180)}
                stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" strokeLinecap="round"
              />
            ))}
          </g>

          {/* Spinning rear wheel overlay */}
          <g className="vhfd-wheel-rear">
            <circle cx={rearWheelX} cy={wheelY} r={rearR} fill="none" />
            {[0,60,120,180,240,300].map((deg) => (
              <line key={deg}
                x1={rearWheelX + (rearR * 0.35) * Math.cos(deg * Math.PI / 180)}
                y1={wheelY     + (rearR * 0.35) * Math.sin(deg * Math.PI / 180)}
                x2={rearWheelX + (rearR * 0.78) * Math.cos(deg * Math.PI / 180)}
                y2={wheelY     + (rearR * 0.78) * Math.sin(deg * Math.PI / 180)}
                stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" strokeLinecap="round"
              />
            ))}
          </g>

          {/* Flashing red lights on light bar */}
          <g className="vhfd-red">
            <rect x={Math.round(W*0.07)} y={Math.round(H*0.03)} width={Math.round(W*0.08)} height={Math.round(H*0.05)} rx="3" fill="rgba(255,30,30,0.85)" />
            <rect x={Math.round(W*0.38)} y={Math.round(H*0.03)} width={Math.round(W*0.06)} height={Math.round(H*0.04)} rx="2" fill="rgba(255,30,30,0.85)" />
          </g>
          {/* Flashing blue lights on light bar */}
          <g className="vhfd-blue">
            <rect x={Math.round(W*0.07)} y={Math.round(H*0.03)} width={Math.round(W*0.08)} height={Math.round(H*0.05)} rx="3" fill="rgba(30,80,255,0.85)" />
            <rect x={Math.round(W*0.38)} y={Math.round(H*0.03)} width={Math.round(W*0.06)} height={Math.round(H*0.04)} rx="2" fill="rgba(30,80,255,0.85)" />
          </g>
        </svg>
      </div>
    </div>
  );
}
