import DashboardLayout from "../../layouts/DashboardLayout.jsx";

export default function MemberHome() {
  const navItems = [
    { to: "/member", label: "My Status", icon: "👤" },
    { to: "/member", label: "My Classes (next)", icon: "🎟️" },
    { to: "/member", label: "Payments (next)", icon: "💰" },
  ];

  return (
    <DashboardLayout title="Member Portal" role="Member" navItems={navItems}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-5">
          <p className="text-sm text-zinc-400">Membership</p>
          <p className="mt-2 text-xl font-bold">Active</p>
          <p className="mt-1 text-sm text-zinc-300">Expires: 2026-03-15</p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-5">
          <p className="text-sm text-zinc-400">Next Class</p>
          <p className="mt-2 text-xl font-bold">Strength Training</p>
          <p className="mt-1 text-sm text-zinc-300">Sat 6:00 PM</p>
        </div>
      </div>
    </DashboardLayout>
  );
}