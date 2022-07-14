import AWS from 'aws-sdk';
import { SQSEvent } from 'aws-lambda';
import Donation from './donation';

const ses = new AWS.SES();

exports.handler = (event: SQSEvent) => {
    for (const i in event.Records) {
        const record = event.Records[i];
        const body = JSON.parse(record.body);
        const name = body.name ? ` <b>${body.name}</b>` : '';
        const amount = `<b>$${Number(body.amount).toLocaleString()}</b>`;
        const thankMsg = `Thank you${name}. Your donation of ${amount} made a lot of difference.`;
        const params = {
            Source: process.env.SENDER_EMAIL!,
            Destination: {
                ToAddresses: [body.email]
            },
            Message: {
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: thankMsg
                    }
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: 'Thank you for your donation'
                }
            }
        }
        const verifyEmail = () => {
            ses.verifyEmailIdentity({
                EmailAddress: body.email
            }, (err) => { console.error("Verify Email Error:", err); });
        };
        Donation.list(body.email, (err, data) => {
            if (err) { console.log(err); }
            else if (data!.length >= +process.env.DONATION_COUNT!) {
                ses.sendEmail(params, (err) => {
                    if (err) { verifyEmail(); }
                });
            }
        });
    }
};
