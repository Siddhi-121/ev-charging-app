from flask import Blueprint, jsonify, request, current_app

stations_bp = Blueprint("stations", __name__)

@stations_bp.route("/api/stations", methods=["GET"])
def get_stations():
    db = current_app.config["DB"]
    stations = list(db.stations.find({}, {"_id": 0}))
    return jsonify(stations)

@stations_bp.route("/api/stations/<station_id>/status", methods=["PUT"])
def update_status(station_id):
    db = current_app.config["DB"]
    data = request.get_json()
    db.stations.update_one(
        {"station_id": station_id},
        {"$set": {"status": data["status"]}}
    )
    return jsonify({"message": "Status updated"})