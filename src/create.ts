import { APIGatewayEvent, Context, APIGatewayProxyCallback } from 'aws-lambda';
import Donation from './donation';

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
const amountRegex = /^[0-9]+(\.[0-9]{0,2})?$/;
type Callback = (err?: string, data?: Donation) => void;
const createDonation = (body: any, callback: Callback) => {
    const email: string = body.email;
    const name: string = body.name;
    const amount: string = body.amount;
    if (!emailRegex.test(email)) {
        return callback("Email is empty or invalid");
    } else if (!amountRegex.test(amount) || +amount <= 0) {
        return callback("Amount must be positive with at most 2 demical places");
    }
    const donation = new Donation(email, name, +amount);
    donation.save(callback);
};

exports.handler = (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
    const body = JSON.parse(event.body || "{}");
    createDonation(body, (err, data) => {
        if (err) {
            callback(null, {
                statusCode: 400,
                body: JSON.stringify({ message: err }),
            });
        } else {
            callback(null, {
                statusCode: 200,
                body: JSON.stringify(data),
            });
        }
    });
};

export default createDonation;
