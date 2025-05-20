# model_config_store.py
"""
Utility for storing submitted model configs in-memory and/or in a local file for testing.
"""
import threading
import json
import os

# In-memory store (thread-safe)
class ModelConfigStore:
    def __init__(self, file_path=None):
        self._configs = []
        self._lock = threading.Lock()
        self.file_path = file_path or os.path.join(os.path.dirname(__file__), 'model_configs.json')

    def add(self, config):
        with self._lock:
            self._configs.append(config)
            self._save_to_file()

    def get_all(self):
        with self._lock:
            return list(self._configs)

    def _save_to_file(self):
        try:
            with open(self.file_path, 'w') as f:
                json.dump(self._configs, f, indent=2)
        except Exception as e:
            # Log or handle file write error
            pass

    def load_from_file(self):
        if os.path.exists(self.file_path):
            try:
                with open(self.file_path, 'r') as f:
                    self._configs = json.load(f)
            except Exception:
                self._configs = []

# Singleton instance for app use
model_config_store = ModelConfigStore()
model_config_store.load_from_file()
