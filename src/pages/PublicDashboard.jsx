import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

const cityCoords = {
  Patna: { lat: 25.5941, lng: 85.1376 },
  Delhi: { lat: 28.6139, lng: 77.209 },
  Mumbai: { lat: 19.076, lng: 72.8777 },
  Kolkata: { lat: 22.5726, lng: 88.3639 },
  Chennai: { lat: 13.0827, lng: 80.2707 },
  Bengaluru: { lat: 12.9716, lng: 77.5946 },
};

export default function PublicDashboard() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    disaster: "",
    location: "",
    people: "",
    description: "",
    severity: "Medium",
  });

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem("role");
    navigate("/");
  };

  // 🔴 LIVE FIRESTORE LISTENER (FIXED)
  useEffect(() => {
    const q = query(
      collection(db, "reports"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        console.log("📡 Live reports:", data);

        setReports(data);
        setLoading(false);
      },
      (err) => {
        console.error("Live error:", err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  // 📊 LIVE STATS
  const stats = useMemo(() => {
    return {
      total: reports.length,
      pending: reports.filter((r) => r.status === "Pending").length,
      critical: reports.filter((r) => r.severity === "Critical").length,
    };
  }, [reports]);

  // 🚨 SUBMIT REPORT
  const handleSubmit = async () => {
    if (!form.disaster || !form.location) {
      alert("Please fill required fields");
      return;
    }

    const loc =
      form.location.trim().charAt(0).toUpperCase() +
      form.location.trim().slice(1).toLowerCase();

    const coords = cityCoords[loc];

    await addDoc(collection(db, "reports"), {
      ...form,
      location: loc,
      lat: coords?.lat || 20.5937,
      lng: coords?.lng || 78.9629,
      status: "Pending",
      createdAt: serverTimestamp(), // 🔥 IMPORTANT FIX
    });

    setForm({
      disaster: "",
      location: "",
      people: "",
      description: "",
      severity: "Medium",
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto p-6 md:p-10">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">

          <div>
            <h1 className="text-4xl font-bold">
              Citizen Emergency Portal
            </h1>
            <p className="text-gray-400 mt-2">
              Live disaster reporting system — updates instantly
            </p>

            {/* LIVE DOT */}
            <div className="flex items-center gap-2 text-green-400 text-sm mt-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative h-3 w-3 rounded-full bg-green-500"></span>
              </span>
              Live updates ON
            </div>
          </div>

          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl"
          >
            Logout
          </button>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <p className="text-gray-400">Total Reports</p>
            <h2 className="text-4xl text-blue-400 font-bold">
              {stats.total}
            </h2>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <p className="text-gray-400">Pending Help</p>
            <h2 className="text-4xl text-yellow-300 font-bold">
              {stats.pending}
            </h2>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
            <p className="text-gray-400">Critical Cases</p>
            <h2 className="text-4xl text-red-400 font-bold">
              {stats.critical}
            </h2>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* FORM */}
          <div className="md:col-span-2 bg-slate-900 p-6 rounded-2xl border border-slate-800">

            <h2 className="text-2xl font-semibold mb-4">
              🚨 Report Emergency
            </h2>

            <div className="space-y-3">

              <input
                value={form.disaster}
                onChange={(e) =>
                  setForm({ ...form, disaster: e.target.value })
                }
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl"
                placeholder="What happened?"
              />

              <input
                value={form.location}
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl"
                placeholder="Location"
              />

              <select
                value={form.severity}
                onChange={(e) =>
                  setForm({ ...form, severity: e.target.value })
                }
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>

              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl"
                placeholder="Extra details (optional)"
                rows="4"
              />

              <button
                onClick={handleSubmit}
                className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-xl font-semibold"
              >
                Send Report
              </button>

            </div>
          </div>

          {/* LIVE FEED */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">

            <h2 className="text-xl font-semibold mb-4">
              📡 Live Incidents
            </h2>

            {loading ? (
              <p className="text-gray-500">Connecting to live feed...</p>
            ) : reports.length === 0 ? (
              <p className="text-gray-500">No incidents reported yet</p>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">

                {reports.map((r) => (
                  <div
                    key={r.id}
                    className="bg-slate-950 border border-slate-800 p-3 rounded-xl"
                  >
                    <div className="flex justify-between">
                      <span className="font-semibold">{r.disaster}</span>
                      <span className="text-xs text-gray-400">
                        {r.severity}
                      </span>
                    </div>

                    <p className="text-gray-400 text-sm">
                      📍 {r.location}
                    </p>

                    <p className="text-xs text-gray-500">
                      Status: {r.status}
                    </p>
                  </div>
                ))}

              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}