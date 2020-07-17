import { SLOT_DURATION } from "./constants";

export function range(start: number, end?: number, step?: number): number[] {
    if(!end) {
        end = start;
        start = 0;
    }
    if(!step) {
        step = 1;
    }

    const r = [];
    for (let i = start; i < end; i+=step) {
        r.push(i);
    }

    return r;
}

export function formatTime(date: Date): string {
    const hour = date.getHours();
    const minutes = date.getMinutes();
    let minStr: string = (minutes < 10 ? '0' : '') + minutes;

    return `${hour % 12 || 12}:${minStr} ${hour > 11 ? 'PM': 'AM'}`
}