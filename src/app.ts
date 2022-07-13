import express, { RequestHandler } from 'express';
import bodyParser from 'body-parser';

import createDonation from './create';
import listDonation from './list';
import searchDonation from './search';

const createHandler: RequestHandler = (req, res) => {
    createDonation(req.body.email, req.body.name, req.body.amount, (err, data) => {
        if (err) { res.status(400).json(err); }
        else { res.json(data); }
    });
};

const listHandler: RequestHandler = (req, res) => {
    listDonation(req.query.email as string, (err, data) => {
        if (err) { res.status(400).json(err); }
        else { res.json({ data: data }); }
    });
};

const searchHandler: RequestHandler = (req, res) => {
    searchDonation(+req.query.limit!, req.query.email as string, req.query.timestamp as string,
        (err, data, email, timestamp) => {
        if (err) { res.status(400).json(err); }
        else {
            res.json({
                data: data,
                last_email: email,
                last_timestamp: timestamp,
            });
        }
    });
};

const app = express();
app.use(bodyParser.json());
app.post('/donations', createHandler);
app.get('/donations', listHandler);
app.get('/donations/search', searchHandler);

app.listen(3000);
