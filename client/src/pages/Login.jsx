import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { saveAuth } from "../lib/auth";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@musclemint.com");
  const [password, setPassword] = useState("Admin1234");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Login failed");

      saveAuth(data);

      const role = data.user.role;
      if (role === "admin") navigate("/admin", { replace: true });
      else if (role === "staff") navigate("/staff", { replace: true });
      else navigate("/member", { replace: true });
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white grid place-items-center px-6">
      <div className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
        {/* Top row: Back + Home */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm font-semibold text-zinc-200 hover:bg-zinc-900"
          >
            ← Back
          </button>

          <Link
            to="/"
            className="text-sm font-semibold text-zinc-300 hover:text-white"
          >
            Back to Home
          </Link>
        </div>

        <h1 className="mt-5 text-2xl font-bold">Login</h1>
        <p className="mt-1 text-sm text-zinc-300">
          Enter your credentials. You’ll be redirected based on your role.
        </p>

        {error && (
          <div className="mt-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-zinc-300">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 outline-none focus:border-zinc-400"
            />
          </div>

          <div>
            <label className="text-sm text-zinc-300">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              className="mt-2 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2.5 outline-none focus:border-zinc-400"
            />
          </div>

          <button
            disabled={loading}
            className="w-full rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-zinc-200 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}