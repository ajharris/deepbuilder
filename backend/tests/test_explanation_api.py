import unittest
from backend.app import app
import json

class TestExplanationAPI(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()
        self.client.testing = True

    def test_missing_term(self):
        resp = self.client.get('/api/explanation')
        self.assertEqual(resp.status_code, 400)
        self.assertIn('Missing', resp.get_json().get('error', ''))

    def test_valid_term(self):
        resp = self.client.get('/api/explanation?term=Convolutional_neural_network')
        self.assertEqual(resp.status_code, 200)
        data = resp.get_json()
        self.assertIn('summary', data)
        self.assertTrue(len(data['summary']) > 0)

    def test_invalid_term(self):
        resp = self.client.get('/api/explanation?term=ThisTermDoesNotExist1234567890')
        self.assertEqual(resp.status_code, 404)
        self.assertIn('No summary found', resp.get_json().get('error', ''))

if __name__ == '__main__':
    unittest.main()
