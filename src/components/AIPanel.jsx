export default function AIPanel({ reports = [] }) {
  const criticalReports = reports.filter(
    (report) =>
      report.severity === "Critical" ||
      report.severity === "High"
  );

  const highestRisk = criticalReports[0];

  const riskScore =
    highestRisk?.severity === "Critical"
      ? 95
      : highestRisk?.severity === "High"
      ? 85
      : 40;

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700 shadow-lg">

      <h3 className="text-xl font-bold mb-4">
        🤖 AI Emergency Intelligence
      </h3>

      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4">

        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400 text-sm">
            Threat Assessment
          </span>

          <span className="text-red-400 font-bold">
            {riskScore}%
          </span>
        </div>

        <div className="w-full bg-slate-700 rounded-full h-2 mb-3">
          <div
            className="bg-red-500 h-2 rounded-full"
            style={{ width: `${riskScore}%` }}
          />
        </div>

        <p className="text-gray-300">
          {highestRisk
            ? `${highestRisk.disaster} reported in ${highestRisk.location}`
            : "No critical threats detected"}
        </p>

      </div>

      <div className="bg-slate-800 rounded-xl p-4">

        <h4 className="text-green-400 font-semibold mb-3">
          Recommended Actions
        </h4>

        <ul className="space-y-3 text-gray-300">

          {riskScore >= 90 && (
            <>
              <li>🚨 Immediate evacuation recommended</li>
              <li>🚑 Deploy Team Alpha</li>
              <li>🏥 Alert nearby hospitals</li>
              <li>🚁 Keep air support ready</li>
            </>
          )}

          {riskScore >= 70 && riskScore < 90 && (
            <>
              <li>⚠ Deploy rescue teams</li>
              <li>🍱 Send emergency supplies</li>
              <li>📢 Issue public alert</li>
            </>
          )}

          {riskScore < 70 && (
            <>
              <li>✅ Continue monitoring</li>
              <li>📍 Track incoming reports</li>
            </>
          )}

        </ul>
      </div>

      <div className="mt-4 bg-slate-800 rounded-xl p-4">
        <h4 className="text-blue-400 font-semibold mb-2">
          📊 AI Summary
        </h4>

        <p className="text-gray-400 text-sm">
          {criticalReports.length} high-risk incidents currently require attention.
        </p>
      </div>

    </div>
  );
}