import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function DisasterMap({ reports = [] }) {
  const validReports = reports.filter(
    (report) => report.lat && report.lng
  );

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700 shadow-lg">

      <div className="flex justify-between items-center mb-4">

        <div>
          <h3 className="text-xl font-bold">
            🌍 National Disaster Monitoring Map
          </h3>

          <p className="text-sm text-gray-400">
            Real-time incident tracking across regions
          </p>
        </div>

        <div className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-sm font-medium">
          {reports.length} Active
        </div>

      </div>

      <MapContainer
        center={[22.5, 80]}
        zoom={5}
        style={{
          height: "400px",
          width: "100%",
          borderRadius: "16px",
        }}
      >
        <TileLayer
          attribution="OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validReports.map((report) => (
          <Marker
            key={report.id}
            position={[report.lat, report.lng]}
          >
            <Popup>
              <div className="min-w-[220px]">

                <h3 className="font-bold text-lg mb-2">
                  {report.disaster}
                </h3>

                <p>
                  📍 {report.location}
                </p>

                <p>
                  👥 {report.people} affected
                </p>

                <p>
                  🚨 Severity: {report.severity}
                </p>

                <p>
                  📌 Status: {report.status || "Pending"}
                </p>

                {report.team && (
                  <p>
                    🚑 Team: {report.team}
                  </p>
                )}

              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {validReports.length === 0 && (
        <div className="mt-4 bg-slate-800 p-4 rounded-xl text-gray-400 text-sm border border-slate-700">
          No disaster locations available yet.
        </div>
      )}

    </div>
  );
}