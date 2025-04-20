from flask import Flask
from flask_cors import CORS
from routes import register_routes

app = Flask(__name__, static_folder="static", template_folder="templates")
CORS(app)
register_routes(app)

if __name__ == "__main__":
    app.run(debug=True)
