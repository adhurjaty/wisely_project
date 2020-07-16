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
        return `${date.getHours()}|${date.getMinutes()}`;
    }

    getSlotReservations(hour: number, minute: number): Reservation[] {
        debugger;
        const key = this.dateToSlotKey(new Date(0, 0, 0, hour, minute));
        return this.reservationByTime.get(key) || [];
    }

    getInventoryAtHour(hour: number): InventorySpan | null {
        const keys = Array.from(this.spanByHour.keys());
        const key = keys.find(k => {
            const [start, end] = this.fromSpanKey(k);
            return start <= hour && hour < end;
        });
        
        if(!key) {
            return null;
        }
        return this.spanByHour.get(key) as InventorySpan;
    }

    getOpenCloseHours(): [number, number] {
        const minHour = Math.min(...this.timeSpans.map(s => s.startTime.getHours()));
        const maxHour = Math.max(...this.timeSpans.map(s => s.endTime.getHours()));
        return [minHour, maxHour];
    }
}
