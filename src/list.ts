import { APIGatewayEvent } from 'aws-lambda';

exports.handler = async (event: APIGatewayEvent) => {
    const response = {
        statusCode: 200,
        body: JSON.stringify('Donation - List'),
    };
    return response;
};
