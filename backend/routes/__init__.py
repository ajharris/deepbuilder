from flask import Blueprint, jsonify

def register_routes(app):
    @app.route("/api/hello")
    def hello():
        return jsonify({"message": "Hello from Flask!"})
