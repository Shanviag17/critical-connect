import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("public");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const login = async () => {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white px-4">

      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-5">

        {/* HEADER */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold">Critical Connect</h1>
          <p className="text-slate-400 text-sm">Disaster Response Portal Login</p>
        </div>

        {/* ROLE SELECT */}
        <div>
          <label className="text-sm text-slate-300">Select Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full mt-1 p-3 bg-slate-800 border border-slate-700 rounded-lg outline-none focus:border-green-500"
          >
            <option value="admin">Admin Command Center</option>
            <option value="rescue">Rescue Team</option>
            <option value="public">Citizen Portal</option>
          </select>
        </div>

        {/* EMAIL */}
        <div>
          <label className="text-sm text-slate-300">Email</label>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 p-3 bg-slate-800 border border-slate-700 rounded-lg outline-none focus:border-green-500"
            placeholder="Enter email"
          />
        </div>

        {/* PASSWORD */}
        <div>
          <label className="text-sm text-slate-300">Password</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 p-3 bg-slate-800 border border-slate-700 rounded-lg outline-none focus:border-green-500"
            placeholder="Enter password"
          />
        </div>

        {/* BUTTON */}
        <button
          onClick={login}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-500 transition py-3 rounded-lg font-semibold shadow-lg"
        >
          {loading ? "Authenticating..." : "Login"}
        </button>

        {/* FOOTER */}
        <p className="text-xs text-center text-slate-500">
          Secure access • Critical Response System
        </p>

      </div>
    </div>
  );
}