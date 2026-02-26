import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import { getStations } from "../api";
import L from "leaflet";

// Fix default marker icon bug in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Color coded icons for each status
const createIcon = (color) => new L.DivIcon({
  html: `<div style="
    width:32px; height:32px; border-radius:50% 50% 50% 0;
    background:${color}; border:3px solid white;
    transform:rotate(-45deg);
    box-shadow:0 2px 8px rgba(0,0,0,0.4);
  "></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  className: ""
});

const statusColors = {
  available: "#00ff88",
  charging: "#38bdf8",
  fault: "#ff4d6d",
  reserved: "#ffd60a"
};

// Fake coordinates for each station (around Delhi)
const stationCoords = {
  "A1": [28.6304, 77.2177],
  "B2": [28.6129, 77.2295],
  "C3": [28.5562, 77.1000],
  "D4": [28.6431, 77.2194],
  "E5": [28.6289, 77.2065],
  "F6": [28.5921, 77.0460],
  "G7": [28.6757, 77.1157],
  "H8": [28.6139, 77.2090],
};

export default function Map() {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    getStations().then(res => setStations(res.data));
    const interval = setInterval(() => {
      getStations().then(res => setStations(res.data));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: 800 }}>
          Station <span style={{ color: "#00ff88" }}>Map</span>
        </h1>
        <div style={{ display: "flex", gap: "10px" }}>
          {Object.entries(statusColors).map(([status, color]) => (
            <div key={status} style={{
              display: "flex", alignItems: "center", gap: "6px",
              fontSize: "12px", fontFamily: "'Space Mono', monospace"
            }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: color }}></div>
              {status}
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      <div style={{ borderRadius: "12px", overflow: "hidden", border: "1px solid #1e2d45", height: "520px" }}>
        <MapContainer
          center={[28.6139, 77.2090]}
          zoom={12}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          {stations.map(s => {
            const coords = stationCoords[s.station_id];
            if (!coords) return null;
            return (
              <Marker
                key={s.station_id}
                position={coords}
                icon={createIcon(statusColors[s.status] || "#64748b")}
              >
                <Popup>
                  <div style={{ fontFamily: "sans-serif", minWidth: "160px" }}>
                    <div style={{ fontWeight: 700, fontSize: "15px", marginBottom: "6px" }}>
                      ⚡ {s.name}
                    </div>
                    <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>
                      📍 {s.location}
                    </div>
                    <div style={{ fontSize: "12px", marginBottom: "4px" }}>
                      🔋 {s.max_power_kw} kW
                    </div>
                    <div style={{ fontSize: "12px", marginBottom: "8px" }}>
                      ₹{s.price_per_kwh}/kWh
                    </div>
                    <div style={{
                      display: "inline-block", padding: "3px 10px",
                      borderRadius: "12px", fontSize: "11px", fontWeight: 700,
                      textTransform: "uppercase",
                      background: `${statusColors[s.status]}22`,
                      color: statusColors[s.status],
                      border: `1px solid ${statusColors[s.status]}44`
                    }}>
                      {s.status}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Station count summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px", marginTop: "16px" }}>
        {Object.entries(statusColors).map(([status, color]) => (
          <div key={status} style={{
            background: "#111827", border: "1px solid #1e2d45",
            borderRadius: "10px", padding: "14px", textAlign: "center",
            borderTop: `2px solid ${color}`
          }}>
            <div style={{ fontSize: "24px", fontWeight: 800, color: color }}>
              {stations.filter(s => s.status === status).length}
            </div>
            <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: "#64748b", fontFamily: "'Space Mono',monospace", marginTop: "4px" }}>
              {status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}