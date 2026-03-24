import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout.jsx";
import StaffModal from "../../components/StaffModal.jsx";
import { authHeader } from "../../lib/auth";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Staff() {
  const navItems = [
    { to: "/admin", label: "Overview", icon: "📊" },
    { to: "/admin/members", label: "Members", icon: "👥" },
    { to: "/admin/staff", label: "Staff", icon: "🧑‍💼" },
    { to: "/admin/plans", label: "Plans", icon: "💳" },
  ];

  const [staff, setStaff] = useState([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return staff;
    return staff.filter(
      (s) =>
        (s.name || "").toLowerCase().includes(q) ||
        (s.email || "").toLowerCase().includes(q)
    );
  }, [staff, query]);

  async function loadStaff() {
    try {
      setError("");
      setLoading(true);

      const res = await fetch(`${API}/api/users/staff`, {
        headers: { ...authHeader() },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to load staff");
      setStaff(data);
    } catch (e) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStaff();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const createStaff = async (form) => {
    try {
      setSaving(true);
      setError("");

      const res = await fetch(`${API}/api/users/staff`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Create staff failed");

      setOpen(false);
      await loadStaff();
      alert("Staff account created ✅");
    } catch (e) {
      setError(e.message || "Create staff failed");
    } finally {
      setSaving(false);
    }
  };

  const deleteStaff = async (s) => {
    const ok = confirm(`Delete staff: ${s.name} (${s.email}) ?`);
    if (!ok) return;

    try {
      setError("");

      const res = await fetch(`${API}/api/users/${s._id}`, {
        method: "DELETE",
        headers: { ...authHeader() },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Delete failed");

      await loadStaff();
    } catch (e) {
      setError(e.message || "Delete failed");
    }
  };

  return (
    <DashboardLayout title="Staff Management" role="Admin" navItems={navItems}>
      {error && (
        <div className="mb-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-200">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search staff by name/email..."
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm outline-none focus:border-zinc-400 sm:max-w-md"
        />

        <button
          onClick={() => setOpen(true)}
          className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-emerald-400"
        >
          + Add Staff
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/50">
        {loading ? (
          <div className="p-10 text-center text-zinc-300">Loading staff…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-800 text-zinc-300">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s._id} className="border-b border-zinc-900">
                    <td className="px-4 py-3 font-semibold">{s.name}</td>
                    <td className="px-4 py-3 text-zinc-200">{s.email}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs font-semibold">
                        {s.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => deleteStaff(s)}
                        className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-200 hover:bg-rose-500/20"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td className="px-4 py-10 text-center text-zinc-400" colSpan={4}>
                      No staff found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <StaffModal
        open={open}
        onClose={() => {
          if (!saving) setOpen(false);
        }}
        onSave={createStaff}
      />
    </DashboardLayout>
  );
}