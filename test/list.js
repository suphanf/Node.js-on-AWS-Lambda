
const assert = require('assert');
const createDonation = require('../dist/create').default;
const listDonation = require('../dist/list').default;
const Donation = require('../dist/donation').default;

const TEST_EMAIL = "supposed-to-be-unique2@hard-to-guess.co"

const valid1 = {
    "email": TEST_EMAIL,
    "amount": 500,
    "name": "Test user",
};

const valid2 = {
    "email": TEST_EMAIL,
    "amount": 370.83,
    "name": "Test user",
};

before(() => {
    createDonation(valid1, () => {});
    createDonation(valid2, () => {});
});

describe('Donation List', function() {
    it('should reject when not providing an email', function () {
        listDonation({}, (err, data) => {
            assert(err.length > 0);
            assert.equal(data, undefined);
        });
    });
    it('should have data when asking for existing data', function () {
        const params = {
            "email": TEST_EMAIL
        };
        listDonation(params, (err, data) => {
            assert.equal(err, undefined);
            assert.equal(data.length, 2);
        });
    });
    it('should not have data when asking for non-existing data', function () {
        const params = {
            "email": "supposed-to-be-non-existent@hard-to-guess.co"
        };
        listDonation(params, (err, data) => {
            assert.equal(err, undefined);
            assert.equal(data.length, 0);
        });
    });
});

after(() => {
    setTimeout(() => {
        Donation.delete(TEST_EMAIL);
    }, 2000);
});
