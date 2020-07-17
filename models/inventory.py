from sqlalchemy import *
from datetime import datetime

from .base import Base, id_col

class Inventory(Base):
    __tablename__ = 'inventories'    
    id = id_col()
    start_time = Column(DateTime())
    end_time = Column(DateTime())
    num_parties = Column(Integer())

    def __init__(self, start_time=None, end_time=None, num_parties=0, **kwargs):
        self.start_time = start_time
        self.end_time = end_time
        self.num_parties = num_parties