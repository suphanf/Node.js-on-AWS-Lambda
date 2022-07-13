
const assert = require('assert');
const createDonation = require('../dist/create').default;
const searchDonation = require('../dist/search').default;
const Donation = require('../dist/donation').default;

const TEST_EMAIL3 = "supposed-to-be-unique3@hard-to-guess.co"
const TEST_EMAIL4 = "supposed-to-be-unique4@hard-to-guess.co"

const valid1 = {
    "email": TEST_EMAIL3,
    "amount": 500,
    "name": "Test user",
};

const valid2 = {
    "email": TEST_EMAIL3,
    "amount": 370.83,
    "name": "Test user",
};

const valid3 = {
    "email": TEST_EMAIL4,
    "amount": 55.78,
    "name": "Another test user",
};

before(() => {
    Donation.delete(TEST_EMAIL3);
    Donation.delete(TEST_EMAIL4);
    createDonation(valid1, () => {});
    createDonation(valid2, () => {});
    createDonation(valid3, () => {});
});

describe('Donation Search', function() {
    it('should have all data when not providing a limit', function () {
        searchDonation({}, (err, data) => {
            assert.equal(err, undefined);
            assert(data.length >= 3);
        });
    });
    it('should have limited data when providing a limit', function () {
        const params = { limit: 2 };
        searchDonation(params, (err, data, email, timestamp) => {
            assert.equal(err, undefined);
            assert.equal(data.length, 2);
            assert(email.length > 0);
            assert(timestamp.length > 0);
        });
    });
});

after(() => {
    setTimeout(() => {
        Donation.delete(TEST_EMAIL3);
        Donation.delete(TEST_EMAIL4);
    }, 2000);
});
