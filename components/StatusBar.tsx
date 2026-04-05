"use client";

import { useEffect, useState } from "react";

interface Incident {
  type: string;
  location?: string | null;
  units?: string | null;
  receivedAt?: string;
}

type FireLevel = "normal" | "elevated" | "critical";

interface FireWeather {
  level: FireLevel;
  label: string;
}

async function fetchFireWeather(): Promise<FireWeather> {
  try {
    const res = await fetch(
      "https://api.weather.gov/alerts/active?zone=ILC163",
      {
        headers: {
          "User-Agent": "(villahillsfd.org, villahillsfd@gmail.com)",
          Accept: "application/geo+json",
        },
        cache: "no-store",
      }
    );
    const data = await res.json();
    const alerts: { properties: { event: string } }[] = data.features ?? [];

    for (const alert of alerts) {
      const ev = alert.properties.event.toLowerCase();
      if (ev.includes("red flag")) {
        return { level: "critical", label: "RED FLAG WARNING" };
      }
    }
    for (const alert of alerts) {
      const ev = alert.properties.event.toLowerCase();
      if (ev.includes("fire weather watch")) {
        return { level: "elevated", label: "FIRE WEATHER WATCH" };
      }
      if (ev.includes("fire weather")) {
        return { level: "elevated", label: "FIRE WEATHER ADVISORY" };
      }
    }
  } catch {
    // fail silently
  }
  return { level: "normal", label: "" };
}

export default function StatusBar() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [incident, setIncident] = useState<Incident | null>(null);
  const [fire, setFire] = useState<FireWeather>({ level: "normal", label: "" });

  // Clock
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
      setDate(
        now
          .toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
          })
          .toUpperCase()
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // CAD polling
  useEffect(() => {
    const fetchCAD = async () => {
      try {
        const res = await fetch("/api/cad", { cache: "no-store" });
        const data = await res.json();
        setIncident(data.incident ?? null);
      } catch {
        // silently fail
      }
    };
    fetchCAD();
    const id = setInterval(fetchCAD, 60_000);
    return () => clearInterval(id);
  }, []);

  // Fire weather polling — every 10 minutes
  useEffect(() => {
    fetchFireWeather().then(setFire);
    const id = setInterval(() => fetchFireWeather().then(setFire), 10 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const isActive = !!incident;

  const fireDot =
    fire.level === "critical"
      ? "#ff4400"
      : fire.level === "elevated"
      ? "#f59e0b"
      : null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-10 flex items-center"
      style={{
        background: isActive ? "#1a0000" : "#0d0d0d",
        borderBottom: isActive
          ? "1px solid rgba(220,38,38,0.7)"
          : "1px solid rgba(139,0,0,0.4)",
        transition: "background 0.4s, border-color 0.4s",
      }}
    >
      <div className="wrap w-full flex items-center justify-between gap-4 text-[0.65rem] font-mono tracking-widest uppercase">

        {/* LEFT — CAD status */}
        <div className="flex items-center gap-3 shrink-0 min-w-0">
          {isActive ? (
            <>
              <span
                className="shrink-0 inline-block w-2 h-2 rounded-full bg-red-500"
                style={{ animation: "pulse 1s ease-in-out infinite" }}
              />
              <span className="text-red-400 font-bold tracking-wider">ACTIVE CALL</span>
              {incident!.receivedAt && (
                <span className="text-gray-400 hidden sm:inline shrink-0">
                  · {new Date(incident!.receivedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}{" "}
                  {new Date(incident!.receivedAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
                </span>
              )}
              {incident!.type && (
                <span className="text-white font-semibold hidden sm:inline shrink-0">
                  · {incident!.type}
                </span>
              )}
              {incident!.location && (
                <span className="text-gray-300 hidden md:inline truncate">
                  · {incident!.location}
                </span>
              )}
            </>
          ) : (
            <>
              <span className="shrink-0 inline-block w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-green-600">In Service</span>
              <span className="text-gray-700 hidden sm:inline">·</span>
              <span className="text-gray-600 hidden sm:inline">No Active Incidents</span>
            </>
          )}
        </div>

        {/* CENTER — fire weather */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full shrink-0"
            style={{
              background: fire.level === "critical" ? "#ff4400" : fire.level === "elevated" ? "#f59e0b" : "#22c55e",
              animation: fire.level === "critical" ? "pulse 0.8s ease-in-out infinite" : "none",
            }}
          />
          <span
            className="font-bold tracking-wider"
            style={{
              color: fire.level === "critical" ? "#ff4400" : fire.level === "elevated" ? "#f59e0b" : "#16a34a",
            }}
          >
            {fire.level === "normal" ? "No Fire Hazards" : fire.label}
          </span>
        </div>

        {/* RIGHT — clock */}
        <div className="flex items-center gap-4 shrink-0 text-gray-600">
          <span className="hidden sm:inline">{date}</span>
          <span style={{ color: "#8B0000", fontWeight: 700 }}>{time}</span>
        </div>

      </div>
    </div>
  );
}
