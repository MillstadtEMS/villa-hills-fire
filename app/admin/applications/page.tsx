"use client";

import { useEffect, useState } from "react";

interface Application {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: "pending" | "approved" | "denied" | "waitlisted";
  notes?: string;
  createdAt: string;
}

interface ChecklistItem {
  id: string;
  item: string;
  completed: boolean;
}

const inp = "w-full bg-[#111] border border-white/15 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#8B0000]/50 placeholder:text-gray-600 transition-colors";
const lbl = "block text-gray-300 text-xs font-semibold mb-1.5 uppercase tracking-wide";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newItem, setNewItem] = useState("");
  const [statusNotes, setStatusNotes] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  async function loadApplications() {
    try {
      const res = await fetch("/api/admin/applications");
      if (res.ok) {
        setApplications(await res.json());
      }
    } catch (err) {
      console.error("Failed to load applications:", err);
    } finally {
      setLoading(false);
    }
  }

  async function loadChecklist(applicationId: string) {
    try {
      const res = await fetch(`/api/admin/checklist?applicationId=${applicationId}`);
      if (res.ok) {
        setChecklist(await res.json());
      }
    } catch (err) {
      console.error("Failed to load checklist:", err);
    }
  }

  async function updateStatus(app: Application, status: "pending" | "approved" | "denied" | "waitlisted") {
    try {
      const res = await fetch("/api/admin/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: app.id, status, notes: statusNotes }),
      });
      if (res.ok) {
        setApplications(apps => apps.map(a => a.id === app.id ? { ...a, status, notes: statusNotes } : a));
        setSelectedApp(prev => prev ? { ...prev, status, notes: statusNotes } : null);
        setStatusNotes("");
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  }

  async function addChecklistItem() {
    if (!selectedApp || !newItem.trim()) return;

    try {
      const res = await fetch("/api/admin/checklist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: selectedApp.id, item: newItem.trim() }),
      });
      if (res.ok) {
        const item = await res.json();
        setChecklist(prev => [...prev, item]);
        setNewItem("");
      }
    } catch (err) {
      console.error("Failed to add checklist item:", err);
    }
  }

  async function toggleChecklistItem(id: string, completed: boolean) {
    try {
      const res = await fetch("/api/admin/checklist", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, completed }),
      });
      if (res.ok) {
        setChecklist(prev => prev.map(item =>
          item.id === id ? { ...item, completed } : item
        ));
      }
    } catch (err) {
      console.error("Failed to update checklist item:", err);
    }
  }

  async function deleteChecklistItem(id: string) {
    try {
      const res = await fetch("/api/admin/checklist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setChecklist(prev => prev.filter(item => item.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete checklist item:", err);
    }
  }

  function selectApplication(app: Application) {
    setSelectedApp(app);
    loadChecklist(app.id);
    setStatusNotes(app.notes || "");
  }

  const statusColors = {
    pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    approved: "bg-green-500/20 text-green-400 border-green-500/30",
    denied: "bg-red-500/20 text-red-400 border-red-500/30",
    waitlisted: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  };

  if (loading) {
    return (
      <div className="max-w-6xl">
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-[#8B0000] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-400">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="h-px w-8 bg-[#8B0000]" />
          <span className="text-[#dc2626] text-xs font-black tracking-[0.25em] uppercase">Applications</span>
        </div>
        <h1 className="text-3xl font-black text-white">Membership Applications</h1>
        <p className="text-gray-500 text-sm mt-2">Review and manage volunteer firefighter applications.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Applications List */}
        <div className="lg:col-span-1">
          <div className="bg-[#111] border border-white/8 rounded-2xl p-6">
            <h2 className="text-white font-black text-lg mb-4">Applications ({applications.length})</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {applications.map(app => (
                <div
                  key={app.id}
                  onClick={() => selectApplication(app)}
                  className={`p-4 rounded-xl border cursor-pointer transition-colors ${
                    selectedApp?.id === app.id
                      ? "border-[#8B0000]/50 bg-[#8B0000]/10"
                      : "border-white/6 bg-white/2 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-white font-bold text-sm">{app.firstName} {app.lastName}</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${statusColors[app.status]}`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs">{app.email}</p>
                  <p className="text-gray-500 text-xs mt-1">{new Date(app.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
              {applications.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-8">No applications yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Application Details */}
        <div className="lg:col-span-2">
          {selectedApp ? (
            <div className="space-y-6">
              {/* Application Info */}
              <div className="bg-[#111] border border-white/8 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-white font-black text-lg">{selectedApp.firstName} {selectedApp.lastName}</h2>
                  <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded border ${statusColors[selectedApp.status]}`}>
                    {selectedApp.status}
                  </span>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className={lbl}>Email</label>
                    <p className="text-white text-sm">{selectedApp.email}</p>
                  </div>
                  <div>
                    <label className={lbl}>Phone</label>
                    <p className="text-white text-sm">{selectedApp.phone}</p>
                  </div>
                </div>

                {/* Status Update */}
                <div className="border-t border-white/8 pt-6">
                  <h3 className="text-white font-bold text-sm mb-3">Update Status</h3>
                  <div className="space-y-4">
                    <div>
                      <label className={lbl}>Notes</label>
                      <textarea
                        value={statusNotes}
                        onChange={e => setStatusNotes(e.target.value)}
                        placeholder="Add notes about this application..."
                        className={inp}
                        rows={3}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => updateStatus(selectedApp, "approved")}
                        className="bg-green-600 hover:bg-green-700 text-white font-black px-4 py-2 rounded-xl text-sm transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(selectedApp, "denied")}
                        className="bg-red-600 hover:bg-red-700 text-white font-black px-4 py-2 rounded-xl text-sm transition-colors"
                      >
                        Deny
                      </button>
                      <button
                        onClick={() => updateStatus(selectedApp, "waitlisted")}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-black px-4 py-2 rounded-xl text-sm transition-colors"
                      >
                        Waitlist
                      </button>
                      <button
                        onClick={() => updateStatus(selectedApp, "pending")}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-black px-4 py-2 rounded-xl text-sm transition-colors"
                      >
                        Mark Pending
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checklist */}
              <div className="bg-[#111] border border-white/8 rounded-2xl p-6">
                <h3 className="text-white font-black text-lg mb-4">Membership Checklist</h3>

                {/* Add New Item */}
                <div className="flex gap-3 mb-6">
                  <input
                    value={newItem}
                    onChange={e => setNewItem(e.target.value)}
                    placeholder="Add checklist item..."
                    className={inp}
                    onKeyPress={e => e.key === "Enter" && addChecklistItem()}
                  />
                  <button
                    onClick={addChecklistItem}
                    disabled={!newItem.trim()}
                    className="shrink-0 bg-[#8B0000] hover:bg-[#a00000] disabled:opacity-50 text-white font-black px-4 py-2.5 rounded-xl text-sm transition-colors"
                  >
                    Add
                  </button>
                </div>

                {/* Checklist Items */}
                <div className="space-y-3">
                  {checklist.map(item => (
                    <div key={item.id} className="flex items-center gap-3 p-3 border border-white/6 rounded-xl bg-white/2">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={e => toggleChecklistItem(item.id, e.target.checked)}
                        className="w-4 h-4 text-[#8B0000] bg-gray-100 border-gray-300 rounded focus:ring-[#8B0000] focus:ring-2"
                      />
                      <span className={`flex-1 text-sm ${item.completed ? "text-gray-500 line-through" : "text-white"}`}>
                        {item.item}
                      </span>
                      <button
                        onClick={() => deleteChecklistItem(item.id)}
                        className="text-gray-500 hover:text-red-400 transition-colors p-1"
                        title="Delete item"
                      >
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                  {checklist.length === 0 && (
                    <p className="text-gray-500 text-sm text-center py-4">No checklist items yet. Add some tasks to track progress.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#111] border border-white/8 rounded-2xl p-12 text-center">
              <p className="text-gray-500">Select an application to view details and manage status.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}