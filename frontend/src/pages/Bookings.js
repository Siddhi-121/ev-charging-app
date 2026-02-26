import { useState, useEffect } from "react";
import { getBookings, createBooking } from "../api";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState({
    vehicle_id: "", station_id: "", slot_time: "", duration_mins: 60
  });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    getBookings().then(res => setBookings(res.data));
  }, []);

  const handleSubmit = async () => {
    if (!form.vehicle_id || !form.station_id || !form.slot_time) {
      setMsg("❌ Please fill all fields!");
      return;
    }
    await createBooking(form);
    setMsg("✅ Booking confirmed!");
    setForm({ vehicle_id: "", station_id: "", slot_time: "", duration_mins: 60 });
    const res = await getBookings();
    setBookings(res.data);
    setTimeout(() => setMsg(""), 3000);
  };

  const statusColor = {
    confirmed: "#00ff88", cancelled: "#ff4d6d", completed: "#64748b"
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <h1 style={{ fontSize: "26px", fontWeight: 800 }}>
          Manage <span style={{ color: "#00ff88" }}>Bookings</span>
        </h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>

        {/* BOOKING FORM */}
        <div style={{ background: "#111827", border: "1px solid #1e2d45", borderRadius: "12px", padding: "24px" }}>
          <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.5px", color: "#64748b", marginBottom: "20px", fontFamily: "'Space Mono', monospace" }}>
            Book a Slot
          </div>

          {/* Vehicle ID */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: "#64748b", marginBottom: "6px", display: "block", fontFamily: "'Space Mono', monospace" }}>
              Vehicle ID
            </label>
            <input
              value={form.vehicle_id}
              onChange={e => setForm({ ...form, vehicle_id: e.target.value })}
              placeholder="e.g. MH-12-AB-3456"
              style={{
                width: "100%", background: "#0a0e1a", border: "1px solid #1e2d45",
                color: "#e2e8f0", padding: "10px 14px", borderRadius: "8px",
                fontSize: "14px", outline: "none", fontFamily: "'Syne', sans-serif"
              }}
            />
          </div>

          {/* Station */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: "#64748b", marginBottom: "6px", display: "block", fontFamily: "'Space Mono', monospace" }}>
              Station ID
            </label>
            <select
              value={form.station_id}
              onChange={e => setForm({ ...form, station_id: e.target.value })}
              style={{
                width: "100%", background: "#0a0e1a", border: "1px solid #1e2d45",
                color: "#e2e8f0", padding: "10px 14px", borderRadius: "8px",
                fontSize: "14px", outline: "none", fontFamily: "'Syne', sans-serif"
              }}
            >
              <option value="">Select a station</option>
              <option value="A1">A1 — Mall Road</option>
              <option value="B2">B2 — Tech Park</option>
              <option value="C3">C3 — Airport Gate</option>
              <option value="D4">D4 — Railway Station</option>
            </select>
          </div>

          {/* Time */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: "#64748b", marginBottom: "6px", display: "block", fontFamily: "'Space Mono', monospace" }}>
              Slot Time
            </label>
            <input
              type="datetime-local"
              value={form.slot_time}
              onChange={e => setForm({ ...form, slot_time: e.target.value })}
              style={{
                width: "100%", background: "#0a0e1a", border: "1px solid #1e2d45",
                color: "#e2e8f0", padding: "10px 14px", borderRadius: "8px",
                fontSize: "14px", outline: "none", fontFamily: "'Syne', sans-serif"
              }}
            />
          </div>

          {/* Duration */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", color: "#64748b", marginBottom: "6px", display: "block", fontFamily: "'Space Mono', monospace" }}>
              Duration
            </label>
            <select
              value={form.duration_mins}
              onChange={e => setForm({ ...form, duration_mins: parseInt(e.target.value) })}
              style={{
                width: "100%", background: "#0a0e1a", border: "1px solid #1e2d45",
                color: "#e2e8f0", padding: "10px 14px", borderRadius: "8px",
                fontSize: "14px", outline: "none", fontFamily: "'Syne', sans-serif"
              }}
            >
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
            </select>
          </div>

          {/* Message */}
          {msg && (
            <div style={{
              padding: "10px 14px", borderRadius: "8px", marginBottom: "14px",
              background: msg.includes("✅") ? "rgba(0,255,136,0.1)" : "rgba(255,77,109,0.1)",
              color: msg.includes("✅") ? "#00ff88" : "#ff4d6d",
              border: `1px solid ${msg.includes("✅") ? "rgba(0,255,136,0.3)" : "rgba(255,77,109,0.3)"}`,
              fontSize: "13px"
            }}>
              {msg}
            </div>
          )}

          {/* Button */}
          <button
            onClick={handleSubmit}
            style={{
              width: "100%", padding: "12px", background: "#00ff88",
              color: "#0a0e1a", border: "none", borderRadius: "8px",
              fontSize: "15px", fontWeight: 800, cursor: "pointer",
              fontFamily: "'Syne', sans-serif"
            }}
          >
            ⚡ Confirm Booking
          </button>
        </div>

        {/* BOOKINGS LIST */}
        <div style={{ background: "#111827", border: "1px solid #1e2d45", borderRadius: "12px", padding: "24px" }}>
          <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "1.5px", color: "#64748b", marginBottom: "20px", fontFamily: "'Space Mono', monospace" }}>
            Recent Bookings ({bookings.length})
          </div>

          {bookings.length === 0 ? (
            <div style={{ color: "#64748b", fontSize: "14px", textAlign: "center", padding: "40px 0" }}>
              No bookings yet. Make one! 👆
            </div>
          ) : (
            bookings.map((b, i) => (
              <div key={i} style={{
                background: "#0a0e1a", border: "1px solid #1e2d45",
                borderRadius: "10px", padding: "14px", marginBottom: "10px"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "14px" }}>🚗 {b.vehicle_id}</div>
                    <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>
                      Station {b.station_id} • {b.duration_mins} mins
                    </div>
                    <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px", fontFamily: "'Space Mono', monospace" }}>
                      {b.slot_time}
                    </div>
                  </div>
                  <div style={{
                    padding: "4px 12px", borderRadius: "20px", fontSize: "11px",
                    fontFamily: "'Space Mono', monospace", fontWeight: 700, textTransform: "uppercase",
                    color: statusColor[b.status] || "#00ff88",
                    background: `${statusColor[b.status] || "#00ff88"}18`,
                    border: `1px solid ${statusColor[b.status] || "#00ff88"}44`
                  }}>
                    {b.status}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}