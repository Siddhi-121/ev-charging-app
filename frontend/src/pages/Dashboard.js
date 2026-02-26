import { useState, useEffect } from "react";
import { getStations } from "../api";
import axios from "axios";

const API = "http://localhost:5000/api";

const statusColor = {
  available: "#00ff88",
  charging: "#38bdf8",
  fault: "#ff4d6d",
  reserved: "#ffd60a"
};

export default function Dashboard() {
  const [stations, setStations] = useState([]);
  const [liveSession, setLiveSession] = useState(null);

  useEffect(() => {
    getStations().then(res => setStations(res.data));
    const interval = setInterval(() => {
      getStations().then(res => setStations(res.data));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const checkLive = async () => {
      const stationIds = ["A1","B2","C3","D4","E5","F6","G7","H8"];
      for (let id of stationIds) {
        try {
          const res = await axios.get(`${API}/sessions/active/${id}`);
          if (res.data) { setLiveSession(res.data); return; }
        } catch(e) {}
      }
      setLiveSession(null);
    };
    checkLive();
    const interval = setInterval(checkLive, 2000);
    return () => clearInterval(interval);
  }, []);

  const available = stations.filter(s => s.status === "available").length;
  const charging = stations.filter(s => s.status === "charging").length;
  const fault = stations.filter(s => s.status === "fault").length;

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: 800 }}>
          Live <span style={{ color: "#00ff88" }}>Dashboard</span>
        </h1>
        <div style={{
          background: "rgba(0,255,136,0.1)", color: "#00ff88",
          border: "1px solid rgba(0,255,136,0.3)", padding: "6px 16px",
          borderRadius: "20px", fontSize: "13px", fontFamily: "'Space Mono', monospace"
        }}>
          ⚡ {stations.length} Stations Live
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "28px" }}>
        {[
          { label: "Available", value: available, color: "#00ff88" },
          { label: "Charging Now", value: charging, color: "#38bdf8" },
          { label: "Faults", value: fault, color: "#ff4d6d" },
        ].map(stat => (
          <div key={stat.label} style={{
            background: "#111827", border: "1px solid #1e2d45",
            borderRadius: "12px", padding: "20px",
            borderTop: `2px solid ${stat.color}`
          }}>
            <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: "#64748b", marginBottom: "8px", fontFamily: "'Space Mono', monospace" }}>
              {stat.label}
            </div>
            <div style={{ fontSize: "36px", fontWeight: 800, color: stat.color }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Station List */}
      <div style={{ background: "#111827", border: "1px solid #1e2d45", borderRadius: "12px", padding: "20px" }}>
        <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.5px", color: "#64748b", marginBottom: "16px", fontFamily: "'Space Mono', monospace" }}>
          Station Status
        </div>
        {stations.map(s => (
          <div key={s.station_id} style={{
            background: "#0a0e1a", border: "1px solid #1e2d45",
            borderRadius: "10px", padding: "16px", marginBottom: "10px",
            display: "flex", justifyContent: "space-between", alignItems: "center"
          }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: "15px" }}>{s.name}</div>
              <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>📍 {s.location}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: "13px", textAlign: "right" }}>
                <span style={{ color: "#64748b", fontSize: "11px", display: "block" }}>Max Power</span>
                {s.max_power_kw} kW
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
          </div>
        ))}
      </div>

      {/* LIVE SESSION WIDGET */}
      {liveSession && (
        <div style={{
          background: "#111827", border: "1px solid #1e2d45",
          borderRadius: "12px", padding: "20px", marginTop: "20px",
          borderTop: "2px solid #38bdf8"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.5px", color: "#64748b", fontFamily: "'Space Mono', monospace" }}>
              Live Charging Session
            </div>
            <div style={{
              background: "rgba(255,77,109,0.1)", color: "#ff4d6d",
              border: "1px solid rgba(255,77,109,0.3)", padding: "4px 10px",
              borderRadius: "20px", fontSize: "11px", fontFamily: "'Space Mono', monospace",
              display: "flex", alignItems: "center", gap: "6px"
            }}>
              <div style={{ width: "6px", height: "6px", background: "#ff4d6d", borderRadius: "50%" }}></div>
              LIVE
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px" }}>
            {[
              { label: "Station", value: liveSession.station_id, color: "#38bdf8" },
              { label: "Vehicle", value: liveSession.vehicle_id, color: "#e2e8f0" },
              { label: "kWh", value: liveSession.kwh_delivered?.toFixed(1), color: "#00ff88" },
              { label: "Cost", value: `₹${((liveSession.kwh_delivered || 0) * 20).toFixed(0)}`, color: "#ffd60a" },
            ].map(item => (
              <div key={item.label} style={{ background: "#0a0e1a", border: "1px solid #1e2d45", borderRadius: "8px", padding: "12px", textAlign: "center" }}>
                <div style={{ fontSize: "10px", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px", fontFamily: "'Space Mono',monospace" }}>{item.label}</div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: item.color, marginTop: "4px" }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#64748b", marginBottom: "6px" }}>
              <span>Charging Progress</span>
              <span>{Math.min(((liveSession.kwh_delivered / 30) * 100), 100).toFixed(0)}%</span>
            </div>
            <div style={{ background: "#1e2d45", borderRadius: "6px", height: "8px", overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: "6px",
                background: "linear-gradient(90deg, #38bdf8, #00ff88)",
                width: `${Math.min((liveSession.kwh_delivered / 30) * 100, 100)}%`,
                transition: "width 1s ease"
              }}></div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
