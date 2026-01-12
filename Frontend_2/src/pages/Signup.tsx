import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Header } from "@/components/layout/Header";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await signup({ username, password, role });
      navigate(role === "admin" ? "/admin" : "/", { replace: true });
    } catch (error: any) {
      setErr(error?.message ?? "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-sky-800">
      <Header />
      <div className="flex items-center justify-center p-6">
        <div className="relative w-full max-w-3xl">
          <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 shadow-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-300 to-pink-500 rounded-lg flex items-center justify-center text-xl font-bold">
                AI
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-white">Create an account</h1>
                <p className="text-sm text-slate-200/80">Sign up with a role to continue</p>
              </div>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="text-sm text-slate-200">Username</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full mt-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  placeholder="Enter username"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-slate-200">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
                  placeholder="Enter password"
                  required
                />
              </div>

              <div>
                <label className="text-sm text-slate-200">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as "admin" | "user")}
                  className="w-full mt-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {err && <div className="text-rose-400 text-sm">{err}</div>}

              <div className="flex items-center justify-between gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-sky-500 to-indigo-500 text-white font-medium px-4 py-2 rounded-lg shadow hover:scale-[1.01] transition-transform"
                >
                  {loading ? "Signing up..." : "Sign up"}
                </button>
              </div>
            </form>
            <p className="mt-6 text-xs text-slate-300/80">
              Demo: This will create a user in the backend database used by the local FastAPI server.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
