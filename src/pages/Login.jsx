import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const roles = [
    {
      id: "admin",
      title: "Admin Command",
      subtitle: "Central control for reports, teams & resources",
      icon: "🛡️",
      active: "border-red-500 bg-red-500/15 shadow-red-500/20",
      text: "text-red-400",
    },
    {
      id: "rescue",
      title: "Rescue Ops",
      subtitle: "Track missions and coordinate field response",
      icon: "🚑",
      active: "border-green-500 bg-green-500/15 shadow-green-500/20",
      text: "text-green-400",
    },
    {
      id: "public",
      title: "Citizen Portal",
      subtitle: "Report incidents and request urgent help",
      icon: "👥",
      active: "border-blue-500 bg-blue-500/15 shadow-blue-500/20",
      text: "text-blue-400",
    },
  ];

  const alerts = [
    "Flood alert reported near Patna",
    "Team Alpha assigned to high priority zone",
    "Medical resources requested",
    "Critical report awaiting review",
  ];

  const login = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);

      if (role === "admin") navigate("/admin");
      else if (role === "rescue") navigate("/rescue");
      else navigate("/public");
    } catch (err) {
      alert(err.code);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(220,38,38,0.25),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(34,197,94,0.18),transparent_30%),radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.12),transparent_35%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:56px_56px]" />

      {/* Radar Circles */}
      <div className="absolute left-[-120px] top-24 h-80 w-80 rounded-full border border-red-500/20 animate-pulse" />
      <div className="absolute left-[-70px] top-36 h-56 w-56 rounded-full border border-red-500/30 animate-pulse" />
      <div className="absolute right-[-100px] bottom-20 h-72 w-72 rounded-full border border-green-500/20 animate-pulse" />

      <div className="relative z-10 grid min-h-screen grid-cols-1 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Left Section */}
        <section className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-20">
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-200">
            <span className="h-2 w-2 rounded-full bg-red-500 shadow-lg shadow-red-500/80 animate-ping" />
            Live Disaster Response Network
          </div>

          <h1 className="max-w-3xl text-5xl font-black leading-none tracking-tight sm:text-6xl lg:text-8xl">
            Critical
            <span className="block bg-gradient-to-r from-red-500 via-orange-400 to-green-400 bg-clip-text text-transparent">
              Connect
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            A real-time emergency coordination platform that connects citizens,
            rescue teams, and administrators to report incidents, assign teams,
            track missions, and respond faster when every second matters.
          </p>

          {/* Stats */}
          <div className="mt-10 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-xl">
              <p className="text-4xl font-black text-red-400">12+</p>
              <p className="mt-1 text-sm text-slate-400">Active Reports</p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-xl">
              <p className="text-4xl font-black text-green-400">87</p>
              <p className="mt-1 text-sm text-slate-400">Rescue Teams</p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-xl">
              <p className="text-4xl font-black text-blue-400">Live</p>
              <p className="mt-1 text-sm text-slate-400">Firestore Sync</p>
            </div>
          </div>

          {/* Alert Feed */}
          <div className="mt-8 max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold">Live Emergency Feed</h3>
              <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-400">
                ONLINE
              </span>
            </div>

            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-300"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/10 text-red-400">
                    {index % 2 === 0 ? "🚨" : "📡"}
                  </span>
                  <span>{alert}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right Login Panel */}
        <section className="flex items-center justify-center px-5 py-10 lg:px-12">
          <div className="w-full max-w-md rounded-[2rem] border border-slate-700 bg-slate-900/85 p-6 shadow-2xl shadow-black/50 backdrop-blur-2xl">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/10 text-3xl shadow-lg shadow-red-500/20">
                🚨
              </div>
              <h2 className="text-3xl font-black">Secure Access</h2>
              <p className="mt-1 text-sm text-slate-400">
                Choose your role and enter the command system
              </p>
            </div>

            {/* Role Cards */}
            <div className="mb-5 space-y-3">
              {roles.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setRole(item.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-slate-500 ${
                    role === item.id
                      ? `${item.active} shadow-xl`
                      : "border-slate-800 bg-slate-950/70"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{item.icon}</span>
                    <div>
                      <p className={`font-bold ${role === item.id ? item.text : ""}`}>
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-400">{item.subtitle}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && login()}
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-300">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && login()}
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                  placeholder="Enter password"
                />
              </div>

              <button
                onClick={login}
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 py-3.5 font-bold text-white shadow-xl shadow-green-900/30 transition hover:scale-[1.02] hover:from-green-500 hover:to-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Authenticating..." : "Enter Command Center"}
              </button>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-center text-xs text-slate-500">
              Secure Firebase Authentication • Role-Based Access • Real-Time
              Emergency Coordination
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}