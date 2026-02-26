from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()  # loads your .env file

app = Flask(__name__)
CORS(app)  # allows React to talk to Flask

# Connect to MongoDB
client = MongoClient(os.getenv("MONGO_URI"))
db = client["ev_charging_db"]

# Import and register routes
from routes.stations import stations_bp
from routes.bookings import bookings_bp
from routes.users import users_bp
from routes.sessions import sessions_bp

app.register_blueprint(stations_bp)
app.register_blueprint(bookings_bp)
app.register_blueprint(users_bp)
app.register_blueprint(sessions_bp)

# Make db available to routes
app.config["DB"] = db

if __name__ == "__main__":
    app.run(debug=True, port=5000)