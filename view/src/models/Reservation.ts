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
    partySize: number = 1;
    time: Date = new Date(0);

    fromJson(resp: ReservationResponse): Reservation {
        this.id = resp.id;
        this.name = resp.name;
        this.email = resp.email;
        this.partySize = resp.partySize;
        this.time = new Date(resp.time);
        return this
    }

    toJson() {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            party_size: this.partySize,
            time: this.time.toISOString()
        }
    }
}