from sqlalchemy import *
from datetime import datetime

from .base import Base, id_col

class Reservation(Base):
    __tablename__ = 'reservations'
    id = id_col()
    name = Column(String())
    email = Column(String())
    time = Column(DateTime())
    party_size = Column(Integer())

    def __init__(self, name='', email='', time=None, party_size=0, **kwargs):
        self.name = name
        self.email = email
        self.time = time
        self.party_size = party_size