interface InventoryResponse {
    id: string;
    startTime: Date;
    endTime: Date;
    numParties: number;
}

export default class InventorySpan {
    id: string = "";
    startTime: Date = new Date();
    endTime: Date = new Date();
    numParties: number = 0;

    fromJson(resp: InventoryResponse): InventorySpan {
        this.id = resp.id;
        this.startTime = resp.startTime;
        this.endTime = resp.endTime;
        this.numParties = resp.numParties;

        return this;
    }

}