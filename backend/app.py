import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from flask import Flask, send_from_directory
from flask_cors import CORS
from backend.routes import register_routes
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Example: Accessing a variable
secret_key = os.getenv("SECRET_KEY")

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), '../frontend/build'), template_folder="templates")
CORS(app)
register_routes(app)

# Serve React frontend
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == "__main__":
    app.run()
