"use client";

import { useEffect, useState } from "react";

export default function FireTruckAnimation() {
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          setRunning(true);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(footer);
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset after truck exits so it can run again on next scroll
  useEffect(() => {
    if (!running) return;
    const t = setTimeout(() => setRunning(false), 11000);
    return () => clearTimeout(t);
  }, [running]);

  if (!running) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "110px",
        zIndex: 9999,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes drive {
          from { transform: translateX(110vw); }
          to   { transform: translateX(-620px); }
        }
        @keyframes wheelSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }
        @keyframes flashRed {
          0%, 45%  { opacity: 1; }
          50%, 95% { opacity: 0; }
          100%     { opacity: 1; }
        }
        @keyframes flashBlue {
          0%, 45%  { opacity: 0; }
          50%, 95% { opacity: 1; }
          100%     { opacity: 0; }
        }
        @keyframes beacon {
          0%   { opacity: 1; transform: rotate(0deg);   }
          50%  { opacity: 0.4; transform: rotate(180deg); }
          100% { opacity: 1; transform: rotate(360deg); }
        }
        .truck-drive {
          animation: drive 10s linear forwards;
          position: absolute;
          bottom: 0;
          left: 0;
        }
        .wheel {
          transform-origin: center;
          animation: wheelSpin 0.5s linear infinite;
        }
        .light-red  { animation: flashRed  0.4s linear infinite; }
        .light-blue { animation: flashBlue 0.4s linear infinite; }
      `}</style>

      {/* ── LADDER TRUCK SVG ── */}
      <div className="truck-drive">
        <svg
          width="600"
          height="110"
          viewBox="0 0 600 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* ── Road line ── */}
          <line x1="0" y1="108" x2="600" y2="108" stroke="#333" strokeWidth="2" />

          {/* ── BODY — main long section ── */}
          <rect x="90" y="48" width="460" height="54" rx="3" fill="#C0392B" />

          {/* ── REAR STEP / TAIL ── */}
          <rect x="544" y="62" width="18" height="38" rx="2" fill="#A93226" />

          {/* ── CAB ── */}
          {/* Cab body */}
          <rect x="18" y="28" width="80" height="74" rx="4" fill="#C0392B" />
          {/* Cab roof curve */}
          <ellipse cx="58" cy="29" rx="38" ry="8" fill="#C0392B" />
          {/* Windshield */}
          <rect x="22" y="36" width="52" height="40" rx="3" fill="#1a2a3a" stroke="#0d1b2a" strokeWidth="1" />
          {/* Windshield glare */}
          <rect x="26" y="39" width="14" height="20" rx="2" fill="rgba(255,255,255,0.06)" />
          {/* Cab door seam */}
          <line x1="72" y1="50" x2="72" y2="100" stroke="#A93226" strokeWidth="1.5" />
          {/* Door handle */}
          <rect x="75" y="68" width="10" height="3" rx="1" fill="#888" />
          {/* Bumper */}
          <rect x="4" y="80" width="18" height="20" rx="2" fill="#888" />
          <rect x="0" y="88" width="10" height="12" rx="1" fill="#777" />
          {/* Headlight */}
          <rect x="6" y="82" width="12" height="8" rx="2" fill="#ffffcc" />
          <rect x="6" y="82" width="12" height="8" rx="2" fill="rgba(255,255,200,0.6)" />

          {/* ── LIGHT BAR on cab ── */}
          <rect x="22" y="18" width="72" height="12" rx="3" fill="#222" />
          {/* Red lights */}
          <g className="light-red">
            <rect x="25" y="20" width="14" height="8" rx="2" fill="#ff1a1a" />
            <rect x="50" y="20" width="14" height="8" rx="2" fill="#ff1a1a" />
            <rect x="75" y="20" width="14" height="8" rx="2" fill="#ff1a1a" />
            {/* Glow */}
            <rect x="23" y="18" width="18" height="12" rx="2" fill="rgba(255,30,30,0.25)" />
            <rect x="48" y="18" width="18" height="12" rx="2" fill="rgba(255,30,30,0.25)" />
            <rect x="73" y="18" width="18" height="12" rx="2" fill="rgba(255,30,30,0.25)" />
          </g>
          {/* Blue lights */}
          <g className="light-blue">
            <rect x="25" y="20" width="14" height="8" rx="2" fill="#1a6eff" />
            <rect x="50" y="20" width="14" height="8" rx="2" fill="#1a6eff" />
            <rect x="75" y="20" width="14" height="8" rx="2" fill="#1a6eff" />
            {/* Glow */}
            <rect x="23" y="18" width="18" height="12" rx="2" fill="rgba(30,100,255,0.3)" />
            <rect x="48" y="18" width="18" height="12" rx="2" fill="rgba(30,100,255,0.3)" />
            <rect x="73" y="18" width="18" height="12" rx="2" fill="rgba(30,100,255,0.3)" />
          </g>

          {/* ── AERIAL LADDER ── */}
          {/* Turntable base */}
          <rect x="370" y="38" width="50" height="12" rx="2" fill="#888" />
          {/* Main ladder beam */}
          <rect x="90" y="16" width="410" height="10" rx="2" fill="#999" />
          {/* Second ladder rail */}
          <rect x="90" y="30" width="380" height="6" rx="1" fill="#888" />
          {/* Ladder rungs */}
          {Array.from({ length: 28 }).map((_, i) => (
            <rect key={i} x={100 + i * 14} y="17" width="4" height="18" rx="1" fill="#666" />
          ))}
          {/* Ladder tip */}
          <polygon points="500,12 520,20 500,28" fill="#777" />
          {/* Ladder supports from turntable */}
          <line x1="385" y1="48" x2="360" y2="20" stroke="#666" strokeWidth="3" />
          <line x1="410" y1="48" x2="430" y2="20" stroke="#666" strokeWidth="3" />

          {/* ── BODY DETAILS ── */}
          {/* Compartment lines */}
          <line x1="160" y1="50" x2="160" y2="100" stroke="#A93226" strokeWidth="1.5" />
          <line x1="240" y1="50" x2="240" y2="100" stroke="#A93226" strokeWidth="1.5" />
          <line x1="320" y1="50" x2="320" y2="100" stroke="#A93226" strokeWidth="1.5" />
          <line x1="400" y1="50" x2="400" y2="100" stroke="#A93226" strokeWidth="1.5" />
          <line x1="480" y1="50" x2="480" y2="100" stroke="#A93226" strokeWidth="1.5" />
          {/* Compartment handles */}
          {[130, 200, 280, 360, 440].map((x) => (
            <rect key={x} x={x} y="70" width="12" height="3" rx="1" fill="#888" />
          ))}
          {/* White stripe */}
          <rect x="90" y="88" width="460" height="6" fill="white" opacity="0.15" />
          {/* Reflective chevrons on rear */}
          <rect x="548" y="65" width="8" height="8" rx="1" fill="#ff0" opacity="0.8" />
          <rect x="548" y="77" width="8" height="8" rx="1" fill="#f00" opacity="0.8" />
          <rect x="548" y="89" width="8" height="8" rx="1" fill="#ff0" opacity="0.8" />

          {/* ── REAR BEACON ── */}
          <circle cx="556" cy="54" r="6" fill="#ff1a1a" className="light-red" />
          <circle cx="556" cy="54" r="6" fill="#1a6eff" className="light-blue" />

          {/* ── WHEELS ── */}
          {/* Front axle */}
          <g style={{ transformOrigin: "60px 100px" }} className="wheel">
            <circle cx="60" cy="100" r="18" fill="#1a1a1a" />
            <circle cx="60" cy="100" r="12" fill="#2a2a2a" />
            <circle cx="60" cy="100" r="5" fill="#444" />
            {[0,60,120,180,240,300].map((deg) => (
              <line key={deg}
                x1={60 + 6 * Math.cos(deg * Math.PI / 180)}
                y1={100 + 6 * Math.sin(deg * Math.PI / 180)}
                x2={60 + 11 * Math.cos(deg * Math.PI / 180)}
                y2={100 + 11 * Math.sin(deg * Math.PI / 180)}
                stroke="#555" strokeWidth="2.5" />
            ))}
          </g>
          {/* Rear axle 1 */}
          <g style={{ transformOrigin: "280px 100px" }} className="wheel">
            <circle cx="280" cy="100" r="18" fill="#1a1a1a" />
            <circle cx="280" cy="100" r="12" fill="#2a2a2a" />
            <circle cx="280" cy="100" r="5" fill="#444" />
            {[0,60,120,180,240,300].map((deg) => (
              <line key={deg}
                x1={280 + 6 * Math.cos(deg * Math.PI / 180)}
                y1={100 + 6 * Math.sin(deg * Math.PI / 180)}
                x2={280 + 11 * Math.cos(deg * Math.PI / 180)}
                y2={100 + 11 * Math.sin(deg * Math.PI / 180)}
                stroke="#555" strokeWidth="2.5" />
            ))}
          </g>
          {/* Rear axle 2 */}
          <g style={{ transformOrigin: "370px 100px" }} className="wheel">
            <circle cx="370" cy="100" r="20" fill="#1a1a1a" />
            <circle cx="370" cy="100" r="13" fill="#2a2a2a" />
            <circle cx="370" cy="100" r="6" fill="#444" />
            {[0,60,120,180,240,300].map((deg) => (
              <line key={deg}
                x1={370 + 7 * Math.cos(deg * Math.PI / 180)}
                y1={100 + 7 * Math.sin(deg * Math.PI / 180)}
                x2={370 + 12 * Math.cos(deg * Math.PI / 180)}
                y2={100 + 12 * Math.sin(deg * Math.PI / 180)}
                stroke="#555" strokeWidth="2.5" />
            ))}
          </g>
          {/* Tag axle */}
          <g style={{ transformOrigin: "480px 100px" }} className="wheel">
            <circle cx="480" cy="100" r="18" fill="#1a1a1a" />
            <circle cx="480" cy="100" r="12" fill="#2a2a2a" />
            <circle cx="480" cy="100" r="5" fill="#444" />
            {[0,60,120,180,240,300].map((deg) => (
              <line key={deg}
                x1={480 + 6 * Math.cos(deg * Math.PI / 180)}
                y1={100 + 6 * Math.sin(deg * Math.PI / 180)}
                x2={480 + 11 * Math.cos(deg * Math.PI / 180)}
                y2={100 + 11 * Math.sin(deg * Math.PI / 180)}
                stroke="#555" strokeWidth="2.5" />
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
}
