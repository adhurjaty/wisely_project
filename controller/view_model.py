from typing import List

from utils.util import format_date
from models.inventory import Inventory

class ViewModel:
    def inventories(self, invs: List[Inventory]):
        return [self._inventory(inv) for inv in invs]
    
    def _inventory(self, inv: Inventory):
        return {
            'id': str(inv.id),
            'startTime': format_date(inv.start_time),
            'endTime': format_date(inv.end_time),
            'numParties': inv.num_parties
        }
    
    