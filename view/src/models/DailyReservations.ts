import InventorySpan from "./InventorySpan";
import Reservation from "./Reservation";

export default class DailyReservations {
    private reservationByTime: Map<string, Reservation[]>;
    private spanByHour: Map<string, InventorySpan>;

    constructor(private timeSpans: InventorySpan[], private reservations: Reservation[]) {
        this.spanByHour = this.buildSpanMapping(timeSpans);
        this.reservationByTime = this.buildReservationMapping(reservations);
    }

    private buildSpanMapping(spans: InventorySpan[]): Map<string, InventorySpan> {
        const mapping = new Map<string, InventorySpan>();
        for(const span of spans) {
            let timeKey = this.spanKey(span);
            mapping.set(timeKey, span);
        }
        return mapping;
    }

    private spanKey(span: InventorySpan): string {
        return `${span.startTime.getHours()}|${span.endTime.getHours()}`;
    }

    private fromSpanKey(key: string): [number, number] {
        return key.split('|').map(parseInt) as [number, number];
    }

    private buildReservationMapping(reservations: Reservation[]): Map<string, Reservation[]> {
        const mapping = new Map<string, Reservation[]>();
        for(const res of reservations) {
            let timeKey = this.dateToSlotKey(res.time);
            if(!mapping.has(timeKey)) {
                mapping.set(timeKey, []);
            }
            mapping.get(timeKey)?.push(res)
        }

        return mapping;
    }

    private dateToSlotKey(date: Date): string {
        return `${date.getHours()|date.getMinutes()}`;
    }

    
}
    // export function slotKeysForHour(hour: number): string[] {
    //     let slots = 60 / SLOT_DURATION;
    //     let keys: string[] = []
    //     for (let i = 0; i < slots; i++) {
    //         let d = new Date(0, 0, 0, hour);
    //         d.setMinutes(i * SLOT_DURATION);
    //         keys.push(dateToSlotKey(d));
    //     }
    
    //     return keys;
    // }