from flask import Flask
from flask_cors import CORS
from backend.routes import register_routes

from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Example: Accessing a variable
secret_key = os.getenv("SECRET_KEY")


app = Flask(__name__, static_folder="static", template_folder="templates")
CORS(app)
register_routes(app)

if __name__ == "__main__":
    app.run()
