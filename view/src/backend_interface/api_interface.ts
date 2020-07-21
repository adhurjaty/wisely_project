import InventorySpan from "../models/InventorySpan";
import DailyReservations from "../models/DailyReservations";
import Reservation from "../models/Reservation";
import { API_GET_RESERVATIONS, API_INVENTORIES, API_RESERVATIONS, API_RESERVATION } from "./api_endpoints";
import { formatDay } from "../helpers";


export interface StatusMessage {
    status: string,
    message: string
}

export async function getInventory(day: Date): Promise<InventorySpan[]> {
    let inv1 = new InventorySpan();
    inv1.id = 'foo';
    inv1.startTime = new Date(2020, 6, 20, 10, 0);
    inv1.endTime = new Date(2020, 6, 20, 17, 0);
    inv1.numParties = 3;

    let inv2 = new InventorySpan();
    inv2.id = 'bar';
    inv2.startTime = new Date(2020, 6, 20, 17, 0);
    inv2.endTime = new Date(2020, 6, 20, 22, 0);
    inv2.numParties = 6;

    return [inv1, inv2]
    // const req = new Request(API_INVENTORIES(formatDay(day)), {method: 'GET'});
    // const response = await fetch(req);
    // const respJson = await response.json() as any;

    // if(!respJson.inventories) {
    //     throw new Error("Invalid inventories response")
    // }

    // const inventories: InventorySpan[] = []
    // for (const respRow of respJson.inventories as any[]) {
    //     inventories.push(new InventorySpan().fromJson(respRow));
    // }
    // return inventories;
}

export async function createInventorySpan(): Promise<StatusMessage> {
    return {
        status: 'success',
        message: 'success'
    }
}

export async function makeReservation(reservation: Reservation): Promise<Reservation> {
    const req = new Request(API_RESERVATIONS, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(reservation.toJson())
    });
    const response = await fetch(req);
    const respJson = await response.json() as any;

    return new Reservation().fromJson(respJson);
}

export async function updateReservation(reservation: Reservation): Promise<Reservation> {
    debugger;
    const req = new Request(API_RESERVATION(reservation.id), {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(reservation.toJson())
    });
    const response = await fetch(req);
    const respJson = await response.json() as any;

    return new Reservation().fromJson(respJson);
}

export async function deleteReservation(reservation: Reservation): Promise<StatusMessage> {
    return {
        status: 'success',
        message: 'success'
    }
}

export async function getDailyReservations(day: Date): Promise<DailyReservations> {
    const invTask = getInventory(day);

    const reservations = await getDayReservations(day)
    const inv = await invTask;

    return new DailyReservations(inv, reservations);
}

async function getDayReservations(day: Date): Promise<Reservation[]> {
    // let r1 = new Reservation();
    // r1.id = 'a';
    // r1.name = 'Anil';
    // r1.email = 'anil@example.com';
    // r1.partySize = 3;
    // r1.time = new Date(2020, 7, 15, 12, 15);

    // let r2 = new Reservation();
    // r2.id = 'b';
    // r2.name = 'Aimee';
    // r2.email = 'aimee@example.com';
    // r2.partySize = 6;
    // r2.time = new Date(2020, 7, 15, 12, 15);

    // let r3 = new Reservation();
    // r3.id = 'c';
    // r3.name = 'Jordan';
    // r3.email = 'jordan@example.com';
    // r3.partySize = 2;
    // r3.time = new Date(2020, 7, 15, 18, 45);

    // return [r1, r2, r3]
    const req = new Request(API_GET_RESERVATIONS(formatDay(day)), {method: 'GET'});
    const response = await fetch(req);
    const respJson = await response.json() as any;

    if(!respJson.reservations) {
        throw new Error("Invalid reservations response")
    }

    const reservations: Reservation[] = []
    for (const respRow of respJson.reservations as any[]) {
        reservations.push(new Reservation().fromJson(respRow));
    }
    return reservations;
}
