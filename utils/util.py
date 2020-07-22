from datetime import datetime, timedelta
import json
import os
from pathlib import Path
import pytz
from time import timezone


script_dir = os.path.dirname(os.path.abspath(__file__))
secrets_dir = os.path.join(script_dir, '..', 'secrets')
config_file = os.path.join(secrets_dir, 'app.config')


def get_config() -> dict:
    with open(config_file, 'r') as f:
        return json.load(f)


def format_date(d: datetime) -> str:
    return d.strftime('%Y-%m-%dT%H:%M:%SZ')

def format_date_tz(d: datetime) -> str:
    # return format_date(d)
    d += timedelta(seconds=timezone) - timedelta(hours=int(is_dst()))
    return d.strftime('%Y-%m-%dT%H:%M:%SZ')

def is_dst():
    return bool(datetime.now(pytz.timezone('America/Los_Angeles')).dst())

