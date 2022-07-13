import { APIGatewayEvent, Context, APIGatewayProxyCallback} from 'aws-lambda';
import Donation from './donation';

type ListCallback = (err?: string, data?: Donation[]) => void;
const listDonation = (params: any, callback: ListCallback) => {
    if (!params.email) {
        return callback("Email cannot be empty");
    }
    Donation.list(params.email, (err, data) => {
        callback(err, data);
    });
};

exports.handler = (event: APIGatewayEvent, context: Context, callback: APIGatewayProxyCallback) => {
    listDonation(event.queryStringParameters || {}, (err, data) => {
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
