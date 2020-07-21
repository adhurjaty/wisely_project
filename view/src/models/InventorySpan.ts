interface InventoryResponse {
    id: string;
    startTime: string;
    endTime: string;
    numParties: number;
}

export default class InventorySpan {
    id: string = "";
    startTime: Date = new Date();
    endTime: Date = new Date();
    numParties: number = 1;

    fromJson(resp: InventoryResponse): InventorySpan {
        this.id = resp.id;
        this.startTime = new Date(resp.startTime);
        this.endTime = new Date(resp.endTime);
        this.numParties = resp.numParties;

        return this;
    }

    toJson(): any {
        return {
            id: this.id,
            start_time: this.startTime,
            end_time: this.endTime,
            num_parties: this.numParties
        }
    }

    copy() {
        const newOne = new InventorySpan();

        newOne.id = this.id;
        newOne.startTime = this.startTime;
        newOne.endTime = this.endTime;
        newOne.numParties = this.numParties;

        return newOne;
    }
}