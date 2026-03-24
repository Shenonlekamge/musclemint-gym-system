import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout.jsx";
import { authHeader } from "../../lib/auth";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Attendance() {
  const navItems = [
    { to: "/staff", label: "Today", icon: "✅" },
    { to: "/staff/checkin", label: "Check-in", icon: "📲" },
    { to: "/staff/attendance", label: "Attendance", icon: "🧾" },
  ];

  const [data, setData] = useState({ date: "", rows: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    try {
      setError("");
      setLoading(true);
      const res = await fetch(`${API}/api/staff/attendance/today`, {
        headers: { ...authHeader() },
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message || "Failed to load attendance");
      setData(json);
    } catch (e) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <DashboardLayout title="Today's Attendance" role="Staff" navItems={navItems}>
      {error && (
        <div className="mb-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-200">
          {error}
        </div>
      )}

      <div className="mb-4 rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4 text-sm text-zinc-300">
        Date: <span className="font-semibold text-white">{data.date || "—"}</span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/50">
        {loading ? (
          <div className="p-10 text-center text-zinc-300">Loading attendance…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-800 text-zinc-300">
                <tr>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Member</th>
                  <th className="px-4 py-3">Staff</th>
                  <th className="px-4 py-3">Note</th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map((r) => (
                  <tr key={r._id} className="border-b border-zinc-900">
                    <td className="px-4 py-3">{r.time}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold">{r.memberId?.fullName}</div>
                      <div className="text-xs text-zinc-400">{r.memberId?.email}</div>
                    </td>
                    <td className="px-4 py-3">{r.staffId?.name}</td>
                    <td className="px-4 py-3">{r.note || "-"}</td>
                  </tr>
                ))}

                {data.rows.length === 0 && (
                  <tr>
                    <td className="px-4 py-10 text-center text-zinc-400" colSpan={4}>
                      No check-ins yet today.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}