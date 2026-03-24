import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout.jsx";
import PlanModal from "../../components/PlanModal.jsx";
import { authHeader } from "../../lib/auth";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Pill({ children }) {
  return (
    <span className="rounded-full border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs font-semibold text-zinc-200">
      {children}
    </span>
  );
}

export default function Plans() {
  const navItems = [
    { to: "/admin", label: "Overview", icon: "📊" },
    { to: "/admin/members", label: "Members", icon: "👥" },
    { to: "/admin/staff", label: "Staff", icon: "🧑‍💼" },
    { to: "/admin/plans", label: "Plans", icon: "💳" },
  ];

  const [plans, setPlans] = useState([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return plans;
    return plans.filter(
      (p) =>
        (p.name || "").toLowerCase().includes(q) ||
        (p.category || "").toLowerCase().includes(q)
    );
  }, [plans, query]);

  async function loadPlans() {
    try {
      setError("");
      setLoading(true);

      const res = await fetch(`${API}/api/plans`, {
        headers: { ...authHeader() },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to load plans");

      setPlans(data);
    } catch (e) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPlans();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAdd = () => {
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setOpen(true);
  };

  const savePlan = async (payload) => {
    try {
      setSaving(true);
      setError("");

      const isEdit = Boolean(editing?._id);
      const url = isEdit ? `${API}/api/plans/${editing._id}` : `${API}/api/plans`;

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Save failed");

      setOpen(false);
      setEditing(null);
      await loadPlans();
    } catch (e) {
      setError(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const deletePlan = async (p) => {
    const ok = confirm(`Delete plan: ${p.name}?`);
    if (!ok) return;

    try {
      setError("");

      const res = await fetch(`${API}/api/plans/${p._id}`, {
        method: "DELETE",
        headers: { ...authHeader() },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Delete failed");

      await loadPlans();
    } catch (e) {
      setError(e.message || "Delete failed");
    }
  };

  // Seed your default plans
  const seedDefaults = async () => {
    const ok = confirm("Seed default plans (Monthly/3 Months/Annual/Couple)?");
    if (!ok) return;

    try {
      setSaving(true);
      setError("");

      const res = await fetch(`${API}/api/seed/plans`, {
        method: "POST",
        headers: { ...authHeader() },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Seeding failed");

      await loadPlans();
      alert("Default plans seeded ✅ (you can edit prices now)");
    } catch (e) {
      setError(e.message || "Seeding failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout title="Plans" role="Admin" navItems={navItems}>
      {error && (
        <div className="mb-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-200">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search plans..."
          className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm outline-none focus:border-zinc-400 sm:max-w-md"
        />

        <div className="flex flex-wrap gap-2">
          <button
            onClick={seedDefaults}
            disabled={saving}
            className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-zinc-200 hover:bg-zinc-800 disabled:opacity-60"
          >
            Seed Defaults
          </button>

          <button
            onClick={openAdd}
            className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-emerald-400"
          >
            + Add Plan
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/50">
        {loading ? (
          <div className="p-10 text-center text-zinc-300">Loading plans…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-800 text-zinc-300">
                <tr>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Duration</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((p) => (
                  <tr key={p._id} className="border-b border-zinc-900">
                    <td className="px-4 py-3">
                      <div className="font-semibold">{p.name}</div>
                      {p.description ? (
                        <div className="mt-1 text-xs text-zinc-400">{p.description}</div>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      <Pill>{p.category}</Pill>
                    </td>
                    <td className="px-4 py-3">{p.durationDays} days</td>
                    <td className="px-4 py-3">LKR {Number(p.priceLKR).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      {p.isActive ? (
                        <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-300">
                          active
                        </span>
                      ) : (
                        <span className="rounded-full border border-rose-500/40 bg-rose-500/10 px-2 py-1 text-xs font-semibold text-rose-200">
                          inactive
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-semibold hover:bg-zinc-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deletePlan(p)}
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
                    <td className="px-4 py-10 text-center text-zinc-400" colSpan={6}>
                      No plans found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <PlanModal
        open={open}
        onClose={() => {
          if (!saving) setOpen(false);
        }}
        onSave={savePlan}
        plan={editing}
      />
    </DashboardLayout>
  );
}