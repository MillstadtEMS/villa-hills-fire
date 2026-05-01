"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [callCount, setCallCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/cad/log")
      .then(r => r.json())
      .then(calls => setCallCount(Array.isArray(calls) ? calls.length : 0))
      .catch(() => setCallCount(0));
  }, []);

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Villa Hills Fire Department &mdash; Admin Portal</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <a
          href="/admin/calls"
          className="group border border-white/8 rounded-2xl p-6 hover:bg-white/3 transition-colors"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-red-400">
                <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/>
              </svg>
            </div>
            <div>
              <h2 className="text-white font-bold text-sm group-hover:text-red-400 transition-colors">Call Log</h2>
              <p className="text-gray-500 text-xs">Review and manage dispatch entries</p>
            </div>
          </div>
          <div className="text-2xl font-black text-white tabular-nums">
            {callCount !== null ? callCount : "\u2014"}
            <span className="text-gray-600 text-sm font-normal ml-2">calls this year</span>
          </div>
        </a>
      </div>
    </div>
  );
}
