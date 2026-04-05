"use client";

import { useEffect, useState } from "react";

interface Holiday {
  name: string;
  message: string;
  sub: string;
  emoji: string;
  color: string;
}

function getHoliday(): Holiday | null {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  const day = now.getDate();

  // Easter calculation (Anonymous Gregorian algorithm)
  const year = now.getFullYear();
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const easterMonth = Math.floor((h + l - 7 * m + 114) / 31);
  const easterDay = ((h + l - 7 * m + 114) % 31) + 1;
  const isEaster = month === easterMonth && day === easterDay;

  // Memorial Day — last Monday in May
  const memorialDay = (() => {
    const d = new Date(year, 4, 31);
    while (d.getDay() !== 1) d.setDate(d.getDate() - 1);
    return d.getDate();
  })();
  const isMemorialDay = month === 5 && day === memorialDay;

  // Labor Day — first Monday in September
  const laborDay = (() => {
    const d = new Date(year, 8, 1);
    while (d.getDay() !== 1) d.setDate(d.getDate() + 1);
    return d.getDate();
  })();
  const isLaborDay = month === 9 && day === laborDay;

  const holidays: { check: boolean; holiday: Holiday }[] = [
    {
      check: month === 1 && day === 1,
      holiday: {
        name: "New Year's Day",
        message: "Happy New Year",
        sub: "From all of us at Villa Hills Fire Department — wishing you a safe and prosperous 2025.",
        emoji: "🎆",
        color: "rgba(139,0,0,0.92)",
      },
    },
    {
      check: month === 2 && day === 14,
      holiday: {
        name: "Valentine's Day",
        message: "Happy Valentine's Day",
        sub: "Villa Hills Fire Department — grateful for this community we love and serve.",
        emoji: "❤️",
        color: "rgba(100,0,0,0.92)",
      },
    },
    {
      check: month === 3 && day === 17,
      holiday: {
        name: "St. Patrick's Day",
        message: "Happy St. Patrick's Day",
        sub: "May luck be with you — and if it's not, we'll be there. Stay safe, Villa Hills.",
        emoji: "☘️",
        color: "rgba(20,80,20,0.92)",
      },
    },
    {
      check: isEaster,
      holiday: {
        name: "Easter",
        message: "Happy Easter",
        sub: "Wishing you and your family a peaceful and joyful Easter. From Villa Hills Fire Department.",
        emoji: "✝️",
        color: "rgba(80,30,80,0.92)",
      },
    },
    {
      check: isMemorialDay,
      holiday: {
        name: "Memorial Day",
        message: "Memorial Day",
        sub: "We honor and remember those who gave everything in service to this country. Never forgotten.",
        emoji: "🇺🇸",
        color: "rgba(10,20,60,0.95)",
      },
    },
    {
      check: month === 7 && day === 4,
      holiday: {
        name: "Fourth of July",
        message: "Happy Fourth of July",
        sub: "Enjoy the celebration — and remember, we're always standing by. Stay safe, Villa Hills.",
        emoji: "🎇",
        color: "rgba(10,20,60,0.95)",
      },
    },
    {
      check: isLaborDay,
      holiday: {
        name: "Labor Day",
        message: "Happy Labor Day",
        sub: "Honoring the work and dedication of every person who shows up for their community. Villa Hills Fire Department.",
        emoji: "🔧",
        color: "rgba(20,20,20,0.95)",
      },
    },
    {
      check: month === 10 && day === 31,
      holiday: {
        name: "Halloween",
        message: "Happy Halloween",
        sub: "Have a safe night out there, Villa Hills. We'll keep the lights on — just the red ones.",
        emoji: "🎃",
        color: "rgba(80,35,0,0.95)",
      },
    },
    {
      check: month === 11 && day === 28,
      holiday: {
        name: "Thanksgiving",
        message: "Happy Thanksgiving",
        sub: "Grateful for this community and the privilege of serving it. From all of us at Villa Hills Fire Department.",
        emoji: "🍂",
        color: "rgba(80,40,10,0.95)",
      },
    },
    {
      check: month === 12 && day === 24,
      holiday: {
        name: "Christmas Eve",
        message: "Merry Christmas Eve",
        sub: "While you're with your families tonight, our volunteers are ready. Wishing you a safe and warm holiday.",
        emoji: "🕯️",
        color: "rgba(10,30,10,0.95)",
      },
    },
    {
      check: month === 12 && day === 25,
      holiday: {
        name: "Christmas Day",
        message: "Merry Christmas",
        sub: "From every member of Villa Hills Fire Department — wishing you peace, warmth, and a safe holiday.",
        emoji: "🎄",
        color: "rgba(10,60,10,0.95)",
      },
    },
  ];

  const match = holidays.find((h) => h.check);
  return match ? match.holiday : null;
}

export default function HolidayOverlay() {
  const [holiday, setHoliday] = useState<Holiday | null>(null);
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const h = getHoliday();
    if (!h) return;

    // Only show once per day per holiday
    const key = `vhfd-holiday-${h.name}-${new Date().toDateString()}`;
    if (sessionStorage.getItem(key)) return;

    setHoliday(h);
    // Small delay so page loads first
    const t = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(t);
  }, []);

  // Auto-dismiss after 6 seconds
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(() => dismiss(), 6000);
    return () => clearTimeout(t);
  }, [visible]);

  const dismiss = () => {
    setLeaving(true);
    setTimeout(() => {
      setVisible(false);
      setLeaving(false);
      if (holiday) {
        const key = `vhfd-holiday-${holiday.name}-${new Date().toDateString()}`;
        sessionStorage.setItem(key, "1");
      }
    }, 400);
  };

  if (!holiday || !visible) return null;

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
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        cursor: "pointer",
        opacity: leaving ? 0 : 1,
        transition: "opacity 0.4s ease",
        padding: "1.5rem",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: holiday.color,
          border: "1px solid rgba(255,255,255,0.12)",
          maxWidth: "480px",
          width: "100%",
          padding: "clamp(2rem, 6vw, 3.5rem)",
          textAlign: "center",
          transform: leaving ? "translateY(12px)" : "translateY(0)",
          transition: "transform 0.4s ease",
          position: "relative",
        }}
      >
        {/* Close */}
        <button
          onClick={dismiss}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.4)",
            fontSize: "1.2rem",
            cursor: "pointer",
            lineHeight: 1,
            padding: "0.25rem",
          }}
          aria-label="Close"
        >
          ✕
        </button>

        {/* Emoji */}
        <div style={{ fontSize: "clamp(2.5rem, 8vw, 4rem)", marginBottom: "1rem" }}>
          {holiday.emoji}
        </div>

        {/* Heading */}
        <h2
          style={{
            fontFamily: "var(--font-display)",
            color: "#ffffff",
            fontSize: "clamp(1.8rem, 6vw, 2.8rem)",
            fontWeight: 700,
            textTransform: "uppercase",
            lineHeight: 1,
            marginBottom: "1rem",
            letterSpacing: "0.04em",
          }}
        >
          {holiday.message}
        </h2>

        {/* Red rule */}
        <div style={{ width: "3rem", height: "2px", background: "#cc0000", margin: "0 auto 1.25rem" }} />

        {/* Sub text */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            color: "rgba(255,255,255,0.8)",
            fontSize: "clamp(0.85rem, 2.5vw, 1rem)",
            lineHeight: 1.7,
            marginBottom: "1.75rem",
          }}
        >
          {holiday.sub}
        </p>

        {/* Dismiss hint */}
        <p
          style={{
            fontFamily: "var(--font-body)",
            color: "rgba(255,255,255,0.3)",
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          Tap anywhere to close
        </p>
      </div>
    </div>
  );
}
