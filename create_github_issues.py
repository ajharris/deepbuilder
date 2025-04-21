import os
import requests
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
REPO = os.getenv("GITHUB_REPO")  # Format: username/repo-name

headers = {
    "Authorization": f"token {GITHUB_TOKEN}",
    "Accept": "application/vnd.github.v3+json"
}

# List of issues to create
issues = [
    "Set up Flask backend app structure - initialize app, load `.env`, add base route `/api/hello`",
    "Set up React frontend using create-react-app - install Axios and test call to Flask",
    "Configure proxy in React to connect to Flask backend",
    "Create shared `.gitignore` for Flask + React",
    "Add `.env` file and configure Flask to load environment variables",
    "Create React form for model configuration - input fields for model type, loss function, optimizer, etc.",
    "Create backend route to accept model config (POST `/api/model/config`)",
    "Store submitted model config (in-memory or local file) for testing",
    "Build backend script generator to convert config to PyTorch/MONAI script",
    "Add endpoint to trigger training job (`POST /api/model/train`)",
    "Return basic training progress from backend (e.g., current epoch, loss)",
    "Display training results (metrics, plots) in frontend",
    "Add dataset upload form to React (accept NPY, PNG, or DICOM)",
    "Create Flask endpoint to receive uploaded files and save to UPLOAD_DIR",
    "Add basic validation and error handling for uploaded files",
    "Add endpoint to return evaluation results (`GET /api/model/results`)",
    "Enable export of model config as JSON or Python script",
    "Display evaluation metrics (accuracy, Dice, AUC) in UI",
    "Add real-time training logs/feedback panel (simple polling)",
    "Prompt system usability survey (SUS) at end of session",
    "Allow saving and loading of model configurations from frontend",
    "Add basic frontend styling with Tailwind or Bootstrap",
    "Write README with project goals, setup instructions, and demo info",
    "Set up GitHub Actions for linting and tests",
    "Create visual mockups or screenshots for documentation",
    "Implement reproducibility logging (timestamped configs + data hash)",
    "Add optional user profiles/auth for experiment tracking",
    "Enable comparison view of multiple model results"
]

# GitHub API URL
url = f"https://api.github.com/repos/{REPO}/issues"

# Create issues
for issue in issues:
    payload = {"title": issue}
    response = requests.post(url, headers=headers, json=payload)
    if response.status_code == 201:
        print(f"✅ Created issue: {issue}")
    else:
        print(f"❌ Failed to create issue: {issue}\n{response.status_code} - {response.text}")
