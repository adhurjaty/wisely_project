from flask import Flask, request, g, redirect, make_response

from .controller_factory import ControllerFactory


INVENTORY_ROUTE = '/inventory'
RESERVATIONS_ROUTE = '/reservations'
RESERVATION_ROUTE = f'{RESERVATIONS_ROUTE}/<reservation_id>'

app = Flask(__name__)


def create_app() -> Flask:
    global app

    return app


@app.before_request
def set_controller():
    g.controller = ControllerFactory.create()


@app.route(INVENTORY_ROUTE, methods=['GET'])
def get_inventory():
    try:
        # get inventory from start to end dates 
        time_span = {
            'start': request.args.get('startTime'),
            'end': request.args.get('endTime')
        }

        if not time_span['start'] or time_span['end']:
            raise Exception('Must specify valid time span')

        inventory = g.controller.get_inventory(**time_span)
        return inventory
    except Exception as e:
        pass


@app.route(RESERVATIONS_ROUTE, methods=['POST'])
def make_reservation():
    try:
        slot_id = request.json.get('slotID')
        g.controller.make_reservation(slot_id, **request.json)
        return show_success()
    except Exception as e:
        pass


@app.route(RESERVATION_ROUTE, methods=['PUT'])
def update_reservation():
    try:
        g.controller.update_reservation()
    except Exception as e:
        pass


@app.route()


def show_success():
    return {
        'status': 'success'
    }
