"use client";

import { useEffect, useRef, useState } from "react";

// ── Holiday definitions ────────────────────────────────────────────────────

function nthWeekday(year: number, month: number, weekday: number, nth: number): number {
  const first = new Date(year, month - 1, 1).getDay();
  const offset = ((weekday - first) + 7) % 7;
  return 1 + offset + (nth - 1) * 7;
}

function lastWeekday(year: number, month: number, weekday: number): number {
  const daysInMonth = new Date(year, month, 0).getDate();
  const last = new Date(year, month - 1, daysInMonth).getDay();
  return daysInMonth - ((last - weekday + 7) % 7);
}

function easterDate(year: number): { m: number; d: number } {
  const a = year % 19, b = Math.floor(year / 100), c = year % 100;
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m2 = Math.floor((a + 11 * h + 22 * l) / 451);
  const mo = Math.floor((h + l - 7 * m2 + 114) / 31);
  const dy = ((h + l - 7 * m2 + 114) % 31) + 1;
  return { m: mo, d: dy };
}

interface Holiday {
  name: string;
  greeting: string;
  colors: string[];
  style: "confetti" | "fireworks" | "snow";
}

function getHoliday(date: Date): Holiday | null {
  const y = date.getFullYear(), m = date.getMonth() + 1, d = date.getDate();

  if (m === 1 && d === 1)   return { name: "New Year's Day",    greeting: "Happy New Year!",          colors: ["#f0c040","#c0c0c0","#ffffff","#ffdd00"], style: "fireworks" };
  if (m === 2 && d === 14)  return { name: "Valentine's Day",   greeting: "Happy Valentine's Day!",   colors: ["#e91e63","#f06292","#ff80ab","#ffffff"], style: "confetti" };
  if (m === 3 && d === 17)  return { name: "St. Patrick's Day", greeting: "Happy St. Patrick's Day!", colors: ["#2e7d32","#4caf50","#a5d6a7","#f0b429"], style: "confetti" };
  if (m === 7 && d === 4)   return { name: "Independence Day",  greeting: "Happy 4th of July!",       colors: ["#ef5350","#ffffff","#42a5f5","#ffee58"], style: "fireworks" };
  if (m === 10 && d === 31) return { name: "Halloween",         greeting: "Happy Halloween!",         colors: ["#ff6f00","#7b1fa2","#ffd740","#212121"], style: "confetti" };
  if (m === 12 && d === 25) return { name: "Christmas Day",     greeting: "Merry Christmas!",         colors: ["#e53935","#43a047","#fdd835","#ffffff"], style: "snow" };
  if (m === 12 && d === 31) return { name: "New Year's Eve",    greeting: "Happy New Year's Eve!",    colors: ["#f0c040","#e040fb","#ffffff","#00e5ff"], style: "fireworks" };

  if (m === 5 && d === nthWeekday(y, 5, 0, 2)) return { name: "Mother's Day",  greeting: "Happy Mother's Day!",  colors: ["#e91e63","#ab47bc","#f48fb1","#ffffff"], style: "confetti" };
  if (m === 5 && d === lastWeekday(y, 5, 1))   return { name: "Memorial Day",  greeting: "Happy Memorial Day!", colors: ["#ef5350","#ffffff","#42a5f5","#f0c040"], style: "confetti" };
  if (m === 6 && d === nthWeekday(y, 6, 0, 3)) return { name: "Father's Day",  greeting: "Happy Father's Day!", colors: ["#1976d2","#0288d1","#f0c040","#ffffff"], style: "confetti" };
  if (m === 9 && d === nthWeekday(y, 9, 1, 1)) return { name: "Labor Day",     greeting: "Happy Labor Day!",    colors: ["#ef5350","#ffffff","#42a5f5"],          style: "confetti" };
  if (m === 11 && d === nthWeekday(y, 11, 4, 4)) return { name: "Thanksgiving", greeting: "Happy Thanksgiving!", colors: ["#ef6c00","#f57c00","#f0c040","#795548","#ffffff"], style: "confetti" };

  const east = easterDate(y);
  if (m === east.m && d === east.d) return { name: "Easter", greeting: "Happy Easter!", colors: ["#ab47bc","#f0c040","#f06292","#66bb6a","#80deea"], style: "confetti" };

  return null;
}

// ── Canvas ─────────────────────────────────────────────────────────────────

interface Particle {
  x: number; y: number; vx: number; vy: number;
  color: string; size: number; rotation: number;
  rotVel: number; opacity: number; shape: number;
}

interface Spark {
  x: number; y: number; vx: number; vy: number;
  color: string; size: number; opacity: number;
}

function spawnConfetti(canvas: HTMLCanvasElement, colors: string[]): Particle[] {
  const out: Particle[] = [];
  for (let i = 0; i < 200; i++) {
    out.push({
      x: Math.random() * canvas.width,
      y: -(Math.random() * canvas.height * 0.6 + 20),
      vx: (Math.random() - 0.5) * 3,
      vy: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 14 + 6,
      rotation: Math.random() * Math.PI * 2,
      rotVel: (Math.random() - 0.5) * 0.2,
      opacity: 1,
      shape: Math.floor(Math.random() * 3),
    });
  }
  return out;
}

function spawnFirework(canvas: HTMLCanvasElement, colors: string[]): Spark[] {
  const out: Spark[] = [];
  const cx = canvas.width * (0.2 + Math.random() * 0.6);
  const cy = canvas.height * (0.1 + Math.random() * 0.4);
  const count = 70 + Math.floor(Math.random() * 40);
  const color = colors[Math.floor(Math.random() * colors.length)];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const speed = 3 + Math.random() * 6;
    out.push({ x: cx, y: cy, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, color, size: 3 + Math.random() * 3, opacity: 1 });
  }
  return out;
}

function spawnSnow(canvas: HTMLCanvasElement): Particle[] {
  const out: Particle[] = [];
  for (let i = 0; i < 130; i++) {
    out.push({
      x: Math.random() * canvas.width,
      y: -(Math.random() * canvas.height),
      vx: (Math.random() - 0.5) * 1.5,
      vy: Math.random() * 2 + 0.5,
      color: "#ffffff",
      size: Math.random() * 8 + 3,
      rotation: 0, rotVel: 0, opacity: 0.7 + Math.random() * 0.3,
      shape: 1,
    });
  }
  return out;
}

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle) {
  ctx.save();
  ctx.globalAlpha = p.opacity;
  ctx.fillStyle = p.color;
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rotation);
  if (p.shape === 0) {
    ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
  } else if (p.shape === 1) {
    ctx.beginPath();
    ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const r = i % 2 === 0 ? p.size / 2 : p.size / 4;
      i === 0 ? ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r) : ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

// ── Component ──────────────────────────────────────────────────────────────

export default function HolidayOverlay() {
  const [holiday, setHoliday] = useState<Holiday | null>(null);
  const [opacity, setOpacity] = useState(1);
  const [visible, setVisible] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const h = getHoliday(new Date());
    if (!h) return;
    const key = `vhfd-holiday-${h.name}-${new Date().toDateString()}`;
    if (sessionStorage.getItem(key)) return;
    setHoliday(h);
  }, []);

  useEffect(() => {
    if (!holiday || !visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    let particles: Particle[] = [];
    let sparks: Spark[] = [];
    let fireworkTimer = 0;

    if (holiday.style === "confetti") {
      particles = spawnConfetti(canvas, holiday.colors);
    } else if (holiday.style === "snow") {
      particles = spawnSnow(canvas);
    } else {
      sparks = [...sparks, ...spawnFirework(canvas, holiday.colors)];
    }

    const DURATION = 5500;
    const FADE_START = 4000;
    const start = performance.now();

    function animate(now: number) {
      const elapsed = now - start;
      if (elapsed >= DURATION) {
        cancelAnimationFrame(animRef.current);
        // save + hide
        const key = `vhfd-holiday-${holiday!.name}-${new Date().toDateString()}`;
        sessionStorage.setItem(key, "1");
        setVisible(false);
        return;
      }
      if (elapsed > FADE_START) {
        setOpacity(1 - (elapsed - FADE_START) / (DURATION - FADE_START));
      }

      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotVel;
        if (p.y > canvas!.height + 20) { p.y = -20; p.x = Math.random() * canvas!.width; }
        drawParticle(ctx!, p);
      });

      if (holiday?.style === "fireworks") {
        fireworkTimer++;
        if (fireworkTimer % 45 === 0) sparks = [...sparks, ...spawnFirework(canvas!, holiday.colors)];
        sparks = sparks.filter((s) => s.opacity > 0.05);
        sparks.forEach((s) => {
          s.x += s.vx; s.y += s.vy;
          s.vy += 0.08; s.vx *= 0.98;
          s.opacity *= 0.97;
          ctx!.save();
          ctx!.globalAlpha = s.opacity;
          ctx!.fillStyle = s.color;
          ctx!.shadowBlur = 6;
          ctx!.shadowColor = s.color;
          ctx!.beginPath();
          ctx!.arc(s.x, s.y, s.size, 0, Math.PI * 2);
          ctx!.fill();
          ctx!.restore();
        });
      }

      animRef.current = requestAnimationFrame(animate);
    }

    animRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [holiday, visible]);

  if (!holiday || !visible) return null;

  const [c1, c2] = holiday.colors;

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
      style={{ opacity, transition: "opacity 0.4s ease", background: "rgba(2,4,10,0.82)" }}
    >
      {/* Canvas particles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Greeting — centered, no box */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-6">
        <div
          className="font-display text-center leading-tight"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3.5rem, 14vw, 9rem)",
            fontWeight: 900,
            background: `linear-gradient(135deg, ${c1}, ${c2})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            filter: `drop-shadow(0 0 30px ${c1}99)`,
            textTransform: "uppercase",
          }}
        >
          {holiday.greeting}
        </div>
        <div
          className="text-white font-bold tracking-[0.3em] uppercase text-center"
          style={{ fontFamily: "var(--font-body)", fontSize: "clamp(0.6rem, 2.5vw, 0.9rem)", color: "rgba(255,255,255,0.6)" }}
        >
          From Villa Hills Fire Department
        </div>
      </div>
    </div>
  );
}
