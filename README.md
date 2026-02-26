⚡ VoltGrid — EV Charging Station Management System
A full-stack web application to monitor and manage electric vehicle charging stations in real time.
Built with Python Flask, React.js, and MongoDB.

🖥️ What This Project Does
VoltGrid is like a control room for EV charging stations. It has 6 pages:
PageWhat it doesDashboardShows all stations live — available, charging, fault countsStationsAdmin can change any station status with one clickBookingsUsers book a charging slot — saves to MongoDB instantlyMapAll stations on a real map with colored pinsAnalyticsLive power charts — charging curve, energy usage, station loadLoginRegister and login — passwords hashed with SHA-256

🛠️ Tech Stack
PartTechnologyFrontendReact.js + Axios + Recharts + React-LeafletBackendPython + Flask + Flask-CORSDatabaseMongoDBMapOpenStreetMap (free, no API key)

📁 Folder Structure
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

⚙️ How to Run This Project
You need 3 things installed before starting:

Python 3.11+
Node.js
MongoDB Community Server (running locally)


Step 1 — Clone the repo
bashgit clone https://github.com/YOUR_USERNAME/ev-charging-app.git
cd ev-charging-app

Step 2 — Setup the Backend
bashcd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install flask flask-cors pymongo python-dotenv requests
```

Create a `.env` file inside the backend folder:
```
MONGO_URI=mongodb://localhost:27017/ev_charging_db
SECRET_KEY=any-random-string-here
Start Flask:
bashpython app.py
```

You should see:
```
Running on http://127.0.0.1:5000

Step 3 — Setup the Frontend
Open a new CMD window:
bashcd frontend
npm install
npm start
Browser opens at http://localhost:3000 automatically.

Step 4 — Add Sample Data
Open MongoDB Compass → connect to mongodb://localhost:27017 → open ev_charging_db → stations collection → Add Data → paste this:
json[
  { "station_id": "A1", "name": "Station A1", "location": "Mall Road", "status": "available", "max_power_kw": 22, "price_per_kwh": 20 },
  { "station_id": "B2", "name": "Station B2", "location": "Tech Park", "status": "charging", "max_power_kw": 50, "price_per_kwh": 20 },
  { "station_id": "C3", "name": "Station C3", "location": "Airport Gate", "status": "available", "max_power_kw": 22, "price_per_kwh": 20 },
  { "station_id": "D4", "name": "Station D4", "location": "Railway Station", "status": "fault", "max_power_kw": 7, "price_per_kwh": 20 },
  { "station_id": "E5", "name": "Station E5", "location": "City Mall Basement", "status": "available", "max_power_kw": 50, "price_per_kwh": 20 },
  { "station_id": "F6", "name": "Station F6", "location": "Highway NH-8", "status": "fault", "max_power_kw": 22, "price_per_kwh": 20 },
  { "station_id": "G7", "name": "Station G7", "location": "University Campus", "status": "available", "max_power_kw": 7, "price_per_kwh": 20 },
  { "station_id": "H8", "name": "Station H8", "location": "Hotel Meridian", "status": "reserved", "max_power_kw": 22, "price_per_kwh": 20 }
]

Step 5 — Run the Live Charging Simulator (optional)
Open a 3rd CMD window:
bashcd backend
venv\Scripts\activate
python simulator.py
This simulates a real EV charger sending kWh data every 2 seconds. Watch the Dashboard — a live session widget will appear with the kWh and cost ticking up in real time.

🌐 App Pages
URLPagelocalhost:3000Dashboardlocalhost:3000/stationsStationslocalhost:3000/bookingsBookingslocalhost:3000/mapMaplocalhost:3000/analyticsAnalyticslocalhost:3000/loginLogin
Backend API runs at localhost:5000/api/...

👩‍💻 Developed By
Siddhi Singh
Final Year Project — 2025–26
