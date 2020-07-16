import InventorySpan from "../models/InventorySpan";
import ReservationSpan from "../models/ReservationSpan";
import Reservation from "../models/Reservation";


export interface StatusMessage {
    status: string,
    message: string
}

export async function getInventory(day: Date): Promise<InventorySpan[]> {
    let inv1 = new InventorySpan();
    inv1.id = 'foo',
    inv1.startTime = new Date(2020, 7, 15, 10, 0),
    inv1.endTime = new Date(2020, 7, 15, 17, 0),
    inv1.numParties = 3;

    let inv2 = new InventorySpan();
    inv1.id = 'bar',
    inv1.startTime = new Date(2020, 7, 15, 17, 0),
    inv1.endTime = new Date(2020, 7, 15, 22, 0),
    inv1.numParties = 6;

    return [inv1, inv2]
}

export async function createInventorySpan(): Promise<StatusMessage> {
    return {
        status: 'success',
        message: 'success'
    }
}

export async function makeReservation(): Promise<StatusMessage> {
    return {
        status: 'success',
        message: 'success'
    }
}

export async function getReservationSpans(day: Date): Promise<ReservationSpan[]> {
    const invTask = getInventory(day);

    const reservations = await getDayReservations(day)
    const inv = await invTask;

    return buildReservationSpans(inv, reservations)
}

async function getDayReservations(day: Date): Promise<Reservation[]> {
    let r1 = new Reservation();
    r1.id = 'a';
    r1.name = 'Anil';
    r1.email = 'anil@example.com';
    r1.partySize = 3;
    r1.time = new Date(2020, 7, 15, 12, 15);

    let r2 = new Reservation();
    r1.id = 'b';
    r1.name = 'Aimee';
    r1.email = 'aimee@example.com';
    r1.partySize = 6;
    r1.time = new Date(2020, 7, 15, 12, 15);

    let r3 = new Reservation();
    r1.id = 'c';
    r1.name = 'Jordan';
    r1.email = 'jordan@example.com';
    r1.partySize = 2;
    r1.time = new Date(2020, 7, 15, 18, 45);

    return [r1, r2, r3]
}

function buildReservationSpans(spans: InventorySpan[], reservations: Reservation[]): 
    ReservationSpan[]
{
    const resSpans = spans.map(s => new ReservationSpan(s))
    for (const res of reservations) {
        let span = resSpans.find(s => 
            s.timeSpan.startTime <= res.time && res.time < s.timeSpan.endTime);
        if(!span) {
            throw new Error("Reservation does not exist in valid time span")
        }
        span.reservations.push(res);
    }
    
    return resSpans
}