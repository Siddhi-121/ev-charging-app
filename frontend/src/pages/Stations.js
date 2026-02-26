import { useState, useEffect } from "react";
import { getStations, updateStationStatus } from "../api";

const statusColor = {
  available: "#00ff88",
  charging: "#38bdf8",
  fault: "#ff4d6d",
  reserved: "#ffd60a"
};

const statusIcon = {
  available: "⚡",
  charging: "🔌",
  fault: "⚠️",
  reserved: "🕐"
};

export default function Stations() {
  const [stations, setStations] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    getStations().then(res => setStations(res.data));
  }, []);

  const changeStatus = async (station_id, newStatus) => {
    await updateStationStatus(station_id, newStatus);
    setMsg(`✅ ${station_id} updated to ${newStatus}`);
    const res = await getStations();
    setStations(res.data);
    setTimeout(() => setMsg(""), 3000);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: 800 }}>
          All <span style={{ color: "#00ff88" }}>Stations</span>
        </h1>
        <div style={{
          background: "rgba(0,255,136,0.1)", color: "#00ff88",
          border: "1px solid rgba(0,255,136,0.3)", padding: "6px 16px",
          borderRadius: "20px", fontSize: "13px", fontFamily: "'Space Mono', monospace"
        }}>
          {stations.length} Stations Total
        </div>
      </div>

      {/* Message */}
      {msg && (
        <div style={{
          padding: "12px 16px", borderRadius: "8px", marginBottom: "16px",
          background: "rgba(0,255,136,0.1)", color: "#00ff88",
          border: "1px solid rgba(0,255,136,0.3)", fontSize: "13px"
        }}>
          {msg}
        </div>
      )}

      {/* Station Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {stations.map(s => (
          <div key={s.station_id} style={{
            background: "#111827", border: "1px solid #1e2d45",
            borderRadius: "12px", padding: "20px",
            borderTop: `2px solid ${statusColor[s.status]}`
          }}>
            {/* Station Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <div style={{ fontSize: "18px", fontWeight: 800 }}>
                  {statusIcon[s.status]} {s.name}
                </div>
                <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                  📍 {s.location}
                </div>
              </div>
              <div style={{
                padding: "4px 14px", borderRadius: "20px", fontSize: "11px",
                fontFamily: "'Space Mono', monospace", fontWeight: 700, textTransform: "uppercase",
                color: statusColor[s.status],
                background: `${statusColor[s.status]}18`,
                border: `1px solid ${statusColor[s.status]}44`
              }}>
                {s.status}
              </div>
            </div>

            {/* Station Info */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
              <div style={{ background: "#0a0e1a", border: "1px solid #1e2d45", borderRadius: "8px", padding: "10px" }}>
                <div style={{ fontSize: "10px", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "'Space Mono', monospace" }}>Max Power</div>
                <div style={{ fontSize: "18px", fontWeight: 700, marginTop: "4px" }}>{s.max_power_kw} kW</div>
              </div>
              <div style={{ background: "#0a0e1a", border: "1px solid #1e2d45", borderRadius: "8px", padding: "10px" }}>
                <div style={{ fontSize: "10px", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "'Space Mono', monospace" }}>Price</div>
                <div style={{ fontSize: "18px", fontWeight: 700, marginTop: "4px", color: "#00ff88" }}>₹{s.price_per_kwh}/kWh</div>
              </div>
            </div>

            {/* Change Status Buttons */}
            <div>
              <div style={{ fontSize: "10px", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "'Space Mono', monospace", marginBottom: "8px" }}>
                Change Status
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {["available", "charging", "reserved", "fault"].map(status => (
                  <button
                    key={status}
                    onClick={() => changeStatus(s.station_id, status)}
                    disabled={s.status === status}
                    style={{
                      padding: "5px 12px", borderRadius: "6px", fontSize: "11px",
                      fontFamily: "'Space Mono', monospace", fontWeight: 700,
                      cursor: s.status === status ? "not-allowed" : "pointer",
                      border: `1px solid ${statusColor[status]}44`,
                      background: s.status === status ? `${statusColor[status]}18` : "transparent",
                      color: statusColor[status], opacity: s.status === status ? 0.5 : 1,
                      transition: "all 0.2s"
                    }}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}