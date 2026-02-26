import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Stations from "./pages/Stations";
import Bookings from "./pages/Bookings";
import Login from "./pages/Login";
import Map from "./pages/Map";
import Analytics from "./pages/Analytics";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <main style={{ marginLeft: "220px", padding: "28px", flex: 1, minHeight: "100vh" }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/stations" element={<Stations />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/map" element={<Map />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}