import unittest
import os
import tempfile
import json
from backend.model_config_store import ModelConfigStore

class TestModelConfigStore(unittest.TestCase):
    def setUp(self):
        # Use a temporary file for testing
        self.temp_file = tempfile.NamedTemporaryFile(delete=False)
        self.store = ModelConfigStore(file_path=self.temp_file.name)

    def tearDown(self):
        try:
            os.unlink(self.temp_file.name)
        except Exception:
            pass

    def test_add_and_get_all(self):
        config1 = {"model_type": "A", "hyperparameters": {"lr": 0.1}}
        config2 = {"model_type": "B", "hyperparameters": {"lr": 0.2}}
        self.store.add(config1)
        self.store.add(config2)
        all_configs = self.store.get_all()
        self.assertEqual(len(all_configs), 2)
        self.assertIn(config1, all_configs)
        self.assertIn(config2, all_configs)

    def test_save_and_load_from_file(self):
        config = {"model_type": "C", "hyperparameters": {"epochs": 5}}
        self.store.add(config)
        # Create a new store to load from file
        new_store = ModelConfigStore(file_path=self.temp_file.name)
        new_store.load_from_file()
        all_configs = new_store.get_all()
        self.assertEqual(len(all_configs), 1)
        self.assertEqual(all_configs[0], config)

    def test_save_to_file_handles_exceptions(self):
        # Simulate a file write error by setting an invalid file path
        bad_store = ModelConfigStore(file_path="/invalid/path/configs.json")
        try:
            bad_store.add({"model_type": "D"})
        except Exception as e:
            self.fail(f"add() should not raise exception even if file write fails: {e}")

    def test_load_from_file_handles_invalid_json(self):
        # Write invalid JSON to the file
        with open(self.temp_file.name, "w") as f:
            f.write("not a json")
        self.store.load_from_file()
        self.assertEqual(self.store.get_all(), [])

if __name__ == "__main__":
    unittest.main()
