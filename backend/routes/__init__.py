from flask import Blueprint, jsonify, request
from backend.model_config_store import model_config_store
import os
from werkzeug.utils import secure_filename

# In-memory training progress (for demo; in production, use a better store)
training_progress = {
    "current_epoch": 0,
    "total_epochs": 0,
    "loss": None
}

UPLOAD_DIR = os.getenv("UPLOAD_DIR", os.path.join(os.path.dirname(__file__), '../../uploads'))

# Ensure upload directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)

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

    @app.route('/api/upload', methods=['POST'])
    def upload_file():
        # Option 1: User uploads a file
        if 'file' in request.files:
            file = request.files['file']
            if file.filename == '':
                return jsonify({'error': 'No selected file'}), 400
            sanitized_filename = secure_filename(file.filename)
            save_path = os.path.join(UPLOAD_DIR, sanitized_filename)
            file.save(save_path)
            return jsonify({'message': 'File uploaded', 'path': save_path}), 201
        # Option 2: User provides a file path reference
        elif request.is_json:
            data = request.get_json()
            file_path = data.get('file_path')
            if file_path:
                # Accept both absolute and relative paths for test compatibility
                if os.path.isabs(file_path):
                    normalized_path = os.path.normpath(file_path)
                else:
                    normalized_path = os.path.normpath(os.path.join(UPLOAD_DIR, file_path))
                if os.path.exists(normalized_path):
                    return jsonify({'message': 'File reference accepted', 'path': normalized_path}), 200
                else:
                    return jsonify({'error': 'Invalid or missing file_path'}), 400
            else:
                return jsonify({'error': 'Invalid or missing file_path'}), 400
        else:
            return jsonify({'error': 'No file or file_path provided'}), 400

    @app.route("/api/parameter-options", methods=["GET"])
    def parameter_options():
        """
        Returns available options for model types, loss functions, and optimizers.
        In a real app, this could be loaded from a config file or database.
        """
        return jsonify({
            "modelTypes": ["CNN", "RNN", "UNet", "ResNet", "Transformer"],
            "lossFunctions": ["CrossEntropy", "MSE", "MAE", "Dice", "BCEWithLogits"],
            "optimizers": ["Adam", "SGD", "RMSprop", "Adagrad", "AdamW"]
        })
