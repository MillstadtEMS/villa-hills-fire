"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") ?? "/admin";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username.trim().toLowerCase(), password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push(from);
    } else {
      setError("Invalid username or password.");
      setPassword("");
    }
  }

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] flex items-center justify-center px-4" style={{ zIndex: 200 }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#8B0000]/20 border border-[#8B0000]/30 mb-5">
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-[#dc2626]">
              <path d="M12 12.9l-2.13 2.09C9.31 15.55 9 16.28 9 17.06 9 18.68 10.35 20 12 20s3-1.32 3-2.94c0-.78-.31-1.51-.87-2.07L12 12.9z"/>
              <path d="M16 6l-.44.55C14.38 8.02 12 7.19 12 5.3V2S4 7 4 13c0 2.92 1.56 5.47 3.89 6.86-.56-.79-.89-1.76-.89-2.8 0-1.32.52-2.56 1.47-3.5L12 10.1l3.53 3.47c.95.93 1.47 2.17 1.47 3.5 0 1.02-.31 1.96-.85 2.74C18.37 18.46 20 15.91 20 13c0-4.42-4-8-4-7z"/>
            </svg>
          </div>
          <h1 className="text-white font-black text-2xl tracking-tight">Villa Hills FD</h1>
          <p className="text-gray-500 text-sm mt-1 tracking-widest uppercase">Admin Portal</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoFocus
              autoComplete="username"
              required
              className="w-full bg-white/5 border border-white/10 focus:border-[#8B0000]/50 rounded-xl px-4 py-3.5 text-white placeholder-gray-700 outline-none transition-colors"
              placeholder="admin"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full bg-white/5 border border-white/10 focus:border-[#8B0000]/50 rounded-xl px-4 py-3.5 text-white placeholder-gray-700 outline-none transition-colors"
              placeholder="••••••••••"
            />
          </div>
          {error && (
            <p className="text-red-400 text-sm flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#8B0000] hover:bg-[#a00000] disabled:opacity-50 text-white font-black py-3.5 rounded-xl transition-colors text-sm tracking-wide uppercase"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-gray-700 text-xs mt-8">
          Villa Hills Fire Department &middot; Staff Only
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}
