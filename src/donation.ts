import AWS from 'aws-sdk';

const dynamoDB = new AWS.DynamoDB();

class Donation {
    private timestamp: Date;

    constructor(private email: string, private name: string, private amount: number) {
        this.timestamp = new Date();
    }

    static fromAttributeMap(item: AWS.DynamoDB.AttributeMap) {
        const donation = new Donation(item.email.S!, item.name.S!, +item.amount.S!);
        donation.timestamp = new Date(item.timestamp0.S!);
        return donation;
    }

    get getEmail() { return this.email; }
    get getName() { return this.name; }
    get getAmount() { return this.amount; }
    get getTimestamp() { return this.timestamp; }

    save(callback: (err?: string, data?: Donation) => void) {
        // timestamp is a reserved keyword in DynamoDB
        const params = {
            TableName: 'Donation',
            Item: {
                'email': { S: this.email },
                'name': { S: '' },
                'amount': { S: this.amount.toString() },
                'timestamp0': { S: this.timestamp.toISOString() },
            }
        }
        if (this.name) {
            params.Item.name.S = this.name;
        }
        dynamoDB.putItem(params, (err) => {
            if (err) {
                callback(err.message);
            } else {
                callback(undefined, this);
            }
        });
    }

    static list(email: string, callback: (err?: string, data?: Donation[]) => void) {
        const params = {
            TableName: 'Donation',
            KeyConditionExpression: 'email = :email',
            ExpressionAttributeValues: {
                ':email': { S: email }
            },
        };
        return dynamoDB.query(params, (err, data) => {
            if (err) {
                callback(err.message);
            } else {
                const donations: Donation[] = [];
                for (const i in data.Items) {
                    const item = data.Items[+i];
                    donations.push(Donation.fromAttributeMap(item));
                }
                callback(undefined, donations);
            }
        });
    }
}

export default Donation;
