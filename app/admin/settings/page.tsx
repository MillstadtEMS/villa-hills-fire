"use client";

import { useEffect, useState } from "react";

interface User {
  id: string; username: string; role: string; createdAt: string;
}

const inp = "w-full bg-[#111] border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#8B0000]/50 placeholder:text-gray-600 transition-colors";
const lbl = "block text-gray-300 text-xs font-semibold mb-1.5 uppercase tracking-wide";

export default function SettingsPage() {
  // Password change
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw]         = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwMsg, setPwMsg]         = useState("");
  const [pwErr, setPwErr]         = useState("");
  const [pwSaving, setPwSaving]   = useState(false);

  // User management (superuser only)
  const [users, setUsers]       = useState<User[]>([]);
  const [isSuperuser, setIsSuperuser] = useState(false);
  const [showAdd, setShowAdd]   = useState(false);
  const [newUser, setNewUser]   = useState({ username: "", password: "", role: "admin" });
  const [addErr, setAddErr]     = useState("");
  const [adding, setAdding]     = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        setUsers(await res.json());
        setIsSuperuser(true);
      }
    } catch { /* not superuser or error */ }
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg(""); setPwErr("");
    if (newPw !== confirmPw) { setPwErr("New passwords don't match."); return; }
    if (newPw.length < 6) { setPwErr("Password must be at least 6 characters."); return; }
    setPwSaving(true);
    const res = await fetch("/api/admin/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
    });
    setPwSaving(false);
    if (res.ok) {
      setPwMsg("Password changed successfully.");
      setCurrentPw(""); setNewPw(""); setConfirmPw("");
    } else {
      const data = await res.json().catch(() => ({}));
      setPwErr(data.error ?? "Failed to change password.");
    }
  }

  async function addUser() {
    setAddErr("");
    if (!newUser.username.trim() || !newUser.password) { setAddErr("Username and password required."); return; }
    if (newUser.password.length < 6) { setAddErr("Password must be at least 6 characters."); return; }
    setAdding(true);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    });
    setAdding(false);
    if (res.ok) {
      setShowAdd(false);
      setNewUser({ username: "", password: "", role: "admin" });
      loadUsers();
    } else {
      const data = await res.json().catch(() => ({}));
      setAddErr(data.error ?? "Failed to create user.");
    }
  }

  async function removeUser(id: string, username: string) {
    if (!confirm(`Remove user "${username}"? They will no longer be able to log in.`)) return;
    await fetch("/api/admin/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadUsers();
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="h-px w-8 bg-[#8B0000]" />
          <span className="text-[#dc2626] text-xs font-black tracking-[0.25em] uppercase">Account</span>
        </div>
        <h1 className="text-3xl font-black text-white">Settings</h1>
      </div>

      {/* -- Change Password -- */}
      <div className="bg-[#111] border border-white/8 rounded-2xl p-6 mb-8">
        <h2 className="text-white font-black text-lg mb-1">Change Password</h2>
        <p className="text-gray-500 text-sm mb-5">Update your login password.</p>

        <form onSubmit={changePassword} className="space-y-4">
          <div>
            <label className={lbl}>Current Password</label>
            <input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} required className={inp} autoComplete="current-password" />
          </div>
          <div>
            <label className={lbl}>New Password</label>
            <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)} required className={inp} placeholder="Min. 6 characters" autoComplete="new-password" />
          </div>
          <div>
            <label className={lbl}>Confirm New Password</label>
            <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} required className={inp} autoComplete="new-password" />
          </div>
          {pwErr && <p className="text-red-400 text-sm">{pwErr}</p>}
          {pwMsg && <p className="text-emerald-400 text-sm">{pwMsg}</p>}
          <button type="submit" disabled={pwSaving}
            className="bg-[#8B0000] hover:bg-[#a00000] disabled:opacity-50 text-white font-black px-6 py-2.5 rounded-xl text-sm transition-colors">
            {pwSaving ? "Saving..." : "Change Password"}
          </button>
        </form>
      </div>

      {/* -- User Management (superuser only) -- */}
      {isSuperuser && (
        <div className="bg-[#111] border border-white/8 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-white font-black text-lg mb-1">User Management</h2>
              <p className="text-gray-500 text-sm">Add or remove admin users. Only superusers can manage users.</p>
            </div>
            <button
              onClick={() => setShowAdd(v => !v)}
              className="shrink-0 flex items-center gap-2 bg-[#8B0000]/15 hover:bg-[#8B0000]/25 border border-[#8B0000]/30 text-[#dc2626] font-black text-sm px-4 py-2.5 rounded-xl transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              Add User
            </button>
          </div>

          {showAdd && (
            <div className="border border-[#8B0000]/20 rounded-xl p-5 mb-6 bg-[#0a0a0a]">
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className={lbl}>Username</label>
                  <input
                    value={newUser.username}
                    onChange={e => setNewUser(u => ({...u, username: e.target.value}))}
                    placeholder="e.g. jsmith"
                    className={inp}
                    autoFocus
                  />
                </div>
                <div>
                  <label className={lbl}>Password</label>
                  <input
                    type="password"
                    value={newUser.password}
                    onChange={e => setNewUser(u => ({...u, password: e.target.value}))}
                    placeholder="Min. 6 characters"
                    className={inp}
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className={lbl}>Role</label>
                <select
                  value={newUser.role}
                  onChange={e => setNewUser(u => ({...u, role: e.target.value}))}
                  className={inp}
                >
                  <option value="admin">Admin — can manage calls</option>
                  <option value="superuser">Superuser — can manage calls + users</option>
                </select>
              </div>
              {addErr && <p className="text-red-400 text-sm mb-4">{addErr}</p>}
              <div className="flex items-center gap-3">
                <button onClick={addUser} disabled={adding}
                  className="bg-[#8B0000] hover:bg-[#a00000] disabled:opacity-40 text-white font-black px-6 py-2.5 rounded-xl text-sm transition-colors">
                  {adding ? "Creating..." : "Create User"}
                </button>
                <button onClick={() => { setShowAdd(false); setAddErr(""); }}
                  className="text-gray-500 hover:text-gray-300 px-4 py-2.5 rounded-xl text-sm transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {users.map(u => (
              <div key={u.id} className="flex items-center gap-4 border border-white/6 rounded-xl px-5 py-3 bg-white/2">
                <div className="flex-1 min-w-0">
                  <span className="text-white font-bold text-sm">{u.username}</span>
                  <span className={`ml-3 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${u.role === "superuser" ? "bg-[#8B0000]/20 text-[#dc2626] border border-[#8B0000]/30" : "bg-white/5 text-gray-400 border border-white/10"}`}>
                    {u.role}
                  </span>
                </div>
                <span className="text-gray-600 text-xs hidden sm:block">
                  {new Date(u.createdAt).toLocaleDateString()}
                </span>
                <button
                  onClick={() => removeUser(u.id, u.username)}
                  title="Remove user"
                  className="text-gray-700 hover:text-red-400 transition-colors p-1 shrink-0"
                >
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
