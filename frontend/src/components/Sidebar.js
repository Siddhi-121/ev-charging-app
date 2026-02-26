import { Link, useLocation } from "react-router-dom";

const navItems = [
  { path: "/", icon: "📊", label: "Dashboard" },
  { path: "/stations", icon: "🔌", label: "Stations" },
  { path: "/bookings", icon: "📅", label: "Bookings" },
  { path: "/map", icon: "🗺️", label: "Map" },
  { path: "/login", icon: "👤", label: "Login" },
  { path: "/analytics", icon: "📊", label: "Analytics" },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div style={{
      width: "220px", minHeight: "100vh", background: "#111827",
      borderRight: "1px solid #1e2d45", display: "flex",
      flexDirection: "column", position: "fixed", top: 0, left: 0, bottom: 0
    }}>
      {/* Logo */}
      <div style={{
        padding: "24px 20px", borderBottom: "1px solid #1e2d45",
        fontFamily: "'Space Mono', monospace", fontSize: "18px", fontWeight: 700
      }}>
        ⚡ <span style={{ color: "#00ff88" }}>Volt</span>Grid
      </div>

      {/* Nav Links */}
      <nav style={{ padding: "16px 0", flex: 1 }}>
        {navItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} style={{ textDecoration: "none" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "12px 20px", fontSize: "14px", fontWeight: 600,
                color: active ? "#00ff88" : "#64748b",
                background: active ? "rgba(255,255,255,0.04)" : "transparent",
                borderLeft: active ? "3px solid #00ff88" : "3px solid transparent",
                transition: "all 0.2s", cursor: "pointer"
              }}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{
        padding: "16px 20px", borderTop: "1px solid #1e2d45",
        fontSize: "12px", color: "#64748b", fontFamily: "'Space Mono', monospace"
      }}>
        <div>
          <span style={{
            display: "inline-block", width: "8px", height: "8px",
            background: "#00ff88", borderRadius: "50%", marginRight: "6px",
            animation: "pulse 2s infinite"
          }}></span>
          System Online
        </div>
        <div style={{ marginTop: "4px" }}>Admin: Siddhi Singh</div>
      </div>
    </div>
  );
}