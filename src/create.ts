import { APIGatewayEvent } from 'aws-lambda';
import Donation from './donation';

const createDonation = (email: string, name: string, amount: number) => {
    const donation = new Donation(email, name, amount);
    donation.save();
    return donation;
};

exports.handler = async (event: APIGatewayEvent) => {
    const body = JSON.parse(event.body || "");
    const donation = createDonation(body.email, body.name, body.amount);
    const response = {
        statusCode: 200,
        body: JSON.stringify(donation),
    };
    return response;
};

export default createDonation;
