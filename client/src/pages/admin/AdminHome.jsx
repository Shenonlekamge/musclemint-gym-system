import { useEffect, useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout.jsx";
import { authHeader } from "../../lib/auth";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function AdminHome() {
  // ✅ Since you are NOT using adminNav, keep navItems here (same order everywhere)
  const navItems = [
    { to: "/admin", label: "Overview", icon: "📊" },
    { to: "/admin/members", label: "Members", icon: "👥" },
    { to: "/admin/plans", label: "Plans", icon: "💳" },
    { to: "/admin/staff", label: "Staff", icon: "🧑‍💼" },
  ];

  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      setError("");
      setLoading(true);

      const res = await fetch(`${API}/api/admin/overview`, {
        headers: { ...authHeader() },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to load overview");

      setStats(data);
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
    <DashboardLayout title="Admin Overview" role="Admin" navItems={navItems}>
      {error && (
        <div className="mb-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-200">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-10 text-center text-zinc-300">
          Loading overview…
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-5">
            {[
              { label: "Total Members", value: stats?.totalMembers ?? 0 },
              { label: "Active", value: stats?.activeMembers ?? 0 },
              { label: "Frozen", value: stats?.frozenMembers ?? 0 },
              { label: "Expired", value: stats?.expiredMembers ?? 0 },
              { label: "Expiring (7d)", value: stats?.expiringSoon ?? 0 },
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

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-6">
              <p className="font-semibold">Next: Payments &amp; Revenue</p>
              <p className="mt-1 text-sm text-zinc-300">
                We’ll add membership plans, payments, and real revenue analytics.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-6">
              <p className="font-semibold">Next: Staff Attendance</p>
              <p className="mt-1 text-sm text-zinc-300">
                Staff can check-in members and generate attendance reports.
              </p>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}