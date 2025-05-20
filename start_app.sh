#!/bin/bash
# Script to build frontend, run Flask backend, and open frontend in browser

set -e

# 1. Build frontend (if using React build)
cd frontend
if [ -f package.json ]; then
  echo "Installing frontend dependencies..."
  npm install
  echo "Building frontend..."
  npm run build
fi
cd ..

# 2. Ensure backend dependencies are installed
if [ -f requirements.txt ]; then
  echo "Installing backend dependencies..."
  pip install --user -r requirements.txt
fi

# 3. Start Flask backend (in background)
echo "Starting Flask backend..."
FLASK_APP=backend/app.py FLASK_ENV=development python3 backend/app.py &
FLASK_PID=$!
sleep 2

# 4. Open frontend in browser (React build is served by Flask)
URL="http://localhost:5000"
echo "Opening $URL in browser..."
if which xdg-open > /dev/null; then
  xdg-open "$URL"
elif which open > /dev/null; then
  open "$URL"
else
  echo "Please open $URL in your browser."
fi

# 5. Wait for Flask process
wait $FLASK_PID
