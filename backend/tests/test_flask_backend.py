import sys
import os

# Add the project root (deepbuilder/) to PYTHONPATH
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

import unittest
from flask import Flask
from backend.app import app  # absolute import now works
from dotenv import load_dotenv

class TestFlaskBackend(unittest.TestCase):

    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_app_creation(self):
        self.assertIsInstance(app, Flask)

    def test_environment_variables_loaded(self):
        load_dotenv()
        test_key = os.getenv("TEST_KEY")
        self.assertIsNotNone(test_key, "TEST_KEY should be loaded from .env")

    def test_api_hello_route_exists(self):
        response = self.app.get("/api/hello")
        self.assertNotEqual(response.status_code, 404, "Route /api/hello should exist")

    def test_api_hello_route_response(self):
        response = self.app.get("/api/hello")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json, {"message": "Hello from Flask!"})

    def test_api_hello_route_error_handling(self):
        with self.app.application.app_context():
            @self.app.application.route('/api/error')
            def error_route():
                return {"error": "Something went wrong"}, 500

        response = self.app.get('/api/error')
        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.json, {"error": "Something went wrong"})

    def test_cors_headers_present(self):
        response = self.app.get("/api/hello")
        self.assertIn("Access-Control-Allow-Origin", response.headers, "CORS headers should be present in the response")

if __name__ == "__main__":
    unittest.main()
