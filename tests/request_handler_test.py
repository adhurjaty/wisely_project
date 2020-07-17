import pytest
from urllib.parse import urlencode

from .mocks import MockObject
import controller.request_handler as rh
from controller.controller_factory import ControllerFactory


@pytest.fixture(scope='function')
def controller_mock():
    return MockObject()


@pytest.fixture(scope='function')
def test_client(controller_mock):
    ControllerFactory.create = lambda: controller_mock
    app = rh.create_app()

    testing_client = app.test_client()

    ctx = app.app_context()
    ctx.push()

    yield testing_client

    ctx.pop()


def test_get_inventory(test_client, controller_mock):
    validations = MockObject()
    validations.day = None

    def get_inv(day):
        validations.day = day
        return {
            'foo': 'bar'
        }

    controller_mock.get_inventories = get_inv

    params = {'day': '2020-7-15'}
    resp = test_client.get(f'{rh.INVENTORY_ROUTE}?{urlencode(params)}', follow_redirects=False)

    assert validations.day == '2020-7-15'
    assert resp.status_code == 200
    assert resp.json['foo'] == 'bar'


def test_get_inventory_no_day(test_client, controller_mock):
    validations = MockObject()
    validations.day = None

    def get_inv(day):
        validations.day = day
        return {
            'foo': 'bar'
        }

    controller_mock.get_inventories = get_inv

    resp = test_client.get(rh.INVENTORY_ROUTE, follow_redirects=False)

    assert resp.status_code == 400
    assert resp.json['message'] == 'Must specify day'


def test_get_reservations(test_client, controller_mock):
    validations = MockObject()
    validations.day = None

    def get_res(day):
        validations.day = day
        return {
            'foo': 'bar'
        }

    controller_mock.get_reservations = get_res

    params = {'day': '2020-7-15'}
    resp = test_client.get(f'{rh.RESERVATIONS_ROUTE}?{urlencode(params)}', follow_redirects=False)

    assert validations.day == '2020-7-15'
    assert resp.status_code == 200
    assert resp.json['foo'] == 'bar'


def test_get_reservations_no_day(test_client, controller_mock):
    validations = MockObject()
    validations.day = None

    def get_res(day):
        validations.day = day
        return {
            'foo': 'bar'
        }

    controller_mock.get_reservations = get_res

    resp = test_client.get(rh.RESERVATIONS_ROUTE, follow_redirects=False)

    assert resp.status_code == 400
    assert resp.json['message'] == 'Must specify day'
