import express, { RequestHandler } from 'express';
import bodyParser from 'body-parser';

import createDonation from './create';
import listDonation from './list';

const createHandler: RequestHandler = (req, res) => {
    createDonation(req.body.email, req.body.name, req.body.amount, (err, data) => {
        if (err) { res.json(err); }
        else { res.json(data); }
    });
};

const listHandler: RequestHandler = (req, res) => {
    listDonation(req.query.email as string, (err, data) => {
        if (err) { res.json(err); }
        else { res.json(data); }
    });
};

const app = express();
app.use(bodyParser.json());
app.post('/donations', createHandler);
app.get('/donations', listHandler);

app.listen(3000);
