from datetime import datetime
from uuid import UUID

class Controller:


    def get_inventories(self, day):
        pass

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

    