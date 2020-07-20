interface ReservationResponse {
    id: string;
    name: string;
    email: string;
    partySize: number;
    time: string;
}

export default class Reservation {
    id: string = "";
    name: string = "";
    email: string = "";
    partySize: number = 0;
    time: Date = new Date();

    fromJson(resp: ReservationResponse): Reservation {
        this.id = resp.id;
        this.name = resp.name;
        this.email = resp.email;
        this.partySize = resp.partySize;
        this.time = new Date(resp.time);
        return this
    }
}