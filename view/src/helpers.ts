export function range(start: number, end?: number, step?: number): number[] {
    if(!end) {
        end = start;
        start = 0;
    }
    if(!step) {
        step = 1;
    }

    const r = [];
    for (let i = start; i <= end; i+=step) {
        r.push(i);
    }

    return r;
}