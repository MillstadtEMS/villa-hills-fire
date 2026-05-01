"use client";

import { useEffect, useState, useCallback, useRef } from "react";

interface Call {
  id: string;
  dispatchDate: string;
  dispatchTime: string;
  dispatchNature: string;
  dispatchDatetime: string;
  sourceYear: number;
}

const POLL_INTERVAL = 30_000;

function shortDate(date: string): string {
  return date.slice(0, 5); // "04/04"
}

function formatClock(date: Date): string {
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export default function CallTicker() {
  const [latest, setLatest]       = useState<Call[]>([]);
  const [allCalls, setAllCalls]   = useState<Call[]>([]);
  const [callCount, setCallCount] = useState<number | null>(null);
  const [expanded, setExpanded]   = useState(false);
  const [loading, setLoading]     = useState(true);
  const [now, setNow]             = useState<Date>(new Date());
  const wrapperRef                = useRef<HTMLDivElement>(null);

  const fetchLatest = useCallback(async () => {
    try {
      const res = await fetch("/api/cad/latest", { cache: "no-store" });
      if (res.ok) setLatest(await res.json());
    } catch { /* silent */ }
    setLoading(false);
  }, []);

  const fetchAll = useCallback(async () => {
    try {
      const res = await fetch("/api/cad/log", { cache: "no-store" });
      if (res.ok) {
        const calls: Call[] = await res.json();
        setAllCalls(calls);
        setCallCount(calls.length);
      }
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    fetchLatest();
    fetchAll();
    const pollId = setInterval(() => {
      fetchLatest();
      fetchAll();
    }, POLL_INTERVAL);
    return () => clearInterval(pollId);
  }, [fetchLatest, fetchAll]);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (expanded) fetchAll();
  }, [expanded, fetchAll]);

  useEffect(() => {
    if (!expanded) return;
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setExpanded(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [expanded]);

  const currentYear = now.getFullYear();
  const lastCall    = loading ? null : (latest[0] ?? null);

  return (
    <div ref={wrapperRef} className="fixed top-0 left-0 right-0" style={{ zIndex: 60 }}>

      {/* -- Expanded call log panel -- */}
      {expanded && (
        <div
          className="bg-[#0a0a0a]/98 backdrop-blur-md border-b border-white/10 shadow-2xl shadow-black/60"
          style={{ maxHeight: "60vh", overflowY: "auto" }}
        >
          <div className="wrap py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="h-px w-5 bg-[#8B0000]" />
                <span className="text-[#dc2626] text-xs font-black tracking-[0.2em] uppercase">
                  {currentYear} Dispatch Log
                </span>
              </div>
              <span className="text-gray-600 text-xs">
                {allCalls.length} call{allCalls.length !== 1 ? "s" : ""} this year
              </span>
            </div>

            {allCalls.length === 0 ? (
              <div className="py-8 text-center text-gray-500 text-sm">No calls logged yet for this year.</div>
            ) : (
              <div className="divide-y divide-white/5">
                {allCalls.map((call) => (
                  <div key={call.id} className="flex items-center gap-3 py-3 px-1">
                    <span className="w-2 h-2 rounded-full shrink-0 bg-red-500/70" />
                    <span className="text-gray-500 text-xs tabular-nums w-20 shrink-0">{call.dispatchDate}</span>
                    <span className="text-gray-400 text-xs tabular-nums w-12 shrink-0 font-mono">{call.dispatchTime}</span>
                    <span className="text-xs font-bold uppercase tracking-wide truncate text-gray-300">
                      {call.dispatchNature}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <p className="text-gray-700 text-[10px] mt-4 pt-3 border-t border-white/5">
              Displaying dispatch nature only. Times in local time. Log resets January 1.
            </p>
          </div>
        </div>
      )}

      {/* -- Ticker strip -- */}
      <div className="bg-[#0d0d0d] border-b border-[rgba(139,0,0,0.4)] select-none" style={{ height: "40px" }}>
        <div className="h-full wrap flex items-center gap-2 text-[0.65rem] font-mono tracking-widest uppercase">

          {/* -- Status dot + label -- */}
          <div className="shrink-0 flex items-center gap-1.5">
            <span className="relative flex w-2 h-2">
              <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${lastCall ? "bg-red-500" : "bg-green-500"}`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${lastCall ? "bg-red-500" : "bg-green-500"}`} />
            </span>
            <span className={`text-[10px] font-black tracking-wider uppercase whitespace-nowrap ${lastCall ? "text-red-400" : "text-green-600"}`}>
              {lastCall ? "Last Call" : "In Service"}
            </span>
          </div>

          <span className="h-3 w-px bg-white/15 shrink-0" />

          {/* -- Call info -- */}
          <div className="flex-1 min-w-0 overflow-hidden">
            {lastCall ? (
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-gray-500 text-[10px] whitespace-nowrap shrink-0">@</span>
                <span className="text-white font-bold tabular-nums font-mono text-[10px] whitespace-nowrap shrink-0">
                  {shortDate(lastCall.dispatchDate)} {lastCall.dispatchTime}
                </span>
                <span className="text-white/20 shrink-0">&middot;</span>
                <span className="text-red-400 font-bold text-[11px] truncate">{lastCall.dispatchNature}</span>
              </div>
            ) : (
              <span className="text-gray-600 text-[10px]">No active incidents.</span>
            )}
          </div>

          {/* -- Call count tracker -- */}
          <div className="shrink-0 flex items-center gap-2 border border-white/10 rounded-full px-3 py-1 bg-white/5 text-[10px] text-gray-300 min-w-[90px]">
            <span className="text-gray-500 uppercase tracking-[0.2em]">Calls</span>
            <span className="font-black tabular-nums text-white">{callCount ?? "0"}</span>
          </div>

          <span className="h-3 w-px bg-white/15 shrink-0" />
          <div className="shrink-0 items-center gap-1.5 hidden md:flex">
            <span className="text-gray-600 text-[10px] tabular-nums font-mono">{formatDate(now)}</span>
            <span style={{ color: "#8B0000", fontWeight: 700 }} className="text-[10px] tabular-nums font-mono">{formatClock(now)}</span>
          </div>

          {/* -- Expand toggle -- */}
          <button
            onClick={() => setExpanded(v => !v)}
            className="shrink-0 flex items-center gap-1 px-3 py-1 rounded-full bg-[#8B0000]/10 hover:bg-[#8B0000]/15 border border-white/10 text-gray-300 hover:text-white transition-colors text-[10px] font-bold"
            aria-label={expanded ? "Collapse call log" : "View call log"}
          >
            <span className="hidden sm:inline">{expanded ? "Hide Call Log" : "View Call Log"}</span>
            <svg viewBox="0 0 24 24" className={`w-3 h-3 fill-current transition-transform ${expanded ? "rotate-180" : ""}`}>
              <path d="M7 14l5-5 5 5H7z" />
            </svg>
          </button>

        </div>
      </div>

      {/* -- Disclaimer bar -- only visible when log is expanded -- */}
      {expanded && (
        <div className="bg-[#080808] border-b border-white/5 py-0.5 text-center select-none">
          <span className="text-gray-600 text-[9px] tracking-wide">
            <span className="font-bold text-gray-500">{callCount ?? "\u2014"}</span> calls logged {currentYear}
          </span>
        </div>
      )}

    </div>
  );
}
