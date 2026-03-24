import DashboardLayout from "../../layouts/DashboardLayout.jsx";

export default function StaffHome() {
  const navItems = [
    { to: "/staff", label: "Today", icon: "✅" },
    { to: "/staff/checkin", label: "Check-in", icon: "📲" },
    { to: "/staff/attendance", label: "Attendance", icon: "🧾" },
  ];

  return (
    <DashboardLayout title="Staff Dashboard" role="Staff" navItems={navItems}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-6">
          <p className="font-semibold">Quick action</p>
          <p className="mt-1 text-sm text-zinc-300">
            Use <b>Check-in</b> to mark member attendance.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-6">
          <p className="font-semibold">View records</p>
          <p className="mt-1 text-sm text-zinc-300">
            Open <b>Attendance</b> to see today’s check-ins.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}