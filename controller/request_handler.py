from flask import Flask, request, g, redirect, make_response
from flask_cors import CORS

from .controller_factory import ControllerFactory


INVENTORY_ROUTE = '/inventories'
RESERVATIONS_ROUTE = '/reservations'
RESERVATION_ROUTE = f'{RESERVATIONS_ROUTE}/<reservation_id>'

app = Flask(__name__)


def create_app() -> Flask:
    global app

    CORS(app, origins=[
        r'https?:\/\/localhost[^\.]*$',
        r'https?:\/\/ui[^\.]*$'])

    return app


@app.before_request
def set_controller():
    g.controller = ControllerFactory.create()


@app.route(INVENTORY_ROUTE)
def get_inventories():
    try:
        day = request.args.get('day')
        if not day:
            raise Exception('Must specify day')

        return g.controller.get_inventories(day)
    except Exception as e:
        return show_error(str(e))


@app.route(RESERVATIONS_ROUTE)
def get_reservations():
    try:
        day = request.args.get('day')
        if not day:
            raise Exception('Must specify day')

        return g.controller.get_reservations(day)
    except Exception as e:
        return show_error(str(e))

@app.route(RESERVATIONS_ROUTE, methods=['POST'])
def make_reservation():
    try:
        return g.controller.make_reservation(**request.json)
    except Exception as e:
        return show_error(str(e))


@app.route(RESERVATION_ROUTE, methods=['PUT'])
def update_reservation():
    try:
        return g.controller.update_reservation(**request.json)
    except Exception as e:
        return show_error(str(e))


def show_success():
    return {
        'status': 'success',
        'message': 'success'
    }

def show_error(error_text, code=400):
    return {
        'status': 'error',
        'message': error_text
    }, code
