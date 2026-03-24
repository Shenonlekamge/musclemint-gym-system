import { useState } from "react";
import PublicNavbar from "../components/PublicNavbar.jsx";

export default function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.14),transparent_55%)]" />
      <div className="relative mx-auto max-w-6xl px-6 py-12">
        <PublicNavbar />

        <div className="mt-10 rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <h1 className="text-3xl font-extrabold">Contact Us</h1>
          <p className="mt-3 text-zinc-300">
            Send us a message. (For now this is a UI demo — later we can connect email/API.)
          </p>

          {sent ? (
            <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-200">
              Message sent ✅ We’ll get back to you soon.
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="mt-6 grid gap-4 sm:grid-cols-2"
            >
              <div className="sm:col-span-1">
                <label className="text-sm text-zinc-300">Name</label>
                <input
                  required
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950/30 px-4 py-3 outline-none focus:border-white/25"
                  placeholder="Your name"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="text-sm text-zinc-300">Email</label>
                <input
                  required
                  type="email"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950/30 px-4 py-3 outline-none focus:border-white/25"
                  placeholder="you@email.com"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-sm text-zinc-300">Message</label>
                <textarea
                  required
                  rows={5}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-zinc-950/30 px-4 py-3 outline-none focus:border-white/25"
                  placeholder="Write your message..."
                />
              </div>

              <div className="sm:col-span-2 flex justify-end">
                <button className="rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-zinc-950 hover:bg-emerald-400">
                  Send Message
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}