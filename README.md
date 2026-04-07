# ⚡ VoltGrid — EV Charging Station Management System

A full-stack web application to monitor and manage electric vehicle charging stations in real time.

Built with **Python Flask**, **React.js**, and **MongoDB**.

---

## 🖥️ What This Project Does

VoltGrid is like a control room for EV charging stations. It has 6 pages:

| Page | What it does |
|------|-------------|
| Dashboard | Shows all stations live — available, charging, fault counts |
| Stations | Admin can change any station status with one click |
| Bookings | Users book a charging slot — saves to MongoDB instantly |
| Map | All stations on a real map with colored pins |
| Analytics | Live power charts — charging curve, energy usage, station load |
| Login | Register and login — passwords hashed with SHA-256 |

---

## 🛠️ Tech Stack

| Part | Technology |
|------|-----------|
| Frontend | React.js + Axios + Recharts + React-Leaflet |
| Backend | Python + Flask + Flask-CORS |
| Database | MongoDB |
| Map | OpenStreetMap (free, no API key needed) |

---

## 📁 Folder Structure

```
ev-charging-app/
├── backend/
│   ├── app.py              ← main Flask server
│   ├── simulator.py        ← fake charger that sends live kWh data
│   ├── .env                ← MongoDB config (not uploaded to GitHub)
│   └── routes/
│       ├── stations.py     ← station API routes
│       ├── bookings.py     ← booking API routes
│       ├── sessions.py     ← session + billing routes
│       └── users.py        ← register + login routes
└── frontend/
    └── src/
        ├── App.js           ← page routing
        ├── api.js           ← all API calls in one place
        ├── pages/
        │   ├── Dashboard.js
        │   ├── Stations.js
        │   ├── Bookings.js
        │   ├── Map.js
        │   ├── Analytics.js
        │   └── Login.js
        └── components/
            └── Sidebar.js
```

---

## ⚙️ How to Run

You need 3 things installed before starting:

- Python 3.11+
- Node.js
- MongoDB Community Server (running locally)

---

### Step 1 — Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/ev-charging-app.git
cd ev-charging-app
```

---

### Step 2 — Setup Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install flask flask-cors pymongo python-dotenv requests
```

Create a `.env` file inside the backend folder:

```
MONGO_URI=mongodb://localhost:27017/ev_charging_db
SECRET_KEY=any-random-string-here
```

Start Flask:

```bash
python app.py
```

You should see:

```
Running on http://127.0.0.1:5000
```

---

### Step 3 — Setup Frontend

Open a new CMD window:

```bash
cd frontend
npm install
npm start
```

Browser opens at `http://localhost:3000` automatically.

---

### Step 4 — Add Sample Data

Open **MongoDB Compass** → connect to `mongodb://localhost:27017` → open `ev_charging_db` → `stations` collection → ADD DATA → Insert Document → paste this:

```json
[
  { "station_id": "A1", "name": "Station A1", "location": "Mall Road", "status": "available", "max_power_kw": 22, "price_per_kwh": 20 },
  { "station_id": "B2", "name": "Station B2", "location": "Tech Park", "status": "charging", "max_power_kw": 50, "price_per_kwh": 20 },
  { "station_id": "C3", "name": "Station C3", "location": "Airport Gate", "status": "available", "max_power_kw": 22, "price_per_kwh": 20 },
  { "station_id": "D4", "name": "Station D4", "location": "Railway Station", "status": "fault", "max_power_kw": 7, "price_per_kwh": 20 },
  { "station_id": "E5", "name": "Station E5", "location": "City Mall Basement", "status": "available", "max_power_kw": 50, "price_per_kwh": 20 },
  { "station_id": "F6", "name": "Station F6", "location": "Highway NH-8", "status": "fault", "max_power_kw": 22, "price_per_kwh": 20 },
  { "station_id": "G7", "name": "Station G7", "location": "University Campus", "status": "available", "max_power_kw": 7, "price_per_kwh": 20 },
  { "station_id": "H8", "name": "Station H8", "location": "Hotel Meridian", "status": "reserved", "max_power_kw": 22, "price_per_kwh": 20 }
]
```

---

### Step 5 — Run Live Charging Simulator (optional)

Open a 3rd CMD window:

```bash
cd backend
venv\Scripts\activate
python simulator.py
```

This simulates a real EV charger sending kWh data every 2 seconds.
Watch the Dashboard — a live session widget appears with kWh and cost ticking up in real time.

---

## 🌐 Pages & URLs

| URL | Page |
|-----|------|
| localhost:3000 | Dashboard |
| localhost:3000/stations | Stations |
| localhost:3000/bookings | Bookings |
| localhost:3000/map | Map |
| localhost:3000/analytics | Analytics |
| localhost:3000/login | Login |

Backend API runs at `localhost:5000/api/...`

---

## 🌐 API Endpoints

| Method | Endpoint | What it does |
|--------|----------|-------------|
| GET | /api/stations | Get all stations |
| PUT | /api/stations/\<id\>/status | Update station status |
| GET | /api/bookings | Get all bookings |
| POST | /api/bookings | Create a booking |
| POST | /api/sessions/start | Start charging session |
| PUT | /api/sessions/\<id\>/update | Update kWh (live sim) |
| PUT | /api/sessions/\<id\>/end | End session + calculate bill |
| GET | /api/sessions/active/\<id\> | Get active session for station |
| POST | /api/users/register | Register new user |
| POST | /api/users/login | Login user |

---

## 👩‍💻 Developed By

**Siddhi Singh**  
Final Year Project — 2025–26
