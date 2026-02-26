import { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const API = "http://localhost:5000/api";

export default function Analytics() {
  const [powerData, setPowerData] = useState([]);
  const [energyData, setEnergyData] = useState([]);
  const [stations, setStations] = useState([]);
  const [tick, setTick] = useState(0);

  // Generate realistic power curve data
  useEffect(() => {
    const generatePowerCurve = () => {
      const points = [];
      for (let i = 0; i <= 60; i += 2) {
        const progress = i / 60;
        // Real EV charging curve: fast at start, slows near 100%
        let power;
        if (progress < 0.2) power = 5 + progress * 85;
        else if (progress < 0.7) power = 22 + Math.sin(progress * 3) * 2;
        else power = 22 * (1 - (progress - 0.7) / 0.5);
        points.push({
          time: `${i}min`,
          power: Math.max(0, power).toFixed(1),
          voltage: (400 + Math.sin(progress * 10) * 5).toFixed(1),
          current: (power / 0.4).toFixed(1)
        });
      }
      return points;
    };
    setPowerData(generatePowerCurve());
  }, []);

  // Live energy consumption — updates every 3 seconds
  useEffect(() => {
    const generateLiveEnergy = () => {
      const hours = ["00","02","04","06","08","10","12","14","16","18","20","22"];
      return hours.map((h, i) => ({
        hour: `${h}:00`,
        consumption: Math.floor(20 + Math.sin(i * 0.8) * 15 + Math.random() * 10),
        sessions: Math.floor(2 + Math.sin(i * 0.8) * 3 + Math.random() * 2),
        revenue: Math.floor(400 + Math.sin(i * 0.8) * 300 + Math.random() * 200),
      }));
    };
    setEnergyData(generateLiveEnergy());
    const interval = setInterval(() => {
      setEnergyData(generateLiveEnergy());
      setTick(t => t + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Station load data
  useEffect(() => {
    axios.get(`${API}/stations`).then(res => {
      setStations(res.data.map(s => ({
        name: s.station_id,
        load: s.status === "charging" ? Math.floor(60 + Math.random() * 40)
            : s.status === "available" ? 0
            : s.status === "reserved" ? Math.floor(10 + Math.random() * 20)
            : 0,
        status: s.status
      })));
    });
  }, [tick]);

  const tooltipStyle = {
    background: "#111827", border: "1px solid #1e2d45",
    borderRadius: "8px", fontSize: "12px", fontFamily: "'Space Mono', monospace"
  };

  const gridStyle = { stroke: "#1e2d45", strokeDasharray: "3 3" };
  const axisStyle = { fontSize: 11, fill: "#64748b", fontFamily: "'Space Mono', monospace" };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: 800 }}>
          Power <span style={{ color: "#00ff88" }}>Analytics</span>
        </h1>
        <div style={{
          background: "rgba(0,255,136,0.1)", color: "#00ff88",
          border: "1px solid rgba(0,255,136,0.3)", padding: "6px 16px",
          borderRadius: "20px", fontSize: "12px", fontFamily: "'Space Mono', monospace",
          display: "flex", alignItems: "center", gap: "8px"
        }}>
          <div style={{ width: "6px", height: "6px", background: "#00ff88", borderRadius: "50%" }}></div>
          Live — updates every 3s
        </div>
      </div>

      {/* STAT CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px", marginBottom: "24px" }}>
        {[
          { label: "Total kWh Today", value: "284.5", unit: "kWh", color: "#00ff88" },
          { label: "Peak Power", value: "22.0", unit: "kW", color: "#38bdf8" },
          { label: "Avg Session", value: "14.2", unit: "kWh", color: "#ffd60a" },
          { label: "CO₂ Saved", value: "198.2", unit: "kg", color: "#a78bfa" },
        ].map(s => (
          <div key={s.label} style={{
            background: "#111827", border: "1px solid #1e2d45",
            borderRadius: "12px", padding: "18px",
            borderTop: `2px solid ${s.color}`
          }}>
            <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px", color: "#64748b", fontFamily: "'Space Mono',monospace", marginBottom: "8px" }}>
              {s.label}
            </div>
            <div style={{ fontSize: "28px", fontWeight: 800, color: s.color }}>
              {s.value}<span style={{ fontSize: "13px", marginLeft: "4px", color: "#64748b" }}>{s.unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* CHART 1 — EV Charging Power Curve */}
      <div style={{ background: "#111827", border: "1px solid #1e2d45", borderRadius: "12px", padding: "24px", marginBottom: "20px" }}>
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.5px", color: "#64748b", fontFamily: "'Space Mono',monospace" }}>
            EV Charging Power Curve (kW vs Time)
          </div>
          <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
            Typical CC-CV charging profile — fast charge → taper as battery fills
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={powerData}>
            <defs>
              <linearGradient id="powerGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00ff88" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#00ff88" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="voltGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid {...gridStyle} />
            <XAxis dataKey="time" tick={axisStyle} />
            <YAxis tick={axisStyle} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: "11px", fontFamily: "'Space Mono',monospace" }} />
            <Area type="monotone" dataKey="power" stroke="#00ff88" fill="url(#powerGrad)" strokeWidth={2} name="Power (kW)" dot={false} />
            <Line type="monotone" dataKey="current" stroke="#ffd60a" strokeWidth={1.5} strokeDasharray="4 2" name="Current (A/10)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* CHART 2 — Energy Consumption (live) */}
      <div style={{ background: "#111827", border: "1px solid #1e2d45", borderRadius: "12px", padding: "24px", marginBottom: "20px" }}>
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.5px", color: "#64748b", fontFamily: "'Space Mono',monospace" }}>
            Energy Consumption by Hour (kWh) — Live
          </div>
          <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
            Demand peaks during morning and evening commute hours
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={energyData}>
            <CartesianGrid {...gridStyle} />
            <XAxis dataKey="hour" tick={axisStyle} />
            <YAxis tick={axisStyle} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: "11px", fontFamily: "'Space Mono',monospace" }} />
            <Bar dataKey="consumption" fill="#38bdf8" name="Energy (kWh)" radius={[4,4,0,0]} opacity={0.85} />
            <Bar dataKey="sessions" fill="#00ff88" name="Sessions" radius={[4,4,0,0]} opacity={0.85} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* CHART 3 — Station Load */}
      <div style={{ background: "#111827", border: "1px solid #1e2d45", borderRadius: "12px", padding: "24px" }}>
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.5px", color: "#64748b", fontFamily: "'Space Mono',monospace" }}>
            Station Load Distribution (%) — Real Time
          </div>
          <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
            Live load percentage per station based on current status
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={stations} layout="vertical">
            <CartesianGrid {...gridStyle} />
            <XAxis type="number" domain={[0,100]} tick={axisStyle} unit="%" />
            <YAxis dataKey="name" type="category" tick={axisStyle} width={30} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v}%`} />
            <Bar dataKey="load" radius={[0,6,6,0]} name="Load %" fill="#00ff88"
              label={{ position: "right", fontSize: 10, fill: "#64748b", fontFamily: "'Space Mono',monospace", formatter: v => v > 0 ? `${v}%` : "" }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}