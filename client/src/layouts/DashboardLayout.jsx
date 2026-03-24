import { NavLink, useNavigate } from "react-router-dom";
import { clearAuth, getAuth } from "../lib/auth";

const linkBase =
  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition";
const linkInactive = "text-zinc-300 hover:bg-white/5 hover:text-white";
const linkActive = "bg-white/10 text-white";

export default function DashboardLayout({ title, role, navItems, children }) {
  const navigate = useNavigate();
  const auth = getAuth();

  // outer padding so rounded corners are visible
  const FRAME = 18; // px
  const SIDEBAR_W = 280; // px

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Subtle vignette */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_55%)]" />

      {/* FRAME */}
      <div className="relative min-h-screen" style={{ padding: FRAME }}>
        {/* Fixed rounded sidebar */}
        <aside
          className="fixed top-0 z-30"
          style={{ left: FRAME, top: FRAME, width: SIDEBAR_W, height: `calc(100vh - ${FRAME * 2}px)` }}
        >
          <div className="h-full rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.55)] p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-zinc-300/70">MuscleMint</p>
                <h2 className="text-lg font-bold">{role} Panel</h2>
              </div>
              <span className="rounded-full border border-white/15 bg-white/5 px-2 py-1 text-xs text-zinc-200">
                v1
              </span>
            </div>

            <nav className="mt-6 space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? linkActive : linkInactive}`
                  }
                  end
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>

            {/* bottom area */}
            <div className="absolute left-4 right-4 bottom-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                <p className="text-xs text-zinc-300/70">Logged in as</p>
                <p className="text-sm font-semibold">
                  {auth?.user?.name || "User"}{" "}
                  <span className="text-xs text-zinc-300/70">
                    ({auth?.user?.role})
                  </span>
                </p>
              </div>

              <button
                onClick={() => {
                  clearAuth();
                  navigate("/login");
                }}
                className="mt-3 w-full rounded-2xl border border-white/12 bg-white/5 px-3 py-2 text-sm font-semibold text-zinc-100 hover:bg-white/10"
              >
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Main area (rounded container) */}
        <div
          style={{ marginLeft: SIDEBAR_W + FRAME, paddingLeft: FRAME }}
          className="min-h-[calc(100vh-36px)]"
        >
          <div className="rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
            {/* top bar */}
            <header className="sticky top-[18px] z-20 rounded-t-[32px] border-b border-white/10 bg-zinc-950/30 backdrop-blur-xl px-6 py-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold">{title}</h1>
                  <p className="mt-1 text-sm text-zinc-200/80">
                    Welcome back. Let’s manage the gym.
                  </p>
                </div>

               <div className="flex items-center gap-2">
  <button
    onClick={() => window.location.reload()}
    className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-zinc-100 hover:bg-white/10"
  >
    Refresh
  </button>

                  <div className="relative">
                    <select
                      onChange={(e) => {
                        const v = e.target.value;
                        if (!v) return;
                        navigate(v);
                        e.target.value = "";
                      }}
                      defaultValue=""
                      className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-zinc-100 outline-none hover:bg-white/10"
                    >
                      <option value="" disabled>
                        Quick Actions
                      </option>
                      <option value="/admin/members">Go to Members</option>
                      <option value="/admin/staff">Go to Staff</option>
                      <option value="/admin/plans">Go to Plans</option>
                    </select>
                  </div>
                </div>
              </div>
            </header>

            {/* content */}
            <main className="p-6">
              {/* inner content card */}
              <div className="rounded-[24px] border border-white/10 bg-zinc-950/30 p-6">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}