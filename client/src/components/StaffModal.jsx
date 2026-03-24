import { useEffect, useState } from "react";

const initialForm = { name: "", email: "", password: "" };

export default function StaffModal({ open, onClose, onSave }) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (open) setForm(initialForm);
  }, [open]);

  const update = (key) => (e) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return alert("Name is required");
    if (!form.email.trim()) return alert("Email is required");
    if (form.password.length < 6) return alert("Password must be at least 6 characters");
    onSave(form);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4">
      <div className="w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-white shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Add Staff</h2>
            <p className="mt-1 text-sm text-zinc-300">
              Admin creates staff accounts. Staff can log in using these credentials.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-semibold hover:bg-zinc-800"
          >
            ✕
          </button>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-zinc-300">Name</label>
            <input
              value={form.name}
              onChange={update("name")}
              placeholder="e.g., Staff Member"
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 outline-none focus:border-zinc-400"
            />
          </div>

          <div>
            <label className="text-sm text-zinc-300">Email</label>
            <input
              value={form.email}
              onChange={update("email")}
              type="email"
              placeholder="staff@MuscleMint.com"
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 outline-none focus:border-zinc-400"
            />
          </div>

          <div>
            <label className="text-sm text-zinc-300">Temporary Password</label>
            <input
              value={form.password}
              onChange={update("password")}
              type="password"
              placeholder="Min 6 characters"
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 outline-none focus:border-zinc-400"
            />
            <p className="mt-2 text-xs text-zinc-400">
              (Later we can add “Reset password” feature.)
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm font-semibold hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-emerald-400"
            >
              Create Staff
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}