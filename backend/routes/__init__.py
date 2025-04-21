from flask import Blueprint, jsonify, request

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

            # Simulate database save (replace with actual DB logic)
            # Example: db.save_model_config(data)
            saved_id = 1  # Placeholder for saved record ID

            return jsonify({"message": "Model configuration saved successfully", "id": saved_id}), 201

        except Exception as e:
            app.logger.error("An unexpected error occurred: %s", str(e))
            return jsonify({"error": "An unexpected error occurred"}), 500
