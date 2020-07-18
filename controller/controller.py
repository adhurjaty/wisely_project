import arrow
from datetime import datetime
from uuid import UUID

from models.db_interface import DBInterface

class Controller:
    db_int: DBInterface = None
    view_model = None

    def __init__(self, db_int: DBInterface, vm):
        self.db_int = db_int
        self.view_model = vm

    def get_inventories(self, day: str) -> dict:
        date = arrow.get(day).datetime
        inventories = self.db_int.get_inventories(date)
        return self.view_model.inventories(inventories)

    def make_reservation(self, time_slot_id, **reservation_info):
        pass

    def get_reservations(self, day):
        pass

    def update_reservation(self, reservation):
        pass

    def get_time_slot(self, slot_id: UUID):
        pass

    def create_time_slot(self, time_slot_info: dict):
        pass

    def update_time_slot(self, time_slot):
        pass

    