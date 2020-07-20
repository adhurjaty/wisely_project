import arrow
from datetime import datetime
from uuid import UUID
from typing import List

from .view_model import ViewModel
from models.db_interface import DBInterface
from models.inventory import Inventory
from models.reservation import Reservation

class Controller:
    db_int: DBInterface = None
    view_model: ViewModel = None

    def __init__(self, db_int: DBInterface, vm: ViewModel):
        self.db_int = db_int
        self.view_model = vm

    def get_inventories(self, day: str) -> List[dict]:
        date = arrow.get(day).datetime
        inventories = self.db_int.get_inventories(date)
        return self.view_model.inventories(inventories)

    def make_reservation(self, **reservation_info):
        reservation = Reservation(**reservation_info)
        reservation = self.db_int.insert(reservation)
        return self.view_model.reservation(reservation)

    def get_reservations(self, day: str) -> List[dict]:
        date = arrow.get(day).datetime
        reservations = self.db_int.get_reservations_on_day(date)
        return self.view_model.reservations(reservations)

    def update_reservation(self, id: str='', **reservation_info) -> dict:
        reservation = self.db_int.get_reservation(id)
        reservation.update_fields(**reservation_info)
        return self.view_model.reservation(reservation)

    def delete_reservation(self, id: str):
        self.db_int.delete_reservation(id)

    def get_time_slot(self, slot_id: UUID):
        pass

    def create_time_slot(self, time_slot_info: dict):
        pass

    def update_time_slot(self, time_slot):
        pass

    