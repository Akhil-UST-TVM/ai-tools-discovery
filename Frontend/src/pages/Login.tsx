import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const user = await login({ username: id, password });
      navigate(user.role === "admin" ? "/admin" : "/", { replace: true });
    } catch (error: any) {
      setErr(error?.message ?? "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center">
      <div className="w-full max-w-6xl mx-4 md:mx-0 rounded-lg overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row min-h-[70vh]">
          {/* Left Half */}
          <div
            className="flex-1 flex items-center justify-center p-10 text-center text-white animate-slide-in-left"
            style={{
              background: "linear-gradient(135deg,#008080,#004d4d)",
            }}
            aria-hidden="true"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-heading">
                AI Tools
              </h2>
              <p className="text-sm md:text-base text-white/90 max-w-md mx-auto">
                Explore and choose from expertly curated AI tools. Designed for
                teams that value productivity and trust.
              </p>
            </div>
          </div>

          {/* Right Half - Login Form */}
          <div className="flex-1 flex items-center justify-center p-8 md:p-12 bg-black animate-slide-in-right">
            <div className="w-full max-w-md">
              <h3 className="text-2xl font-semibold text-white mb-2">Sign in</h3>
              <p className="text-sm text-white/70 mb-6">Enter your credentials to continue</p>

              <form onSubmit={submit} className="space-y-4" aria-label="Login form">
                <div>
                  <label htmlFor="username" className="text-sm text-white/80 block mb-2">
                    Username or email
                  </label>
                  <input
                    id="username"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    className="w-full px-4 py-3 rounded-md bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-400"
                    placeholder="you@company.com"
                    required
                    aria-required="true"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="text-sm text-white/80 block mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-md bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-400"
                    placeholder="••••••••"
                    required
                    aria-required="true"
                  />
                </div>

                {err && <div className="text-rose-400 text-sm">{err}</div>}

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-md text-white font-medium btn-teal focus:outline-none focus:ring-2 focus:ring-teal-300"
                  >
                    {loading ? "Signing in..." : "Sign in"}
                  </button>
                </div>
              </form>

              <p className="mt-6 text-xs text-white/60">
                Don't have an account? <a href="/signup" className="text-teal-300 underline">Sign up</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
