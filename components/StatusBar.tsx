"use client";

import { useEffect, useState } from "react";

interface Incident {
  type: string;
  location?: string | null;
  units?: string | null;
  receivedAt?: string;
}

export default function StatusBar() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [incident, setIncident] = useState<Incident | null>(null);

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

  // CAD polling — every 30 seconds
  useEffect(() => {
    const fetchCAD = async () => {
      try {
        const res = await fetch("/api/cad", { cache: "no-store" });
        const data = await res.json();
        setIncident(data.incident ?? null);
      } catch {
        // silently fail — don't break the UI
      }
    };

    fetchCAD();
    const id = setInterval(fetchCAD, 60_000);
    return () => clearInterval(id);
  }, []);

  const isActive = !!incident;

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

        {/* LEFT — operational status */}
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
                  · {new Date(incident!.receivedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })} {new Date(incident!.receivedAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}
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

        {/* CENTER — dept name */}
        <div
          className="hidden md:block text-center shrink-0"
          style={{ color: "rgba(139,0,0,0.7)", letterSpacing: "0.3em" }}
        >
          Villa Hills Fire Department
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
