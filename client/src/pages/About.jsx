import PublicNavbar from "../components/PublicNavbar.jsx";

export default function About() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.14),transparent_55%)]" />
      <div className="relative mx-auto max-w-6xl px-6 py-12">
        <PublicNavbar />

        <div className="mt-10 rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <h1 className="text-3xl font-extrabold">About MuscleMint</h1>
          <p className="mt-4 max-w-3xl text-zinc-300">
            MuscleMint is a modern gym management system designed to streamline day-to-day operations.
            It supports role-based access for Admins, Staff, and Members — enabling membership plan
            management, attendance tracking, and scalable reporting.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { k: "Secure", v: "JWT authentication + role-based access" },
              { k: "Reliable", v: "MongoDB Atlas persistence" },
              { k: "Modern UI", v: "React + Tailwind interface" },
            ].map((x) => (
              <div key={x.k} className="rounded-2xl border border-white/10 bg-zinc-950/30 p-5">
                <p className="text-sm font-semibold">{x.k}</p>
                <p className="mt-1 text-sm text-zinc-300">{x.v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}