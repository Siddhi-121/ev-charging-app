from flask import Blueprint, jsonify, request, current_app
import hashlib

users_bp = Blueprint("users", __name__)

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# REGISTER
@users_bp.route("/api/users/register", methods=["POST"])
def register():
    db = current_app.config["DB"]
    data = request.get_json()

    # Check if email already exists
    existing = db.users.find_one({"email": data["email"]})
    if existing:
        return jsonify({"error": "Email already registered!"}), 400

    user = {
        "name": data["name"],
        "email": data["email"],
        "password": hash_password(data["password"]),
        "vehicle_id": data.get("vehicle_id", ""),
        "role": "user"
    }
    db.users.insert_one(user)
    return jsonify({"message": "Registered successfully!"}), 201

# LOGIN
@users_bp.route("/api/users/login", methods=["POST"])
def login():
    db = current_app.config["DB"]
    data = request.get_json()

    user = db.users.find_one({"email": data["email"]})
    if not user:
        return jsonify({"error": "Email not found!"}), 404

    if user["password"] != hash_password(data["password"]):
        return jsonify({"error": "Wrong password!"}), 401

    return jsonify({
        "message": "Login successful!",
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
        "vehicle_id": user["vehicle_id"]
    })

# GET all users (admin only)
@users_bp.route("/api/users", methods=["GET"])
def get_users():
    db = current_app.config["DB"]
    users = list(db.users.find({}, {"_id": 0, "password": 0}))
    return jsonify(users)