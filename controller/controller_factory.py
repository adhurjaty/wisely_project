from .controller import Controller
from .view_model import ViewModel
from models.db_interface import DBInterface


class ControllerFactory:
    @staticmethod
    def create():
        vm = ViewModel()
        db_int = DBInterface()
        return Controller(db_int, vm)