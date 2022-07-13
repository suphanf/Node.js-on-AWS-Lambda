import { APIGatewayEvent, Context, APIGatewayProxyCallback } from 'aws-lambda';
import Donation from './donation';

type Callback = (err?: string, data?: Donation) => void;
const createDonation = (email: string, name: string, amount: number, callback: Callback) => {
    const donation = new Donation(email, name, amount);
    donation.save(callback);
};

exports.handler = (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
    const body = JSON.parse(event.body || "");
    createDonation(body.email, body.name, body.amount, (err, data) => {
        callback(err, {
            statusCode: 200,
            body: JSON.stringify(data),
        });
    });
};

export default createDonation;
