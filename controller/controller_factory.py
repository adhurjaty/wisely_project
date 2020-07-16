from .controller import Controller


class ControllerFactory:
    @staticmethod
    def create():
        return Controller()