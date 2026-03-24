import PublicNavbar from "../components/PublicNavbar.jsx";
import { Link } from "react-router-dom";
import hero from "../assets/hero.jpg";

function SectionTitle({ overline, title, desc }) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-semibold tracking-[0.2em] text-emerald-300/90">
        {overline}
      </p>
      <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-zinc-300">{desc}</p>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <PublicNavbar />

      {/* HOME / HERO */}
      <section
        id="home"
        className="relative min-h-screen bg-cover bg-center pt-28"
        style={{ backgroundImage: `url(${hero})` }}
      >
        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.22),transparent_60%)]" />

        <div className="relative w-full px-4 sm:px-6 pb-14">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold tracking-[0.2em] text-emerald-300/90">
              MUSCLEMINT GYM SYSTEM
            </p>

            <h1 className="mt-3 text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl">
              OBTAIN YOUR{" "}
              <span className="text-emerald-400">FITNESS</span> GOAL
            </h1>

            <p className="mt-5 max-w-xl text-zinc-200">
              A modern platform to manage members, plans, staff & attendance
              with secure role-based dashboards.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/login"
                className="rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-zinc-950 hover:bg-emerald-400"
              >
                GET STARTED
              </Link>

              <a
                href="#classes"
                className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/10"
              >
                VIEW CLASSES
              </a>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                { t: "Admin Panel", d: "Members • Plans • Staff" },
                { t: "Staff Tools", d: "Check-ins • Attendance" },
                { t: "Secure Login", d: "JWT Role-Based Access" },
              ].map((x) => (
                <div
                  key={x.t}
                  className="rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur"
                >
                  <p className="font-bold">{x.t}</p>
                  <p className="mt-1 text-sm text-zinc-200/80">{x.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-zinc-950 to-transparent" />
      </section>

      {/* CLASSES */}
      <section id="classes" className="w-full px-4 sm:px-6 py-16">
        <SectionTitle
          overline="CLASSES"
          title="Train with structure"
          desc="From strength training to cardio sessions — schedule classes and track attendance with ease."
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { t: "Strength Training", d: "Build muscle with guided sessions." },
            { t: "HIIT Cardio", d: "High intensity training for fat loss." },
            { t: "Functional Fitness", d: "Mobility, balance and endurance." },
          ].map((x) => (
            <div key={x.t} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="font-bold">{x.t}</p>
              <p className="mt-2 text-sm text-zinc-300">{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="w-full px-4 sm:px-6 py-16 bg-zinc-950">
        <SectionTitle
          overline="SERVICES"
          title="Memberships and coaching"
          desc="Offer different plans, personal training packages, and manage everything from one dashboard."
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { t: "Membership Plans", d: "Monthly / 3 Months / Annual + Couple Plans." },
            { t: "Personal Training", d: "Schedule trainer sessions and manage clients." },
            { t: "Attendance Tracking", d: "Staff check-ins and daily attendance logs." },
          ].map((x) => (
            <div key={x.t} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="font-bold">{x.t}</p>
              <p className="mt-2 text-sm text-zinc-300">{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="w-full px-4 sm:px-6 py-16">
        <SectionTitle
          overline="ABOUT"
          title="Why MuscleMint?"
          desc="Built as a modern, secure and scalable system for gyms to manage operations with less manual work."
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { t: "Secure", d: "JWT authentication + role-based permissions." },
            { t: "Reliable", d: "MongoDB Atlas persistence." },
            { t: "Modern UI", d: "React + Tailwind, responsive design." },
          ].map((x) => (
            <div key={x.t} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="font-bold">{x.t}</p>
              <p className="mt-2 text-sm text-zinc-300">{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BLOG */}
      <section id="blog" className="w-full px-4 sm:px-6 py-16 bg-zinc-950">
        <SectionTitle
          overline="BLOG"
          title="Fitness tips & updates"
          desc="A simple blog section to share announcements and tips. (We can connect real blog CRUD later.)"
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            { t: "How to stay consistent", d: "Small habits that keep you training." },
            { t: "Beginner strength routine", d: "A simple weekly plan for starters." },
            { t: "Nutrition basics", d: "Fuel your workouts the right way." },
          ].map((x) => (
            <div key={x.t} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="font-bold">{x.t}</p>
              <p className="mt-2 text-sm text-zinc-300">{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="w-full px-4 sm:px-6 py-16">
        <SectionTitle
          overline="CONTACT"
          title="Join MuscleMint today"
          desc="Send a message to join or ask about memberships. (UI demo — we can connect backend later.)"
        />

        <div className="mt-8 max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Message sent ✅");
            }}
            className="grid gap-4 sm:grid-cols-2"
          >
            <div>
              <label className="text-sm text-zinc-300">Name</label>
              <input
                required
                className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-950/40 px-4 py-3 outline-none focus:border-white/25"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-300">Email</label>
              <input
                required
                type="email"
                className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-950/40 px-4 py-3 outline-none focus:border-white/25"
                placeholder="you@email.com"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm text-zinc-300">Message</label>
              <textarea
                required
                rows={5}
                className="mt-2 w-full rounded-xl border border-white/10 bg-zinc-950/40 px-4 py-3 outline-none focus:border-white/25"
                placeholder="Write your message..."
              />
            </div>

            <div className="sm:col-span-2 flex justify-end">
              <button className="rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-zinc-950 hover:bg-emerald-400">
                SEND MESSAGE
              </button>
            </div>
          </form>
        </div>

        <div className="mt-12 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} MuscleMint — built with React + Node + MongoDB.
        </div>
      </section>
    </div>
  );
}