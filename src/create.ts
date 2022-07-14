import { APIGatewayEvent, Context, APIGatewayProxyCallback } from 'aws-lambda';
import AWS from 'aws-sdk';
import Donation from './donation';

const sqs = new AWS.SQS();
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
const amountRegex = /^[0-9]+(\.[0-9]{0,2})?$/;

type CreateCallback = (err?: string, data?: Donation) => void;
const createDonation = (body: any, callback: CreateCallback) => {
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

const notify = (accountId: string, donation: Donation, callback: (err: string) => void) => {
    const params = {
        QueueUrl: `${sqs.endpoint.href}${accountId}/${process.env.SQS_NAME}`,
        DelaySeconds: 10,
        MessageBody: JSON.stringify(donation),
    };
    sqs.sendMessage(params, (err) => {
        if (err) {
            callback(err.message);
        }
    });
}

exports.handler = (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
    const body = JSON.parse(event.body || "{}");
    createDonation(body, (err, data) => {
        if (err) {
            console.error("Create Error:", body);
            callback(null, {
                statusCode: 400,
                body: JSON.stringify({ message: err }),
            });
        } else {
            const accountId = context.invokedFunctionArn.split(':')[4];
            notify(accountId, data!, (err) => {
                console.error("Notify Error:", err);
            });
            callback(null, {
                statusCode: 200,
                body: JSON.stringify(data),
            });
        }
    });
};

export default createDonation;
