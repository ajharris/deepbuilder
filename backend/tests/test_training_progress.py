import unittest
from backend.app import app

class TestTrainingProgressEndpoint(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()
        self.client.testing = True

    def test_training_progress_default(self):
        response = self.client.get("/api/training_progress")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn("current_epoch", data)
        self.assertIn("total_epochs", data)
        self.assertIn("loss", data)
        self.assertEqual(data["current_epoch"], 0)
        self.assertEqual(data["total_epochs"], 0)
        self.assertIsNone(data["loss"])

if __name__ == "__main__":
    unittest.main()
