import { useMemo, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout.jsx";
import { authHeader } from "../../lib/auth";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function CheckIn() {
  const navItems = [
    { to: "/staff", label: "Today", icon: "✅" },
    { to: "/staff/checkin", label: "Check-in", icon: "📲" },
    { to: "/staff/attendance", label: "Attendance", icon: "🧾" },
  ];

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canSearch = useMemo(() => query.trim().length >= 2, [query]);

  const search = async () => {
    try {
      setError("");
      setLoading(true);
      const res = await fetch(`${API}/api/staff/members?query=${encodeURIComponent(query)}`, {
        headers: { ...authHeader() },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Search failed");
      setResults(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const checkIn = async (memberId) => {
    try {
      setError("");
      setLoading(true);
      const res = await fetch(`${API}/api/staff/checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({ memberId, note }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Check-in failed");
      alert("Checked in ✅");
      setNote("");
    } catch (e) {
      // if duplicate check-in happens, mongoose unique index throws error
      setError(e.message || "Check-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Staff Check-in" role="Staff" navItems={navItems}>
      {error && (
        <div className="mb-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-200">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search member by name / email / phone (min 2 chars)"
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm outline-none focus:border-zinc-400"
          />

          <button
            disabled={!canSearch || loading}
            onClick={search}
            className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-emerald-400 disabled:opacity-60"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        <div className="mt-3">
          <label className="text-sm text-zinc-300">Note (optional)</label>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g., morning session"
            className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm outline-none focus:border-zinc-400"
          />
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-zinc-800 text-zinc-300">
              <tr>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Expiry</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {results.map((m) => (
                <tr key={m._id} className="border-b border-zinc-900">
                  <td className="px-4 py-3">
                    <div className="font-semibold">{m.fullName}</div>
                    <div className="text-xs text-zinc-400">{m.email}</div>
                    <div className="text-xs text-zinc-500">{m.phone}</div>
                  </td>
                  <td className="px-4 py-3">{m.status}</td>
                  <td className="px-4 py-3">{m.expiryDate}</td>
                  <td className="px-4 py-3">
                    <button
                      disabled={loading}
                      onClick={() => checkIn(m._id)}
                      className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs font-semibold hover:bg-zinc-800 disabled:opacity-60"
                    >
                      Check-in
                    </button>
                  </td>
                </tr>
              ))}

              {results.length === 0 && (
                <tr>
                  <td className="px-4 py-10 text-center text-zinc-400" colSpan={4}>
                    Search a member to check-in.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}