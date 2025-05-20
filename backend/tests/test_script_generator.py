import unittest
from backend.script_generator import generate_pytorch_script

class TestScriptGenerator(unittest.TestCase):
    def test_basic_script_generation(self):
        config = {
            'model_type': 'UNet',
            'hyperparameters': {'epochs': 5, 'lr': 0.001}
        }
        script = generate_pytorch_script(config)
        self.assertIn('UNet', script)
        self.assertIn('epochs', script)
        self.assertIn('0.001', script)
        self.assertTrue(script.startswith('import torch'))

    def test_missing_model_type(self):
        config = {'hyperparameters': {'epochs': 10}}
        script = generate_pytorch_script(config)
        self.assertIn('UnknownModel', script)

    def test_empty_config(self):
        script = generate_pytorch_script({})
        self.assertIn('UnknownModel', script)
        self.assertIn('Hyperparameters: {}', script)

    def test_script_is_string(self):
        config = {'model_type': 'ResNet', 'hyperparameters': {}}
        script = generate_pytorch_script(config)
        self.assertIsInstance(script, str)

if __name__ == '__main__':
    unittest.main()
