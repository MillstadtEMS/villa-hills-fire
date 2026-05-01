"use client";

import { useEffect, useState } from "react";

interface Call {
  id: string; dispatchDate: string; dispatchTime: string;
  dispatchNature: string; createdAt: string;
}

const COMMON_CALL_TYPES = [
  "Structure Fire",
  "Medical Assist",
  "Vehicle Crash",
  "Automatic Alarm",
  "Brush Fire",
  "Mutual Aid",
  "Hazardous Materials",
  "Fire Alarm Activation",
  "Standby",
  "Cancelled En Route",
  "Other",
];

function todayLocal() {
  const d = new Date();
  return d.toLocaleDateString("en-CA"); // YYYY-MM-DD
}
function nowTimeLocal() {
  const d = new Date();
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }); // HH:MM
}

function CallRow({
  c, isFirst, isEditing, editValue, saving,
  onEdit, onSave, onCancel, onDelete, onEditChange,
}: {
  c: Call; isFirst: boolean; isEditing: boolean;
  editValue: string; saving: boolean;
  onEdit: (c: Call) => void;
  onSave: (id: string) => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
  onEditChange: (v: string) => void;
}) {
  return (
    <div className={`border rounded-xl px-5 py-4 ${isFirst ? "bg-red-400/5 border-red-400/25" : "bg-white/2 border-white/6"}`}>
      {isEditing ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-xs tabular-nums font-mono">{c.dispatchDate} {c.dispatchTime}</span>
          </div>
          <div className="grid gap-3">
            <select
              value={COMMON_CALL_TYPES.includes(editValue) ? editValue : ""}
              onChange={e => onEditChange(e.target.value || editValue)}
              className="bg-[#111] border border-[#8B0000]/50 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#8B0000]/80"
            >
              <option value="">Quick call type</option>
              {COMMON_CALL_TYPES.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <input
              autoFocus
              value={editValue}
              onChange={e => onEditChange(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") onSave(c.id); if (e.key === "Escape") onCancel(); }}
              className="bg-[#111] border border-[#8B0000]/50 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#8B0000]/80"
              placeholder="Enter call description"
            />
            <div className="flex items-center gap-2">
              <button onClick={() => onSave(c.id)} disabled={saving}
                className="bg-[#8B0000] hover:bg-[#a00000] disabled:opacity-50 text-white font-black px-4 py-2.5 rounded-xl text-sm transition-colors shrink-0">
                {saving ? "Saving..." : "Save"}
              </button>
              <button onClick={onCancel}
                className="text-gray-500 hover:text-gray-300 px-3 py-2.5 rounded-xl text-sm transition-colors shrink-0">
                Cancel
              </button>
            </div>
          </div>
          <p className="text-gray-600 text-xs">This will update the live ticker on the site within 30 seconds.</p>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isFirst ? "bg-red-400" : "bg-gray-700"}`} />
          <span className="text-gray-500 text-xs tabular-nums font-mono w-20 shrink-0">{c.dispatchDate}</span>
          <span className="text-gray-400 text-xs tabular-nums font-mono w-12 shrink-0">{c.dispatchTime}</span>
          <span className={`text-sm font-bold flex-1 truncate ${isFirst ? "text-red-300" : "text-gray-300"}`}>{c.dispatchNature}</span>
          <button onClick={() => onEdit(c)} title="Edit call description"
            className="text-gray-600 hover:text-[#dc2626] transition-colors p-1 shrink-0">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
          </button>
          <button onClick={() => onDelete(c.id)} title="Remove from log"
            className="text-gray-700 hover:text-red-400 transition-colors p-1 shrink-0">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </div>
      )}
    </div>
  );
}

const inp = "w-full bg-[#111] border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#8B0000]/50 placeholder:text-gray-600 transition-colors";
const lbl = "block text-gray-300 text-xs font-semibold mb-1.5 uppercase tracking-wide";

export default function CallsAdmin() {
  const [calls, setCalls]     = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving]   = useState(false);

  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ dispatchDate: todayLocal(), dispatchTime: nowTimeLocal(), dispatchNature: "" });
  const [adding, setAdding]   = useState(false);
  const [sendingTest, setSendingTest] = useState(false);

  async function load() {
    const r = await fetch("/api/cad/log");
    setCalls(await r.json()); setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function startEdit(c: Call) { setEditingId(c.id); setEditValue(c.dispatchNature); }

  async function saveEdit(id: string) {
    if (!editValue.trim()) return cancelEdit();
    setSaving(true);
    await fetch("/api/admin/calls", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, dispatchNature: editValue.trim() }),
    });
    setSaving(false);
    setEditingId(null);
    await load();
  }

  function cancelEdit() { setEditingId(null); setEditValue(""); }

  async function del(id: string) {
    if (!confirm("Remove this call from the log?")) return;
    await fetch("/api/admin/calls", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    await load();
  }

  async function sendTestAlert() {
    if (sendingTest) return;
    if (!confirm("Fire a TEST DISPATCH alert dated right now? It will appear as ACTIVE CALL on the ticker for 2 hours. You can delete it from this page anytime.")) return;
    setSendingTest(true);
    await fetch("/api/admin/calls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        dispatchDate: todayLocal(),
        dispatchTime: nowTimeLocal(),
        dispatchNature: "TEST DISPATCH",
      }),
    });
    setSendingTest(false);
    await load();
  }

  async function addCall() {
    if (!addForm.dispatchNature.trim()) return;
    setAdding(true);
    await fetch("/api/admin/calls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addForm),
    });
    setAdding(false);
    setShowAdd(false);
    setAddForm({ dispatchDate: todayLocal(), dispatchTime: nowTimeLocal(), dispatchNature: "" });
    await load();
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="h-px w-8 bg-[#8B0000]" />
          <span className="text-[#dc2626] text-xs font-black tracking-[0.25em] uppercase">Dispatch</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white">Call Log</h1>
            <p className="text-gray-400 text-sm mt-1">{new Date().getFullYear()} &mdash; {calls.length} calls. Click the pencil to edit.</p>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={sendTestAlert}
              disabled={sendingTest}
              title="Fire a TEST DISPATCH dated right now — appears as ACTIVE CALL on the ticker for 2 hours."
              className="flex items-center gap-2 bg-amber-500/10 hover:bg-amber-500/20 disabled:opacity-50 border border-amber-500/30 text-amber-300 font-black text-sm px-4 py-2.5 rounded-xl transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 2L2 22h20L12 2zm0 6l6.53 11H5.47L12 8zm-1 4v3h2v-3h-2zm0 4v2h2v-2h-2z"/></svg>
              {sendingTest ? "Sending..." : "Send Test Alert"}
            </button>
            <button
              onClick={() => setShowAdd(v => !v)}
              className="flex items-center gap-2 bg-[#8B0000]/15 hover:bg-[#8B0000]/25 border border-[#8B0000]/30 text-[#dc2626] font-black text-sm px-4 py-2.5 rounded-xl transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              Add Call
            </button>
          </div>
        </div>
      </div>

      {showAdd && (
        <div className="bg-[#111] border border-[#8B0000]/20 rounded-2xl p-6 mb-8">
          <h2 className="text-white font-black text-base mb-5">Add to Log</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className={lbl}>Date</label>
              <input type="date" value={addForm.dispatchDate} onChange={e => setAddForm(f => ({...f, dispatchDate: e.target.value}))} className={inp} />
            </div>
            <div>
              <label className={lbl}>Time</label>
              <input type="time" value={addForm.dispatchTime} onChange={e => setAddForm(f => ({...f, dispatchTime: e.target.value}))} className={inp} />
            </div>
          </div>
          <div className="grid gap-4 mb-5">
            <div>
              <label className={lbl}>Quick Call Type</label>
              <select
                value={COMMON_CALL_TYPES.includes(addForm.dispatchNature) ? addForm.dispatchNature : ""}
                onChange={e => setAddForm(f => ({
                  ...f,
                  dispatchNature: e.target.value || f.dispatchNature,
                }))}
                className={inp}
              >
                <option value="">Select a quick type</option>
                {COMMON_CALL_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={lbl}>Call Type / Description</label>
              <input
                autoFocus
                value={addForm.dispatchNature}
                onChange={e => setAddForm(f => ({...f, dispatchNature: e.target.value}))}
                onKeyDown={e => { if (e.key === "Enter") addCall(); if (e.key === "Escape") setShowAdd(false); }}
                placeholder="e.g. Structure Fire"
                className={inp}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={addCall} disabled={adding || !addForm.dispatchNature.trim()}
              className="bg-[#8B0000] hover:bg-[#a00000] disabled:opacity-40 text-white font-black px-6 py-2.5 rounded-xl text-sm transition-colors">
              {adding ? "Adding..." : "Add to Log"}
            </button>
            <button onClick={() => setShowAdd(false)}
              className="text-gray-500 hover:text-gray-300 px-4 py-2.5 rounded-xl text-sm transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? <div className="text-gray-600 text-sm py-10">Loading...</div> : calls.length === 0 ? (
        <div className="text-center py-16 text-gray-600">No calls logged yet.</div>
      ) : (
        <div className="space-y-2">
          {calls.map((c, i) => (
            <CallRow
              key={c.id} c={c} isFirst={i === 0}
              isEditing={editingId === c.id}
              editValue={editValue} saving={saving}
              onEdit={startEdit} onSave={saveEdit}
              onCancel={cancelEdit} onDelete={del}
              onEditChange={setEditValue}
            />
          ))}
        </div>
      )}
      <p className="text-gray-700 text-xs mt-8">The most recent call always shows on the live ticker. Editing updates within 30 seconds.</p>
    </div>
  );
}
