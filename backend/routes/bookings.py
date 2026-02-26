from flask import Blueprint, jsonify, request, current_app
from datetime import datetime

bookings_bp = Blueprint("bookings", __name__)

@bookings_bp.route("/api/bookings", methods=["POST"])
def create_booking():
    db = current_app.config["DB"]
    data = request.get_json()
    booking = {
        "vehicle_id": data["vehicle_id"],
        "station_id": data["station_id"],
        "slot_time": data["slot_time"],
        "duration_mins": data["duration_mins"],
        "status": "confirmed",
        "created_at": datetime.now().isoformat()
    }
    db.bookings.insert_one(booking)
    db.stations.update_one(
        {"station_id": data["station_id"]},
        {"$set": {"status": "reserved"}}
    )
    return jsonify({"message": "Booking confirmed!"}), 201

@bookings_bp.route("/api/bookings", methods=["GET"])
def get_bookings():
    db = current_app.config["DB"]
    bookings = list(db.bookings.find({}, {"_id": 0}))
    return jsonify(bookings)