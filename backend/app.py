import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS
from backend.routes import register_routes, training_progress
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
import pydicom

# Load environment variables from .env file
load_dotenv()

# Example: Accessing a variable
secret_key = os.getenv("SECRET_KEY")

ALLOWED_EXTENSIONS = {'npy', 'png', 'dcm'}
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '../uploads')

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), '../frontend/build'), template_folder="templates")
CORS(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
register_routes(app)

# In-memory training progress (for demo; in production, use a better store)
# from backend.routes import training_progress

# Serve favicon.ico from React build or public directory
@app.route('/favicon.ico')
def favicon():
    build_favicon = os.path.join(app.static_folder, 'favicon.ico')
    public_favicon = os.path.join(os.path.dirname(__file__), '../../frontend/public/favicon.ico')
    if os.path.exists(build_favicon):
        return send_from_directory(app.static_folder, 'favicon.ico')
    elif os.path.exists(public_favicon):
        return send_from_directory(os.path.dirname(public_favicon), 'favicon.ico')
    else:
        return '', 404

# Serve static files and manifest from React build
@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory(os.path.join(app.static_folder, 'static'), filename)

@app.route('/manifest.json')
def serve_manifest():
    return send_from_directory(app.static_folder, 'manifest.json')

@app.route('/robots.txt')
def serve_robots():
    return send_from_directory(app.static_folder, 'robots.txt')

# Serve React frontend (index.html) for all other routes
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    static_file = os.path.normpath(os.path.join(app.static_folder, path))
    if path != "" and static_file.startswith(app.static_folder) and os.path.exists(static_file):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, 'index.html')

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/upload-dataset', methods=['POST'])
def upload_dataset():
    if 'file' not in request.files:
        return jsonify({'message': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400
    if not allowed_file(file.filename):
        return jsonify({'message': 'Invalid file type'}), 400
    filename = secure_filename(file.filename)
    save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(save_path)
    # Optionally, validate DICOM file
    if filename.lower().endswith('.dcm'):
        try:
            pydicom.dcmread(save_path)
        except Exception:
            os.remove(save_path)
            return jsonify({'message': 'Invalid DICOM file'}), 400
    return jsonify({'message': 'File uploaded successfully'}), 200

if __name__ == "__main__":
    app.run()
