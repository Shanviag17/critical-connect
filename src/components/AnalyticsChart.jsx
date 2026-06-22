import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function AnalyticsChart({ reports = [] }) {
  const severityData = [
    {
      name: "Low",
      value: reports.filter((r) => r.severity === "Low").length,
    },
    {
      name: "Medium",
      value: reports.filter((r) => r.severity === "Medium").length,
    },
    {
      name: "High",
      value: reports.filter((r) => r.severity === "High").length,
    },
    {
      name: "Critical",
      value: reports.filter((r) => r.severity === "Critical").length,
    },
  ];

  const disasterMap = {};

  reports.forEach((report) => {
    const type = report.disaster || "Unknown";
    disasterMap[type] = (disasterMap[type] || 0) + 1;
  });

  const disasterData = Object.keys(disasterMap).map((key) => ({
    disaster: key,
    reports: disasterMap[key],
  }));

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
        <h3 className="text-xl font-bold mb-4">
          📈 Disaster Analysis
        </h3>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={disasterData}>
              <XAxis dataKey="disaster" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="reports"
                stroke="#ef4444"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
        <h3 className="text-xl font-bold mb-4">
          🚨 Severity Distribution
        </h3>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={severityData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}