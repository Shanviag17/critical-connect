import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { createMission } from "../api/missions";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

export default function RescueDashboard() {
  const navigate = useNavigate();
 useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/");
      }
    });
    return () => unsub();
  }, []);
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // logout
  const logout = () => {
    localStorage.removeItem("role");
    navigate("/");
  };

  // CREATE MISSION (IMPROVED + UNIQUE)
  const handleCreateMission = async () => {
    try {
      const disasters = ["Flood", "Fire", "Earthquake", "Accident", "Landslide"];
      const cities = ["Bihar", "Patna", "Gaya", "Purnea", "Darbhanga"];

      const disaster = disasters[Math.floor(Math.random() * disasters.length)];
      const city = cities[Math.floor(Math.random() * cities.length)];

      await createMission({
        title: `${disaster} Rescue - ${city} - ${Date.now()}`,
        status: "Active",
        team: `Team-${Math.floor(Math.random() * 5) + 1}`,
        people: Math.floor(Math.random() * 300),
        location: city,
        createdAt: new Date().toISOString(),
      });

      alert("Mission Created!");
    } catch (error) {
      console.error("Create mission error:", error);
      alert("Error creating mission");
    }
  };

  // DELETE MISSION
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "missions", id));
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting mission");
    }
  };

  // LIVE FIRESTORE
  useEffect(() => {
    setLoading(true);

    const unsub = onSnapshot(
      collection(db, "missions"),
      (snap) => {
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setMissions(data);
        setLoading(false);
      },
      (error) => {
        console.error("Firestore error:", error);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  // STATS
  const stats = useMemo(() => {
    return {
      total: missions.length,
      active: missions.filter((m) => m.status === "Active").length,
      pending: missions.filter((m) => m.status === "Pending").length,
      people: missions.reduce((acc, m) => acc + Number(m.people || 0), 0),
    };
  }, [missions]);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">
            Rescue Command Center 🚑
          </h1>
          <p className="text-gray-400 mt-1">
            Live emergency mission tracking
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCreateMission}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl"
          >
            + Create Mission
          </button>

          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl"
          >
            Logout
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">

        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
          <p className="text-gray-400">Total Missions</p>
          <h2 className="text-3xl text-blue-400 font-bold">{stats.total}</h2>
        </div>

        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
          <p className="text-gray-400">Active</p>
          <h2 className="text-3xl text-green-400 font-bold">{stats.active}</h2>
        </div>

        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
          <p className="text-gray-400">Pending</p>
          <h2 className="text-3xl text-yellow-400 font-bold">{stats.pending}</h2>
        </div>

        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
          <p className="text-gray-400">People Affected</p>
          <h2 className="text-3xl text-purple-400 font-bold">
            {stats.people}
          </h2>
        </div>

      </div>

      {/* LIVE LIST */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">

        <h2 className="text-xl font-semibold mb-4">
          📡 Live Missions Feed
        </h2>

        {loading ? (
          <p className="text-gray-400">Loading live data...</p>
        ) : missions.length === 0 ? (
          <p className="text-gray-500">
            No missions found. Create one to start tracking.
          </p>
        ) : (
          <div className="space-y-3">

            {missions.map((m) => (
              <div
                key={m.id}
                className="bg-slate-950 border border-slate-800 p-4 rounded-xl"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{m.title}</h3>

                  <div className="flex gap-2 items-center">
                    <span className="text-sm text-gray-400">
                      {m.status || "Pending"}
                    </span>

                    {/* DELETE BUTTON */}
                    <button
                      onClick={() => handleDelete(m.id)}
                      className="text-red-400 hover:text-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <p className="text-gray-400 text-sm mt-1">
                  📍 Team: {m.team}
                </p>

                <p className="text-green-400 text-sm">
                  👥 People: {m.people || 0}
                </p>

                <p className="text-gray-500 text-xs mt-1">
                  📌 {m.location}
                </p>
              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}