from typing import List

from utils.util import format_date
from models.inventory import Inventory
from models.reservation import Reservation


class ViewModel:
    def inventories(self, invs: List[Inventory]) -> dict:
        return {
            'inventories': [self._inventory(inv) for inv in invs]
        } 
    
    def _inventory(self, inv: Inventory) -> dict:
        return {
            'id': str(inv.id),
            'startTime': format_date(inv.start_time),
            'endTime': format_date(inv.end_time),
            'numParties': inv.num_parties
        }

    def reservations(self, res_list: List[Reservation]) -> dict:
        return {
            'reservations': [self.reservation(res) for res in res_list]
        }

    def reservation(self, res: Reservation) -> dict:
        return {
            'id': str(res.id),
            'name': res.name,
            'email': res.email,
            'time': format_date(res.time),
            'partySize': res.party_size
        }
    
