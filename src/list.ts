import { APIGatewayEvent, Context, APIGatewayProxyCallback} from 'aws-lambda';
import Donation from './donation';

type Callback = (err?: string, data?: Donation[]) => void;
const listDonation = (email: string, callback: Callback) => {
    Donation.list(email, (err, data) => {
        callback(err, data);
    });
};

exports.handler = (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
    const email = event.queryStringParameters!.email as string;
    listDonation(email, (err, data) => {
        callback(err, {
            statusCode: 200,
            body: JSON.stringify(data),
        });
    });
};

export default listDonation;
