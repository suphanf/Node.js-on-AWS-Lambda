import { APIGatewayEvent } from 'aws-lambda';
import Donation from './donation';

const createDonation = (email: string, name: string, amount: number) => {
    const donation = new Donation(email, name, amount);
    donation.save();
    return donation;
};

exports.handler = async (event: APIGatewayEvent) => {
    const response = {
        statusCode: 200,
        body: JSON.stringify('Donation - Create'),
    };
    return response;
};

export default createDonation;
