import { useEffect, useMemo, useState } from "react";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  plan: "Monthly",
  status: "Active",
  expiryDate: "",
};

export default function MemberModal({ open, onClose, onSave, member }) {
  const isEdit = useMemo(() => Boolean(member?.id), [member]);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!open) return;

    if (member) {
      setForm({
        fullName: member.fullName || "",
        email: member.email || "",
        phone: member.phone || "",
        plan: member.plan || "Monthly",
        status: member.status || "Active",
        expiryDate: member.expiryDate || "",
      });
    } else {
      setForm(initialForm);
    }
  }, [open, member]);

  const update = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();

    // basic validation
    if (!form.fullName.trim()) return alert("Full name is required.");
    if (!form.email.trim()) return alert("Email is required.");
    if (!form.expiryDate.trim()) return alert("Expiry date is required.");

    onSave(form);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4">
      <div className="w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-white shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">{isEdit ? "Edit Member" : "Add Member"}</h2>
            <p className="mt-1 text-sm text-zinc-300">
              Save member details and membership status.
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
            <label className="text-sm text-zinc-300">Full name</label>
            <input
              value={form.fullName}
              onChange={update("fullName")}
              placeholder="e.g., Shenon Lekamge"
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 outline-none focus:border-zinc-400"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm text-zinc-300">Email</label>
              <input
                value={form.email}
                onChange={update("email")}
                type="email"
                placeholder="name@gmail.com"
                className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 outline-none focus:border-zinc-400"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-300">Phone</label>
              <input
                value={form.phone}
                onChange={update("phone")}
                placeholder="07X XXX XXXX"
                className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 outline-none focus:border-zinc-400"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-sm text-zinc-300">Plan</label>
              <select
                value={form.plan}
                onChange={update("plan")}
                className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 outline-none focus:border-zinc-400"
              >
                <option>Monthly</option>
                <option>Quarterly</option>
                <option>Annual</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-zinc-300">Status</label>
              <select
                value={form.status}
                onChange={update("status")}
                className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 outline-none focus:border-zinc-400"
              >
                <option>Active</option>
                <option>Frozen</option>
                <option>Expired</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-zinc-300">Expiry date</label>
              <input
                value={form.expiryDate}
                onChange={update("expiryDate")}
                type="date"
                className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 outline-none focus:border-zinc-400"
              />
            </div>
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
              {isEdit ? "Save Changes" : "Add Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}