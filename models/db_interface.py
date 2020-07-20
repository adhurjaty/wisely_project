from datetime import datetime, timedelta
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from typing import List

from .base import Base
from .reservation import Reservation
from .inventory import Inventory
from utils.util import get_config, format_date


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
        return model

    def save(self):
        self.session.commit()

    def get_reservations_on_day(self, day: datetime) -> List[Reservation]:
        start_date = format_date(day)
        end_date = format_date(day + timedelta(days=1))
        return self.session.query(Reservation)\
            .filter(Reservation.time >= start_date, Reservation.time < end_date)\
            .all()

    def get_reservation(self, id: str) -> Reservation:
        return self.session.query(Reservation).get(id)

    def delete_reservation(self, id: str):
        self.session.query(Reservation).filter(Reservation.id == id).delete()
