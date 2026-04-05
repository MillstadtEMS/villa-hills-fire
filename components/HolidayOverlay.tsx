"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface Holiday {
  name: string;
  message: string;
  sub: string;
  emoji: string;
  bgColor: string;
  effect: "fireworks" | "hearts" | "shamrocks" | "eggs" | "stars" | "bats" | "leaves" | "snow" | "sparks";
}

function getHoliday(): Holiday | null {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const year = now.getFullYear();

  // Easter
  const a = year % 19, b = Math.floor(year / 100), c = year % 100;
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const easterMonth = Math.floor((h + l - 7 * m + 114) / 31);
  const easterDay = ((h + l - 7 * m + 114) % 31) + 1;

  const memDay = (() => { const d = new Date(year, 4, 31); while (d.getDay() !== 1) d.setDate(d.getDate() - 1); return d.getDate(); })();
  const labDay = (() => { const d = new Date(year, 8, 1); while (d.getDay() !== 1) d.setDate(d.getDate() + 1); return d.getDate(); })();

  const map: { check: boolean; h: Holiday }[] = [
    { check: month === 1 && day === 1, h: { name: "New Year's Day", message: "Happy New Year", sub: "From all of us at Villa Hills Fire Department — wishing you a safe and prosperous new year.", emoji: "🎆", bgColor: "rgba(5,5,20,0.96)", effect: "fireworks" } },
    { check: month === 2 && day === 14, h: { name: "Valentine's Day", message: "Happy Valentine's Day", sub: "Villa Hills Fire Department — grateful for this community we love and serve.", emoji: "❤️", bgColor: "rgba(80,0,20,0.96)", effect: "hearts" } },
    { check: month === 3 && day === 17, h: { name: "St. Patrick's Day", message: "Happy St. Patrick's Day", sub: "May luck be with you — and if it's not, we'll be there. Stay safe, Villa Hills.", emoji: "☘️", bgColor: "rgba(5,40,5,0.96)", effect: "shamrocks" } },
    { check: month === easterMonth && day === easterDay, h: { name: "Easter", message: "Happy Easter", sub: "Wishing you and your family a peaceful and joyful Easter. From Villa Hills Fire Department.", emoji: "✝️", bgColor: "rgba(40,10,60,0.96)", effect: "eggs" } },
    { check: month === 5 && day === memDay, h: { name: "Memorial Day", message: "Memorial Day", sub: "We honor and remember those who gave everything in service to this country. Never forgotten.", emoji: "🇺🇸", bgColor: "rgba(5,10,40,0.97)", effect: "stars" } },
    { check: month === 7 && day === 4, h: { name: "Fourth of July", message: "Happy Fourth of July", sub: "Enjoy the celebration — and remember, we're always standing by. Stay safe, Villa Hills.", emoji: "🎇", bgColor: "rgba(5,10,40,0.97)", effect: "fireworks" } },
    { check: month === 9 && day === labDay, h: { name: "Labor Day", message: "Happy Labor Day", sub: "Honoring the work and dedication of every person who shows up for their community.", emoji: "🔧", bgColor: "rgba(10,10,10,0.97)", effect: "sparks" } },
    { check: month === 10 && day === 31, h: { name: "Halloween", message: "Happy Halloween", sub: "Have a safe night out there, Villa Hills. We'll keep the lights on — just the red ones.", emoji: "🎃", bgColor: "rgba(30,10,0,0.97)", effect: "bats" } },
    { check: month === 11 && day === 28, h: { name: "Thanksgiving", message: "Happy Thanksgiving", sub: "Grateful for this community and the privilege of serving it. From Villa Hills Fire Department.", emoji: "🍂", bgColor: "rgba(40,15,0,0.97)", effect: "leaves" } },
    { check: month === 12 && day === 24, h: { name: "Christmas Eve", message: "Merry Christmas Eve", sub: "While you're with your families tonight, our volunteers are ready. Wishing you a safe holiday.", emoji: "🕯️", bgColor: "rgba(5,25,5,0.97)", effect: "snow" } },
    { check: month === 12 && day === 25, h: { name: "Christmas Day", message: "Merry Christmas", sub: "From every member of Villa Hills Fire Department — wishing you peace, warmth, and a safe holiday.", emoji: "🎄", bgColor: "rgba(5,25,5,0.97)", effect: "snow" } },
  ];

  const match = map.find(x => x.check);
  return match ? match.h : null;
}

/* ── FIREWORKS CANVAS ── */
function FireworksCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);

    const particles: { x: number; y: number; vx: number; vy: number; alpha: number; color: string; r: number }[] = [];
    const rockets: { x: number; y: number; vy: number; color: string; trail: { x: number; y: number }[] }[] = [];
    let tick = 0;

    const COLORS = ["#ff2020","#ff6600","#ffcc00","#00ccff","#cc44ff","#ff44aa","#ffffff","#44ff88"];

    const burst = (x: number, y: number) => {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const count = 60 + Math.floor(Math.random() * 40);
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
        const speed = 2 + Math.random() * 5;
        particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, alpha: 1, color, r: 2 + Math.random() * 2 });
      }
    };

    const loop = () => {
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.fillRect(0, 0, W, H);

      tick++;
      if (tick % 28 === 0) {
        rockets.push({ x: W * 0.2 + Math.random() * W * 0.6, y: H, vy: -(8 + Math.random() * 6), color: COLORS[Math.floor(Math.random() * COLORS.length)], trail: [] });
      }

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.trail.push({ x: r.x, y: r.y });
        if (r.trail.length > 8) r.trail.shift();
        r.y += r.vy;
        r.vy += 0.15;

        r.trail.forEach((p, idx) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,200,100,${(idx / r.trail.length) * 0.6})`;
          ctx.fill();
        });

        if (r.vy >= -1) {
          burst(r.x, r.y);
          rockets.splice(i, 1);
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.07;
        p.vx *= 0.98;
        p.alpha -= 0.018;
        if (p.alpha <= 0) { particles.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, "0");
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", onResize); };
  }, []);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}

/* ── FLOATING PARTICLE LAYER ── */
type ParticleType = "hearts" | "shamrocks" | "eggs" | "stars" | "bats" | "leaves" | "snow" | "sparks";

function FloatingParticles({ type }: { type: ParticleType }) {
  const map: Record<ParticleType, string[]> = {
    hearts:    ["❤️","💕","💗","🩷"],
    shamrocks: ["☘️","🍀","✨"],
    eggs:      ["🥚","🐣","🌸","🐰"],
    stars:     ["⭐","🌟","★","✦"],
    bats:      ["🦇","🕷️","👻","🎃"],
    leaves:    ["🍂","🍁","🍃"],
    snow:      ["❄️","⛄","✨","🌨️"],
    sparks:    ["✨","⚡","🔥","💥"],
  };

  const emojis = map[type];
  const count = type === "snow" ? 24 : 16;

  const items = Array.from({ length: count }, (_, i) => ({
    id: i,
    emoji: emojis[i % emojis.length],
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 3}s`,
    duration: `${2.5 + Math.random() * 3}s`,
    size: `${1 + Math.random() * 1.5}rem`,
    drift: `${(Math.random() - 0.5) * 60}px`,
  }));

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <style>{`
        @keyframes floatUp {
          0%   { transform: translateY(110vh) translateX(0) rotate(0deg); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.8; }
          100% { transform: translateY(-10vh) translateX(var(--drift)) rotate(360deg); opacity: 0; }
        }
        @keyframes floatDown {
          0%   { transform: translateY(-10vh) translateX(0) rotate(0deg); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.8; }
          100% { transform: translateY(110vh) translateX(var(--drift)) rotate(180deg); opacity: 0; }
        }
      `}</style>
      {items.map(p => (
        <span
          key={p.id}
          style={{
            position: "absolute",
            left: p.left,
            top: 0,
            fontSize: p.size,
            ["--drift" as string]: p.drift,
            animation: `${type === "snow" || type === "leaves" ? "floatDown" : "floatUp"} ${p.duration} ${p.delay} infinite linear`,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}

/* ── MAIN COMPONENT ── */
export default function HolidayOverlay() {
  const [holiday, setHoliday] = useState<Holiday | null>(null);
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const h = getHoliday();
    if (!h) return;
    const key = `vhfd-holiday-${h.name}-${new Date().toDateString()}`;
    if (sessionStorage.getItem(key)) return;
    setHoliday(h);
    const t = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => dismiss(), 4000);
    return () => clearTimeout(t);
  }, [visible]);

  const dismiss = useCallback(() => {
    setLeaving(true);
    setTimeout(() => {
      setVisible(false);
      setLeaving(false);
      if (holiday) {
        const key = `vhfd-holiday-${holiday.name}-${new Date().toDateString()}`;
        sessionStorage.setItem(key, "1");
      }
    }, 500);
  }, [holiday]);

  if (!holiday || !visible) return null;

  const useFireworks = holiday.effect === "fireworks";

  return (
    <div
      onClick={dismiss}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.8)",
        backdropFilter: useFireworks ? "none" : "blur(3px)",
        WebkitBackdropFilter: useFireworks ? "none" : "blur(3px)",
        cursor: "pointer",
        opacity: leaving ? 0 : 1,
        transition: "opacity 0.5s ease",
        padding: "1.5rem",
        overflow: "hidden",
      }}
    >
      {/* Background effect layer */}
      {useFireworks
        ? <FireworksCanvas />
        : <FloatingParticles type={holiday.effect as ParticleType} />
      }

      {/* Card */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: "relative",
          zIndex: 1,
          background: holiday.bgColor,
          border: "1px solid rgba(255,255,255,0.15)",
          maxWidth: "460px",
          width: "100%",
          padding: "clamp(1.75rem, 6vw, 3rem)",
          textAlign: "center",
          transform: leaving ? "scale(0.95) translateY(8px)" : "scale(1) translateY(0)",
          transition: "transform 0.5s ease",
          boxShadow: "0 0 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05)",
        }}
      >
        <button
          onClick={dismiss}
          style={{ position: "absolute", top: "0.875rem", right: "0.875rem", background: "none", border: "none", color: "rgba(255,255,255,0.35)", fontSize: "1rem", cursor: "pointer", lineHeight: 1, padding: "0.25rem", touchAction: "manipulation" }}
          aria-label="Close"
        >✕</button>

        <div style={{ fontSize: "clamp(2.5rem, 10vw, 4.5rem)", marginBottom: "0.75rem", filter: "drop-shadow(0 0 20px rgba(255,255,255,0.3))" }}>
          {holiday.emoji}
        </div>

        <h2 style={{
          fontFamily: "var(--font-display)",
          color: "#ffffff",
          fontSize: "clamp(1.6rem, 6vw, 2.6rem)",
          fontWeight: 700,
          textTransform: "uppercase",
          lineHeight: 1,
          marginBottom: "0.875rem",
          letterSpacing: "0.04em",
          textShadow: "0 2px 20px rgba(0,0,0,0.5)",
        }}>
          {holiday.message}
        </h2>

        <div style={{ width: "3rem", height: "2px", background: "#cc0000", margin: "0 auto 1rem" }} />

        <p style={{
          fontFamily: "var(--font-body)",
          color: "rgba(255,255,255,0.78)",
          fontSize: "clamp(0.82rem, 2.5vw, 0.95rem)",
          lineHeight: 1.7,
          marginBottom: "1.25rem",
        }}>
          {holiday.sub}
        </p>

        <p style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.25)", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>
          Tap anywhere to close
        </p>
      </div>
    </div>
  );
}
