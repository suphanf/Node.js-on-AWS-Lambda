import AWS from 'aws-sdk';

const dynamoDB = new AWS.DynamoDB();
const sqs = new AWS.SQS();

type SearchCallback = (err?: string, data?: Donation[], email?: string, timestamp?: string) => void;

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
        };
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

    static notify(accountId: string, donation: Donation, callback: (err: string) => void) {
        const params = {
            QueueUrl: `${sqs.endpoint.href}${accountId}/donation-confirmation`,
            DelaySeconds: 10,
            MessageBody: JSON.stringify(donation),
        };
        sqs.sendMessage(params, (err) => {
            if (err) {
                callback(err.message);
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
        dynamoDB.query(params, (err, data) => {
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

    static search(limit: number, email: string, timestamp: string, callback: SearchCallback) {
        let startKey = undefined;
        if (email && timestamp) {
            startKey = {
                email: { S: email },
                timestamp0: { S: timestamp },
            }
        }

        let params = {
            TableName: 'Donation',
            Limit: limit ? limit : 20,
            ExclusiveStartKey: startKey,
        };

        dynamoDB.scan(params, (err, data) => {
            if (err) {
                callback(err.message);
            } else {
                const donations: Donation[] = [];
                for (const i in data.Items) {
                    const item = data.Items[+i];
                    donations.push(Donation.fromAttributeMap(item));
                }
                let last_email = undefined;
                let last_timestamp = undefined;
                if (data.LastEvaluatedKey) {
                    last_email = data.LastEvaluatedKey.email.S;
                    last_timestamp = data.LastEvaluatedKey.timestamp0.S;
                }
                callback(undefined, donations, last_email, last_timestamp);
            }
        });
    }

    // for testing purposes only
    static delete(email: string) {
        this.list(email, (err, data) => {
            for (const i in data) {
                const params = {
                    TableName: 'Donation',
                    Key: {
                        email: { S: data[+i].email },
                        timestamp0: { S: data[+i].timestamp.toISOString() },
                    }
                };
                dynamoDB.deleteItem(params, () => {});
            }
        });
    }
}

export default Donation;
