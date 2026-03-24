// src/pages/admin/Members.jsx
import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout.jsx";
import MemberModal from "../../components/MemberModal.jsx";
import { authHeader } from "../../lib/auth";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Badge({ status }) {
  const map = {
    Active: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
    Frozen: "border-amber-500/40 bg-amber-500/10 text-amber-300",
    Expired: "border-rose-500/40 bg-rose-500/10 text-rose-300",
  };
  return (
    <span
      className={`rounded-full border px-2 py-1 text-xs font-semibold ${
        map[status] || "border-zinc-700 bg-zinc-900 text-zinc-200"
      }`}
    >
      {status}
    </span>
  );
}

export default function Members() {
  const navItems = [
    { to: "/admin", label: "Overview", icon: "📊" },
    { to: "/admin/members", label: "Members", icon: "👥" },
    { to: "/admin/staff", label: "Staff", icon: "🧑‍💼" },
    { to: "/admin/plans", label: "Plans", icon: "💳" },

  ];

  const [members, setMembers] = useState([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members.filter((m) => {
      const matchQuery =
        !q ||
        (m.fullName || "").toLowerCase().includes(q) ||
        (m.email || "").toLowerCase().includes(q) ||
        (m.phone || "").toLowerCase().includes(q);

      const matchStatus = statusFilter === "All" || m.status === statusFilter;
      return matchQuery && matchStatus;
    });
  }, [members, query, statusFilter]);

  const stats = useMemo(() => {
    const active = members.filter((m) => m.status === "Active").length;
    const frozen = members.filter((m) => m.status === "Frozen").length;
    const expired = members.filter((m) => m.status === "Expired").length;
    return { active, frozen, expired, total: members.length };
  }, [members]);

  async function loadMembers() {
    try {
      setError("");
      setLoading(true);

      const url = `${API}/api/members?query=${encodeURIComponent(
        query
      )}&status=${encodeURIComponent(statusFilter)}`;

      const res = await fetch(url, {
        headers: { ...authHeader() },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to fetch members");

      setMembers(data);
    } catch (e) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const t = setTimeout(() => loadMembers(), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, statusFilter]);

  const openAdd = () => {
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (m) => {
    setEditing(m);
    setOpen(true);
  };

  const saveMember = async (form) => {
    try {
      setSaving(true);
      setError("");

      const isEdit = Boolean(editing?._id);
      const url = isEdit
        ? `${API}/api/members/${editing._id}`
        : `${API}/api/members`;

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Save failed");

      setOpen(false);
      setEditing(null);
      await loadMembers();
    } catch (e) {
      setError(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const removeMember = async (m) => {
    const ok = confirm(`Delete member: ${m.fullName}?`);
    if (!ok) return;

    try {
      setError("");

      const res = await fetch(`${API}/api/members/${m._id}`, {
        method: "DELETE",
        headers: { ...authHeader() },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Delete failed");

      await loadMembers();
    } catch (e) {
      setError(e.message || "Delete failed");
    }
  };

  return (
    <DashboardLayout title="Members" role="Admin" navItems={navItems}>
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total", value: stats.total },
          { label: "Active", value: stats.active },
          { label: "Frozen", value: stats.frozen },
          { label: "Expired", value: stats.expired },
        ].map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-5"
          >
            <p className="text-sm text-zinc-400">{c.label}</p>
            <p className="mt-2 text-2xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-200">
          {error}
        </div>
      )}

      {/* Controls */}
      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, phone..."
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm outline-none focus:border-zinc-400 sm:max-w-md"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm outline-none focus:border-zinc-400 sm:w-48"
          >
            <option value="All">All</option>
            <option value="Active">Active</option>
            <option value="Frozen">Frozen</option>
            <option value="Expired">Expired</option>
          </select>
        </div>

        <button
          onClick={openAdd}
          className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-emerald-400"
        >
          + Add Member
        </button>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/50">
        {loading ? (
          <div className="p-10 text-center text-zinc-300">Loading members…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-800 text-zinc-300">
                <tr>
                  <th className="px-4 py-3">Member</th>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Expiry</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((m) => (
                  <tr key={m._id} className="border-b border-zinc-900">
                    <td className="px-4 py-3">
                      <div className="font-semibold">{m.fullName}</div>
                      <div className="text-xs text-zinc-400">{m.email}</div>
                      <div className="text-xs text-zinc-500">{m.phone}</div>
                    </td>
                    <td className="px-4 py-3">{m.plan}</td>
                    <td className="px-4 py-3">
                      <Badge status={m.status} />
                    </td>
                    <td className="px-4 py-3">{m.expiryDate}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => openEdit(m)}
                          className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-semibold hover:bg-zinc-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeMember(m)}
                          className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-200 hover:bg-rose-500/20"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td
                      className="px-4 py-10 text-center text-zinc-400"
                      colSpan={5}
                    >
                      No members found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <MemberModal
        open={open}
        onClose={() => {
          if (!saving) setOpen(false);
        }}
        onSave={saveMember}
        member={editing}
      />
    </DashboardLayout>
  );
}