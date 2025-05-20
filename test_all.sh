#!/bin/bash
# test_all.sh
# Run backend and frontend tests for DeepBuilder

set -e

# Install backend dependencies
if [ -f "requirements.txt" ]; then
  echo "Installing backend Python dependencies..."
  pip install -r requirements.txt
else
  echo "requirements.txt not found!"
  exit 1
fi

# Run backend tests
if [ -d "backend" ]; then
  echo "Running backend tests with pytest..."
  pytest backend
else
  echo "Backend directory not found!"
  exit 1
fi

# Install frontend dependencies
if [ -d "frontend" ]; then
  echo "Installing frontend npm dependencies..."
  cd frontend
  npm install
  echo "Running frontend tests with npm..."
  npm test -- --watchAll=false
  cd ..
else
  echo "Frontend directory not found!"
  exit 1
fi

echo "All tests completed."
