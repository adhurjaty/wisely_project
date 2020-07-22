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
        tz = int(request.args.get('tz'))
        if not day:
            raise Exception('Must specify day')

        return g.controller.get_inventories(day, tz)
    except Exception as e:
        app.logger.error(str(e))
        return show_error(str(e))


@app.route(INVENTORY_ROUTE, methods=['POST'])
def set_inventories():
    try:
        inventory = request.json.get('inventory')
        tz = int(request.json.get('tz'))
        g.controller.set_inventories(inventory, tz)
        return show_success()
    except Exception as e:
        app.logger.error(str(e))
        return show_error(str(e))


@app.route(RESERVATIONS_ROUTE)
def get_reservations():
    try:
        day = request.args.get('day')
        tz = int(request.args.get('tz'))
        if not day:
            raise Exception('Must specify day')

        return g.controller.get_reservations(day, tz)
    except Exception as e:
        app.logger.error(str(e))
        return show_error(str(e))

@app.route(RESERVATIONS_ROUTE, methods=['POST'])
def make_reservation():
    try:
        return g.controller.make_reservation(**request.json)
    except Exception as e:
        app.logger.error(str(e))
        return show_error(str(e))


@app.route(RESERVATION_ROUTE, methods=['PATCH'])
def update_reservation(reservation_id):
    try:
        return g.controller.update_reservation(**request.json)
    except Exception as e:
        app.logger.error(str(e))
        return show_error(str(e))


@app.route(RESERVATION_ROUTE, methods=['DELETE'])
def delete_reservation(reservation_id):
    try:
        g.controller.delete_reservation(reservation_id)
        return show_success()
    except Exception as e:
        app.logger.error(str(e))
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
