import { APIGatewayEvent, Context, APIGatewayProxyCallback} from 'aws-lambda';
import Donation from './donation';

const listDonation = (email: string, callback: (err?: string, data?: Donation[]) => void) => {
    if (!email) {
        return callback("Email cannot be empty");
    }
    Donation.list(email, (err, data) => {
        callback(err, data);
    });
};

exports.handler = (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
    const email = event.queryStringParameters!.email as string;
    listDonation(email, (err, data) => {
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
                }),
            });
        }
    });
};

export default listDonation;
