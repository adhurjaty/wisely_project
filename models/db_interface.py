from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from util.utils import get_config
from .base import Base


config = get_config()
config = {k.lstrip('DB_').lower(): v for k, v in config.items() if k.startswith('DB_')}
engine = create_engine(f'postgresql://{config.get("username")}:{config.get("password")}' + \
    f'@{config.get("host")}:{config.get("port")}/{config.get("name")}')

createSession = sessionmaker(bind=engine)


class DBInterface:
    session = None

    def __init__(self):
        self.session = createSession()

    def insert(self, model: Base):
        self.session.add(model)
        self.save()

    def save(self):
        self.session.commit()
        