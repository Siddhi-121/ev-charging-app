from flask import Blueprint, jsonify, request, current_app
from datetime import datetime
from bson import ObjectId

sessions_bp = Blueprint("sessions", __name__)

@sessions_bp.route("/api/sessions/start", methods=["POST"])
def start_session():
    db = current_app.config["DB"]
    data = request.get_json()
    session = {
        "station_id": data["station_id"],
        "vehicle_id": data["vehicle_id"],
        "start_time": datetime.now().isoformat(),
        "kwh_delivered": 0,
        "status": "active"
    }
    result = db.sessions.insert_one(session)
    db.stations.update_one(
        {"station_id": data["station_id"]},
        {"$set": {"status": "charging"}}
    )
    return jsonify({"session_id": str(result.inserted_id)}), 201

@sessions_bp.route("/api/sessions/<session_id>/update", methods=["PUT"])
def update_session(session_id):
    db = current_app.config["DB"]
    data = request.get_json()
    kwh = data["kwh_delivered"]
    cost = kwh * 20
    db.sessions.update_one(
        {"_id": ObjectId(session_id)},
        {"$set": {
            "kwh_delivered": kwh,
            "total_cost": cost,
            "status": "active"
        }}
    )
    return jsonify({"message": "updated", "kwh": kwh})

@sessions_bp.route("/api/sessions/<session_id>/end", methods=["PUT"])
def end_session(session_id):
    db = current_app.config["DB"]
    data = request.get_json()
    kwh = data["kwh_delivered"]
    cost = kwh * 20
    db.sessions.update_one(
        {"_id": ObjectId(session_id)},
        {"$set": {
            "end_time": datetime.now().isoformat(),
            "kwh_delivered": kwh,
            "total_cost": cost,
            "status": "completed"
        }}
    )
    db.stations.update_one(
        {"station_id": data.get("station_id", "")},
        {"$set": {"status": "available"}}
    )
    return jsonify({"total_cost": cost, "kwh": kwh})

@sessions_bp.route("/api/sessions", methods=["GET"])
def get_sessions():
    db = current_app.config["DB"]
    sessions = list(db.sessions.find({}, {"_id": 0}))
    return jsonify(sessions)

@sessions_bp.route("/api/sessions/active/<station_id>", methods=["GET"])
def get_active_session(station_id):
    db = current_app.config["DB"]
    session = db.sessions.find_one(
        {"station_id": station_id, "status": "active"},
        {"_id": 0}
    )
    if session:
        return jsonify(session)
    return jsonify(None)

