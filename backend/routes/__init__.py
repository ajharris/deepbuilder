from flask import Blueprint, jsonify, request
from backend.model_config_store import model_config_store

# In-memory training progress (for demo; in production, use a better store)
training_progress = {
    "current_epoch": 0,
    "total_epochs": 0,
    "loss": None
}

def register_routes(app):
    @app.route("/api/hello")
    def hello():
        return jsonify({"message": "Hello from Flask!"})

    @app.route("/api/modelconfig", methods=["POST"])
    def modelconfig():
        try:
            # Handle invalid JSON payloads
            if not request.is_json:
                return jsonify({"error": "Invalid content type, expected application/json"}), 400

            # Parse JSON payload
            data = request.get_json()
            if not data:
                return jsonify({"error": "Invalid JSON payload"}), 400

            # Validate required fields
            required_fields = ["model_type", "hyperparameters"]
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400

            # Example validation for hyperparameters
            if not isinstance(data.get("hyperparameters"), dict):
                return jsonify({"error": "Invalid type for hyperparameters, expected a dictionary"}), 422

            # Store config in-memory and local file
            model_config_store.add(data)
            saved_id = len(model_config_store.get_all())

            return jsonify({"message": "Model configuration saved successfully", "id": saved_id}), 201

        except Exception as e:
            app.logger.error("An unexpected error occurred: %s", str(e))
            return jsonify({"error": "An unexpected error occurred"}), 500

    @app.route("/api/training_progress", methods=["GET"])
    def get_training_progress():
        # Return current training progress (epoch, loss, etc.)
        return jsonify(training_progress)
