const donationList: Donation[] = [];

class Donation {
    private timestamp: Date;

    constructor(private email: string, private name: string, private amount: number) {
        this.timestamp = new Date();
    }

    get getEmail() { return this.email; }
    get getName() { return this.name; }
    get getAmount() { return this.amount; }
    get getTimestamp() { return this.timestamp; }

    save() {
        donationList.push(this);
    }

    static list() {
        return donationList;
    }
}

export default Donation;
