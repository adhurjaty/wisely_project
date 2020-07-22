import InventorySpan from "../models/InventorySpan";
import DailyReservations from "../models/DailyReservations";
import Reservation from "../models/Reservation";
import { API_GET_RESERVATIONS, API_INVENTORIES, API_DAY_INVENTORIES, API_RESERVATIONS, API_RESERVATION } from "./api_endpoints";
import { formatDay } from "../helpers";


export interface StatusMessage {
    status: string,
    message: string
}

export async function getInventory(day: Date): Promise<InventorySpan[]> {
    const tz = day.getTimezoneOffset() / 60;
    const req = new Request(API_DAY_INVENTORIES(formatDay(day), tz), {method: 'GET'});
    const response = await fetch(req);
    const respJson = await response.json() as any;

    if(!respJson.inventories) {
        throw new Error("Invalid inventories response")
    }

    const inventories: InventorySpan[] = []
    for (const respRow of respJson.inventories as any[]) {
        inventories.push(new InventorySpan().fromJson(respRow));
    }
    return inventories;
}

export async function setInventory(spans: InventorySpan[]): Promise<StatusMessage> {
    const tz = new Date().getTimezoneOffset() / 60;
    const req = new Request(API_INVENTORIES, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            inventory: spans.map(s => s.toJson()),
            tz: tz
        })
    });
    const response = await fetch(req);
    return await response.json() as StatusMessage;
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
    const req = new Request(API_RESERVATION(reservation.id), {
        method: 'DELETE'
    });
    
    await fetch(req);

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
    const tz = day.getTimezoneOffset() / 60;
    const req = new Request(API_GET_RESERVATIONS(formatDay(day), tz), {method: 'GET'});
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
