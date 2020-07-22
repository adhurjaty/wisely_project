import arrow
from datetime import datetime, timedelta
from time import timezone
from typing import List
from uuid import UUID

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

    def get_inventories(self, day: str, tz_offset: int) -> List[dict]:
        date = self._get_tz_day(day, tz_offset)
        inventories = self.db_int.get_inventories(date)
        return self.view_model.inventories(inventories)

    def set_inventories(self, inv_list: List[dict], tz: int):
        if len(inv_list) == 0:
            raise Exception('Invalid inventory list - empty')

        inventories = [Inventory(**inv) for inv in inv_list]
        date = self._get_tz_day(inventories[0].start_time, tz)
        self.db_int.delete_inventories_on_day(date)
        self.db_int.list_insert(inventories)

    def _get_tz_day(self, time: str, tz_offset: int) -> datetime:
        date = arrow.get(time).date()
        dt = datetime(date.year, date.month, date.day)
        return dt + timedelta(hours=tz_offset)

    def make_reservation(self, **reservation_info):
        reservation = Reservation(**reservation_info)
        reservation = self.db_int.insert(reservation)
        return self.view_model.reservation(reservation)

    def get_reservations(self, day: str, tz: int) -> List[dict]:
        date = arrow.get(day).datetime + timedelta(hours=tz)
        reservations = self.db_int.get_reservations_on_day(date)
        return self.view_model.reservations(reservations)

    def update_reservation(self, id: str='', **reservation_info) -> dict:
        reservation = self.db_int.get_reservation(id)
        reservation.update_fields(**reservation_info)
        self.db_int.save()
        return self.view_model.reservation(reservation)

    def delete_reservation(self, id: str):
        self.db_int.delete_reservation(id)

    