import { useEffect, useMemo, useState } from "react";

const initialForm = {
  name: "",
  priceLKR: "",
  durationDays: "",
  category: "individual",
  isActive: true,
  description: "",
};

export default function PlanModal({ open, onClose, onSave, plan }) {
  const isEdit = useMemo(() => Boolean(plan?._id), [plan]);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!open) return;

    if (plan) {
      setForm({
        name: plan.name || "",
        priceLKR: String(plan.priceLKR ?? ""),
        durationDays: String(plan.durationDays ?? ""),
        category: plan.category || "individual",
        isActive: Boolean(plan.isActive),
        description: plan.description || "",
      });
    } else {
      setForm(initialForm);
    }
  }, [open, plan]);

  const update = (key) => (e) => {
    const value =
      key === "isActive" ? e.target.checked : e.target.value;
    setForm((p) => ({ ...p, [key]: value }));
  };

  const submit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) return alert("Plan name is required");
    if (form.priceLKR === "" || Number.isNaN(Number(form.priceLKR)))
      return alert("Price (LKR) is required");
    if (form.durationDays === "" || Number.isNaN(Number(form.durationDays)))
      return alert("Duration days is required");

    const payload = {
      name: form.name.trim(),
      priceLKR: Number(form.priceLKR),
      durationDays: Number(form.durationDays),
      category: form.category,
      isActive: Boolean(form.isActive),
      description: form.description.trim(),
    };

    onSave(payload);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 px-4">
      <div className="w-full max-w-xl rounded-3xl border border-zinc-800 bg-zinc-950 p-6 text-white shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">{isEdit ? "Edit Plan" : "Add Plan"}</h2>
            <p className="mt-1 text-sm text-zinc-300">
              Create membership plans with duration and pricing.
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
            <label className="text-sm text-zinc-300">Plan name</label>
            <input
              value={form.name}
              onChange={update("name")}
              placeholder="e.g., Monthly / Couple Annual"
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 outline-none focus:border-zinc-400"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-sm text-zinc-300">Price (LKR)</label>
              <input
                value={form.priceLKR}
                onChange={update("priceLKR")}
                type="number"
                min="0"
                placeholder="e.g., 8000"
                className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 outline-none focus:border-zinc-400"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-300">Duration (days)</label>
              <input
                value={form.durationDays}
                onChange={update("durationDays")}
                type="number"
                min="1"
                placeholder="e.g., 30"
                className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 outline-none focus:border-zinc-400"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-300">Category</label>
              <select
                value={form.category}
                onChange={update("category")}
                className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 outline-none focus:border-zinc-400"
              >
                <option value="individual">Individual</option>
                <option value="couple">Couple</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm text-zinc-300">Description (optional)</label>
            <textarea
              value={form.description}
              onChange={update("description")}
              rows={3}
              placeholder="Short description..."
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 outline-none focus:border-zinc-400"
            />
          </div>

          <label className="flex items-center gap-3 text-sm text-zinc-200">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={update("isActive")}
              className="h-4 w-4"
            />
            Active plan
          </label>

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
              {isEdit ? "Save Changes" : "Add Plan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}