import json
import os
from pathlib import Path


script_dir = os.path.dirname(os.path.abspath(__file__))
secrets_dir = os.path.join(script_dir, '..', 'secrets')
config_file = os.path.join(secrets_dir, 'app.config')


def get_config() -> dict:
    with open(config_file, 'r') as f:
        return json.load(f)


