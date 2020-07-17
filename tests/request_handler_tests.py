import pytest

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
