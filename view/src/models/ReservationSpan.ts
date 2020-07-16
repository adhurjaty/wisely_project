import InventorySpan from "./InventorySpan";
import Reservation from "./Reservation";

export default class ReservationSpan {
    timeSpan: InventorySpan;
    reservations: Reservation[];

    constructor(ts: InventorySpan, res: Reservation[] = []) {
        this.timeSpan = ts;
        this.reservations = res;
    }
}