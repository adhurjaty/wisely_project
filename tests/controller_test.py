import pytest
from datetime import datetime
import arrow

from .mocks import MockObject
from controller.controller import Controller
from models.inventory import Inventory


@pytest.fixture('function')
def mock_db_interface():
    return MockObject()


@pytest.fixture('function')
def mock_view_model():
    return MockObject()


def test_get_inventories(mock_db_interface, mock_view_model):
    validations = MockObject()
    validations.date = None
    validations.inventories = None

    inventories = [
        Inventory(start_time=datetime(2020, 7, 15, 13, 0),
            end_time=datetime(2020, 7, 15, 17, 0),
            num_parties=4),
        Inventory(start_time=datetime(2020, 7, 15, 17, 0),
            end_time=datetime(2020, 7, 15, 22, 0),
            num_parties=4)
    ]

    def db_get_inv(date):
        validations.date = date
        return inventories

    def vm_inventories(invs):
        validations.inventories = invs
        return {'foo': 'bar'}

    mock_db_interface.get_inventories = db_get_inv
    mock_view_model.inventories = vm_inventories

    controller = Controller(mock_db_interface, mock_view_model)
    inv_resp = controller.get_inventories('2020-7-15')

    assert validations.date == arrow.get('2020-7-15').datetime
    assert validations.inventories == inventories
    assert inv_resp == {'foo': 'bar'}


