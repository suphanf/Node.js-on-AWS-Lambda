import express, { RequestHandler } from 'express';
import bodyParser from 'body-parser';

import createDonation from './create';
import listDonation from './list';

const createHandler: RequestHandler = (req, res) => {
    const donation = createDonation(req.body.email, req.body.name, req.body.amount);
    res.json(donation);
};

const listHandler: RequestHandler = (req, res) => {
    res.json(listDonation());
};

const app = express();
app.use(bodyParser.json());
app.post('/donations', createHandler);
app.get('/donations', listHandler);

app.listen(3000);
