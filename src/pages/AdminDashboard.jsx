import { useNavigate } from "react-router-dom";

import StatCard from "../components/StatCard";
import AIPanel from "../components/AIPanel";
import DisasterMap from "../components/DisasterMap";
import AnalyticsChart from "../components/AnalyticsChart";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
const [selectedTeam, setSelectedTeam] = useState({});
const [searchTerm, setSearchTerm] = useState("");
const [severityFilter, setSeverityFilter] = useState("All");
const teams = ["Team Alpha", "Team Bravo", "Team Delta", "Team Omega"];
const assignTeam = async (reportId, team) => {
  if (!team) {
    alert("Select a team first");
    return;
  }

  try {
    await updateDoc(
      doc(db, "reports", reportId),
      {
        team: team,
        status: "Assigned",
      }
    );

    alert("🚑 Team Assigned Successfully");
  } catch (error) {
    console.error(error);
    alert("Failed to assign team");
  }
};
const updateStatus = async (reportId, status) => {
  try {
    await updateDoc(
      doc(db, "reports", reportId),
      {
        status,
      }
    );
  } catch (error) {
    console.error(error);
  }
};
useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, "reports"), (snapshot) => {
    const reportsData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setReports(reportsData);
  });

  return () => unsubscribe();
}, []);
  const logout = () => {
    localStorage.removeItem("role");
    navigate("/");
  };
const activeDisasters = reports.length;

const affectedPeople = reports.reduce(
  (sum, report) => sum + Number(report.people || 0),
  0
);
const pendingCases = reports.filter(
  (report) => report.status === "Pending" || !report.status
).length;

const activeOperations = reports.filter(
  (report) =>
    report.status === "Assigned" ||
    report.status === "In Progress"
).length;

const resolvedCases = reports.filter(
  (report) => report.status === "Resolved"
).length;
const filteredReports = reports.filter((report) => {
  const matchesSearch =
  report.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  report.disaster?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  report.description?.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesSeverity =
    severityFilter === "All" ||
    report.severity === severityFilter;

  return matchesSearch && matchesSeverity;
});
const highSeverityCases = reports.filter(
  (report) =>
    report.severity === "High" ||
    report.severity === "Critical"
).length;
const assignedTeams = reports.filter(
  (report) => report.team
).length;
 const stats = [
  {
    title: "Active Disasters",
    value: activeDisasters,
    color: "text-red-500",
  },
  {
    title: "Affected People",
    value: affectedPeople,
    color: "text-yellow-500",
  },
  {
  title: "Rescue Teams",
  value: assignedTeams,
  color: "text-green-500",
},
{
  title: "High Alerts",
  value: highSeverityCases,
  color: "text-blue-500",
},
];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white flex">

      {/* Sidebar */}
<aside className="w-72 bg-slate-900/90 backdrop-blur-md border-r border-slate-800 p-6">

  <div className="mb-10">
    <h1 className="text-3xl font-extrabold">
      Critical <span className="text-red-500">Connect</span>
    </h1>

    <p className="text-gray-500 text-sm mt-1">
      Emergency Response Platform
    </p>
  </div>

  <nav className="space-y-3">

    {[
      "Dashboard",
      "Disasters",
      "Resources",
      "Map View",
      "Alerts",
      "Analytics",
      "AI Center",
      "Settings",
    ].map((item) => (
      <div
        key={item}
        className={`p-3 rounded-xl cursor-pointer transition-all ${
          item === "Dashboard"
            ? "bg-gradient-to-r from-red-600 to-red-500 font-semibold shadow-lg shadow-red-500/20"
            : "hover:bg-slate-800 hover:translate-x-1 text-gray-300"
        }`}
      >
        {item}
      </div>
    ))}

  </nav>

  <div className="mt-10 bg-slate-800 rounded-2xl p-4 border border-slate-700">

    <h4 className="font-semibold mb-3">
      🚨 System Status
    </h4>

    <div className="space-y-2 text-sm">

      <div className="flex justify-between">
        <span>Server</span>
        <span className="text-green-400">🟢 Online</span>
      </div>

      <div className="flex justify-between">
        <span>AI Engine</span>
        <span className="text-green-400">🟢 Active</span>
      </div>

      <div className="flex justify-between">
        <span>Emergency Feed</span>
        <span className="text-yellow-400">🟡 Monitoring</span>
      </div>

    </div>

  </div>

</aside>

      {/* Main */}
      <main className="flex-1 p-8">

       {/* Hero Banner */}
<div className="mb-8 rounded-3xl bg-gradient-to-r from-red-600 via-red-500 to-orange-500 p-8 shadow-2xl">

  <div className="flex justify-between items-center">

    <div>
      <h1 className="text-4xl font-extrabold">
        Critical Connect Command Center
      </h1>

      <p className="mt-2 text-red-100">
        Real-time disaster monitoring and emergency response management
      </p>
    </div>

    <div className="flex gap-3">

      <button className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl">
        🔔 5
      </button>

      <button className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl">
        👤 Admin
      </button>
      <div className="bg-green-500/20 text-green-400 px-3 py-2 rounded-xl text-sm">
  ● System Active
</div>

      <button
        onClick={logout}
        className="bg-red-900 hover:bg-black/30 px-4 py-2 rounded-xl transition"
      >
        Logout
      </button>

    </div>

  </div>

</div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {stats.map((card) => (
            <StatCard
              key={card.title}
              title={card.title}
              value={card.value}
              color={card.color}
            />
          ))}
        </div>

        {/* Map + AI */}
        <div className="grid grid-cols-3 gap-6 mb-8">

          <div className="xl:col-span-2">
            <DisasterMap reports={reports} />
          </div>

          <AIPanel reports={reports} />

        </div>

        {/* Analytics */}
        
        <div className="mb-8">
          <AnalyticsChart reports={reports} />
        </div>

        {/* Bottom */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

{/* Citizen Reports */}

<div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">

  <div className="flex justify-between items-center mb-4">

  <h3 className="text-xl font-bold">
    🚨 Citizen Reports ({filteredReports.length})
  </h3>

  <div className="flex gap-2">

  <input
  type="text"
  placeholder="Search by location..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="
    w-64
    bg-slate-800
    border border-slate-700
    focus:border-red-500
    outline-none
    px-4 py-2
    rounded-xl
    text-sm
  "
/>

    <select
      value={severityFilter}
      onChange={(e) => setSeverityFilter(e.target.value)}
      className="
        bg-slate-800
        border
        border-slate-700
        px-3
        py-2
        rounded-lg
        text-sm
      "
    >
      <option value="All">All</option>
      <option value="Low">Low</option>
      <option value="Medium">Medium</option>
      <option value="High">High</option>
      <option value="Critical">Critical</option>
    </select>

  </div>

</div>

  <div className="space-y-4">

    {filteredReports.length === 0 ? (
      <div className="bg-slate-800 p-4 rounded-xl">
        📭 No disaster reports found
      </div>
    ) : (
      filteredReports.map((report) => (
       <div
  key={report.id}
  className="
    bg-gradient-to-r
    from-slate-800
    to-slate-700
    p-5
    rounded-2xl
    border border-slate-700
    hover:border-red-500
    hover:shadow-lg
    hover:shadow-red-500/10
    hover:-translate-y-1
    transition-all
    duration-300
  "
>
          {/* Header */}
          <div className="flex justify-between items-center">

            <h4 className="font-bold">
              {report.disaster}
            </h4>

           <span
  className={`px-3 py-1 rounded-full text-xs font-semibold border ${
    report.severity === "Critical"
      ? "bg-red-500/20 text-red-400 border-red-500/30"
      : report.severity === "High"
      ? "bg-orange-500/20 text-orange-400 border-orange-500/30"
      : report.severity === "Medium"
      ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      : "bg-green-500/20 text-green-400 border-green-500/30"
  }`}
>
  {report.severity}
</span>

          </div>

          <p className="text-gray-400 mt-2">
            📍 {report.location}
          </p>

          <p className="text-gray-400">
            👥 {report.people} affected
          </p>

          <p className="text-gray-400 mb-3">
            {report.description}
          </p>

          {/* ASSIGN SECTION */}
          <div className="flex gap-2 items-center mt-3">

            <select
              className="bg-slate-900 p-2 rounded"
              onChange={(e) =>
                setSelectedTeam({
                  ...selectedTeam,
                  [report.id]: e.target.value,
                })
              }
            >
              <option value="">Select Team</option>
{teams.map((team) => (
  <option key={team} value={team}>
    {team}
  </option>
))}
            </select>

            <button
              onClick={() =>
                assignTeam(report.id, selectedTeam[report.id])
              }
              className="bg-green-600 px-3 py-2 rounded hover:bg-green-700"
            >
              Assign
            </button>

          </div>

          {/* STATUS */}
<div className="mt-3 flex items-center gap-2">
  <span className="text-sm text-gray-400">
    Status:
  </span>

  <select
    value={report.status || "Pending"}
    onChange={(e) =>
      updateStatus(report.id, e.target.value)
    }
    className="
      bg-slate-900
      border border-slate-700
      px-3 py-2
      rounded-lg
      text-sm
      focus:border-blue-500
      outline-none
    "
  >
    <option value="Pending">Pending</option>
    <option value="Assigned">Assigned</option>
    <option value="In Progress">In Progress</option>
    <option value="Resolved">Resolved</option>
  </select>
</div>

{report.team && (
 <div className="mt-3 inline-block px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm">
  🚑 {report.team}
</div>
)}
        </div>
      ))
    )}

  </div>
</div>
          {/* Operations */}
       {/* Operations */}
<div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">

  <h3 className="text-xl font-bold mb-4">
    📈 Emergency Operations Dashboard
  </h3>

  <div className="space-y-4">

    <div className="bg-slate-800 p-4 rounded-xl">
      📋 Total Reports: {reports.length}
    </div>

    <div className="bg-slate-800 p-4 rounded-xl">
      ⏳ Pending Cases: {pendingCases}
    </div>

    <div className="bg-slate-800 p-4 rounded-xl">
      🚑 Active Operations: {activeOperations}
    </div>

    <div className="bg-slate-800 p-4 rounded-xl">
      ✅ Resolved Cases: {resolvedCases}
    </div>

    <div className="bg-slate-800 p-4 rounded-xl">
      🔥 High Severity Alerts: {highSeverityCases}
    </div>

  </div>

</div>

        </div>
<button
  className="
    fixed
    bottom-6
    right-6
    w-16
    h-16
    rounded-full
    bg-red-600
    hover:bg-red-700
    shadow-2xl
    hover:scale-110
    transition-all
    text-2xl
    z-50
  "
>
  🚨
</button>
      </main>

    </div>
  );
}