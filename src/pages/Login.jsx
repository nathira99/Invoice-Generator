import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { ShieldCheck, LockKeyhole } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

import { getDeviceId } from "../utils/device";

function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const deviceId = getDeviceId();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await login(email, password, deviceId, navigator.userAgent);

      navigate("/");
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* LEFT SIDE */}

      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900 lg:flex">
        {/* BACKGROUND EFFECT */}

        <div className="absolute inset-0 opacity-20">
          <div className="absolute left-10 top-10 h-72 w-72 rounded-full bg-white blur-3xl" />

          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-blue-400 blur-3xl" />
        </div>

        {/* CONTENT */}

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* TOP */}

          <div>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/10 backdrop-blur">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="h-14 w-14 object-contain"
                />
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Ilmul Jannah
                </h1>

                <p className="mt-1 text-sm text-blue-100">
                  Institute Management System
                </p>
              </div>
            </div>

            <div className="mt-20 max-w-md">
              <h2 className="text-5xl font-bold leading-tight">
                Manage your institute professionally
              </h2>

              <p className="mt-6 text-lg leading-relaxed text-blue-100">
                Securely manage students, invoices, teachers, staff, and courses
                in one modern dashboard.
              </p>
            </div>
          </div>

          {/* BOTTOM */}

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-4 backdrop-blur">
              <ShieldCheck size={22} />

              <div>
                <p className="text-sm font-semibold">Secure Access</p>

                <p className="text-xs text-blue-100">Protected admin system</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-5 py-4 backdrop-blur">
              <LockKeyhole size={22} />

              <div>
                <p className="text-sm font-semibold">JWT Authentication</p>

                <p className="text-xs text-blue-100">Role-based access</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}

      <div className="flex flex-1 items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* MOBILE BRAND */}

          <div className="mb-10 text-center lg:hidden">
            <img
              src="/logo.png"
              alt="Logo"
              className="mx-auto h-20 w-20 object-contain"
            />

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-950">
              Ilmul Jannah
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Institute Management System
            </p>
          </div>

          {/* CARD */}

          <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60">
            {/* HEADER */}

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                Welcome Back
              </p>

              <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-950">
                Admin Login
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                Login to access your institute dashboard securely.
              </p>
            </div>

            {/* FORM */}

            <form onSubmit={handleLogin} className="mt-8 space-y-5">
              {/* EMAIL */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium text-slate-800 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* PASSWORD */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Password
                </label>

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium text-slate-800 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              {/* BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="mt-3 flex w-full items-center justify-center rounded-2xl bg-blue-600 py-3.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200"
              >
                {loading ? "Signing in..." : "Login to Dashboard"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
