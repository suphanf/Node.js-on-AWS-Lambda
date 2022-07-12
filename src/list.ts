import { APIGatewayEvent } from 'aws-lambda';
import Donation from './donation';

const listDonation = () => {
    return Donation.list();
};

exports.handler = async (event: APIGatewayEvent) => {
    const response = {
        statusCode: 200,
        body: JSON.stringify('Donation - List'),
    };
    return response;
};

export default listDonation;
