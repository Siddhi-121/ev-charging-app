import time
import requests

# Simulates a charger sending data every 2 seconds
station_id = "A1"
vehicle_id = "DL-01-TEST-9999"
kwh = 0
API = "http://localhost:5000/api"

print("🔌 Charger simulator started...")

# Start a session
res = requests.post(f"{API}/sessions/start", json={
    "station_id": station_id,
    "vehicle_id": vehicle_id
})
session_id = res.json()["session_id"]
print(f"✅ Session started: {session_id}")

while kwh < 30:
    kwh += 0.5
    print(f"⚡ Sending: {kwh:.1f} kWh delivered...")
    requests.put(f"{API}/sessions/{session_id}/update", json={
        "kwh_delivered": kwh
    })
    time.sleep(2)

# Only call /end when charging is complete
requests.put(f"{API}/sessions/{session_id}/end", json={"kwh_delivered": kwh})
print(f"🏁 Charging complete! Total: {kwh} kWh = ₹{kwh * 20}")
