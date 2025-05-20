# DeepBuilder

DeepBuilder is a full-stack application designed to simplify the process of configuring, training, and evaluating machine learning models. It features a Flask-based backend and a React-based frontend, providing a seamless user experience for model configuration and testing.

## Features

### Backend (Flask)
- **Model Configuration API**: Submit and store model configurations in-memory and in a local file.
- **Script Generator**: Generate PyTorch/MONAI training scripts based on submitted configurations.
- **Endpoints**:
  - `/api/hello`: Test endpoint to verify backend functionality.
  - `/api/modelconfig`: Accepts model configurations via POST requests.

### Frontend (React)
- **Dynamic Form**: A form to input model parameters such as model type, loss function, optimizer, and learning rate.
- **Real-Time Feedback**: Displays messages and errors from the backend.
- **Unit Tests**: Comprehensive tests for components and API interactions.

## Installation

### Prerequisites
- Python 3.12+
- Node.js 16+
- npm (Node Package Manager)

### Setup
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd deepbuilder
   ```

2. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   cd ..
   ```

## Usage

### Running the Application
1. Start the backend server:
   ```bash
   python backend/app.py
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```

3. Open your browser and navigate to `http://localhost:3000`.

### Running Tests
To run both backend and frontend tests, use the provided script:
```bash
./test_all.sh
```
This script installs dependencies (if missing) and runs:
- Backend tests using `pytest`
- Frontend tests using `npm test`

## Project Structure
```
backend/
  app.py                # Flask application entry point
  model_config_store.py # Utility for storing model configurations
  routes/               # API route definitions
  tests/                # Unit tests for backend
frontend/
  src/                  # React components and tests
  public/               # Static assets
  package.json          # Frontend dependencies and scripts
```

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Submit a pull request with a detailed description of your changes.

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

## Acknowledgments
- Flask: [https://flask.palletsprojects.com/](https://flask.palletsprojects.com/)
- React: [https://reactjs.org/](https://reactjs.org/)
- PyTorch: [https://pytorch.org/](https://pytorch.org/)