import { APIGatewayEvent, Context, APIGatewayProxyCallback} from 'aws-lambda';
import Donation from './donation';

type SearchCallback = (err?: string, data?: Donation[], email?: string, timestamp?: string) => void;
const searchDonation = (limit: number, email: string, timestamp: string, callback: SearchCallback) => {
    Donation.search(limit, email, timestamp, (err, data, email, timestamp) => {
        callback(err, data, email, timestamp);
    });
};

exports.handler = (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
    const limit = +event.queryStringParameters!.limit!;
    const email = event.queryStringParameters!.email as string;
    const timestamp = event.queryStringParameters!.timestamp as string;
    searchDonation(limit, email, timestamp, (err, data, email, timestamp) => {
        if (err) {
            callback(null, {
                statusCode: 400,
                body: JSON.stringify({ message: err }),
            });
        } else {
            callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    data: data,
                    last_email: email,
                    last_timestamp: timestamp,
                }),
            });
        }
    });
};

export default searchDonation;
