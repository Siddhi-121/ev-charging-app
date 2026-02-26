import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

export default function Login() {
  const [tab, setTab] = useState("login");
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [msg, setMsg] = useState("");

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "", email: "", password: "", vehicle_id: ""
  });

  const handleLogin = async () => {
    if (!loginForm.email || !loginForm.password) {
      setMsg("❌ Please fill all fields!"); return;
    }
    try {
      const res = await axios.post(`${API}/users/login`, loginForm);
      setUser(res.data);
      setLoggedIn(true);
      setMsg("");
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.error || "Login failed!"));
    }
  };

  const handleRegister = async () => {
    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      setMsg("❌ Please fill all fields!"); return;
    }
    try {
      await axios.post(`${API}/users/register`, registerForm);
      setMsg("✅ Registered! Please login now.");
      setTab("login");
      setRegisterForm({ name: "", email: "", password: "", vehicle_id: "" });
    } catch (err) {
      setMsg("❌ " + (err.response?.data?.error || "Registration failed!"));
    }
  };

  const inputStyle = {
    width: "100%", background: "#0a0e1a", border: "1px solid #1e2d45",
    color: "#e2e8f0", padding: "12px 14px", borderRadius: "8px",
    fontSize: "14px", outline: "none", fontFamily: "'Syne', sans-serif"
  };

  const labelStyle = {
    fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px",
    color: "#64748b", marginBottom: "6px", display: "block",
    fontFamily: "'Space Mono', monospace"
  };

  if (loggedIn) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "80vh" }}>
        <div style={{
          background: "#111827", border: "1px solid #1e2d45",
          borderRadius: "16px", padding: "40px", textAlign: "center", maxWidth: "400px"
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>
            {user.role === "admin" ? "👑" : "👤"}
          </div>
          <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#00ff88", marginBottom: "8px" }}>
            Welcome, {user.name}!
          </h2>
          <p style={{ color: "#64748b", fontSize: "13px" }}>{user.email}</p>
          <div style={{
            margin: "16px 0", padding: "12px", background: "#0a0e1a",
            borderRadius: "8px", border: "1px solid #1e2d45",
            fontFamily: "'Space Mono', monospace", fontSize: "12px"
          }}>
            <div style={{ color: "#64748b" }}>Role: <span style={{ color: "#ffd60a" }}>{user.role}</span></div>
            {user.vehicle_id && <div style={{ color: "#64748b", marginTop: "6px" }}>Vehicle: <span style={{ color: "#38bdf8" }}>{user.vehicle_id}</span></div>}
          </div>
          <button
            onClick={() => { setLoggedIn(false); setUser(null); setLoginForm({ email: "", password: "" }); }}
            style={{
              padding: "10px 24px", background: "transparent",
              border: "1px solid #ff4d6d", color: "#ff4d6d",
              borderRadius: "8px", cursor: "pointer", fontSize: "14px",
              fontFamily: "'Syne', sans-serif", fontWeight: 700
            }}
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "80vh" }}>
      <div style={{
        background: "#111827", border: "1px solid #1e2d45",
        borderRadius: "16px", padding: "40px", width: "100%", maxWidth: "420px"
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>⚡</div>
          <h2 style={{ fontSize: "24px", fontWeight: 800 }}>
            Welcome to <span style={{ color: "#00ff88" }}>VoltGrid</span>
          </h2>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", marginBottom: "24px", background: "#0a0e1a", borderRadius: "8px", padding: "4px" }}>
          {["login", "register"].map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setMsg(""); }}
              style={{
                flex: 1, padding: "10px", border: "none", borderRadius: "6px",
                cursor: "pointer", fontSize: "14px", fontWeight: 700,
                fontFamily: "'Syne', sans-serif", transition: "all 0.2s",
                background: tab === t ? "#00ff88" : "transparent",
                color: tab === t ? "#0a0e1a" : "#64748b"
              }}
            >
              {t === "login" ? "Sign In" : "Register"}
            </button>
          ))}
        </div>

        {/* Message */}
        {msg && (
          <div style={{
            padding: "10px 14px", borderRadius: "8px", marginBottom: "16px",
            background: msg.includes("✅") ? "rgba(0,255,136,0.1)" : "rgba(255,77,109,0.1)",
            color: msg.includes("✅") ? "#00ff88" : "#ff4d6d",
            border: `1px solid ${msg.includes("✅") ? "rgba(0,255,136,0.3)" : "rgba(255,77,109,0.3)"}`,
            fontSize: "13px"
          }}>
            {msg}
          </div>
        )}

        {/* LOGIN FORM */}
        {tab === "login" && (
          <div>
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Email</label>
              <input type="email" value={loginForm.email} placeholder="your@email.com"
                onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                style={inputStyle} />
            </div>
            <div style={{ marginBottom: "24px" }}>
              <label style={labelStyle}>Password</label>
              <input type="password" value={loginForm.password} placeholder="••••••••"
                onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                style={inputStyle} />
            </div>
            <button onClick={handleLogin} style={{
              width: "100%", padding: "13px", background: "#00ff88",
              color: "#0a0e1a", border: "none", borderRadius: "8px",
              fontSize: "15px", fontWeight: 800, cursor: "pointer",
              fontFamily: "'Syne', sans-serif"
            }}>
              Sign In →
            </button>
          </div>
        )}

        {/* REGISTER FORM */}
        {tab === "register" && (
          <div>
            <div style={{ marginBottom: "14px" }}>
              <label style={labelStyle}>Full Name</label>
              <input value={registerForm.name} placeholder="Rahul Sharma"
                onChange={e => setRegisterForm({ ...registerForm, name: e.target.value })}
                style={inputStyle} />
            </div>
            <div style={{ marginBottom: "14px" }}>
              <label style={labelStyle}>Email</label>
              <input type="email" value={registerForm.email} placeholder="your@email.com"
                onChange={e => setRegisterForm({ ...registerForm, email: e.target.value })}
                style={inputStyle} />
            </div>
            <div style={{ marginBottom: "14px" }}>
              <label style={labelStyle}>Password</label>
              <input type="password" value={registerForm.password} placeholder="••••••••"
                onChange={e => setRegisterForm({ ...registerForm, password: e.target.value })}
                style={inputStyle} />
            </div>
            <div style={{ marginBottom: "24px" }}>
              <label style={labelStyle}>Vehicle ID (optional)</label>
              <input value={registerForm.vehicle_id} placeholder="MH-12-AB-3456"
                onChange={e => setRegisterForm({ ...registerForm, vehicle_id: e.target.value })}
                style={inputStyle} />
            </div>
            <button onClick={handleRegister} style={{
              width: "100%", padding: "13px", background: "#00ff88",
              color: "#0a0e1a", border: "none", borderRadius: "8px",
              fontSize: "15px", fontWeight: 800, cursor: "pointer",
              fontFamily: "'Syne', sans-serif"
            }}>
              Create Account →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}