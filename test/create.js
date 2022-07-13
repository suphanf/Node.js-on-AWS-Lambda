
const assert = require('assert');
const createDonation = require('../dist/create').default;
const Donation = require('../dist/donation').default;

const TEST_EMAIL = "supposed-to-be-unique@hard-to-guess.co"

const valid1 = {
    "email": TEST_EMAIL,
    "amount": 500,
};

const valid2 = {
    "email": TEST_EMAIL,
    "amount": 500,
    "name": "Test user",
};

const invalid1 = {
    "amount": 420.51,
    "name": "Test user",
}

const invalid2 = {
    "email": "test@google",
    "amount": 500,
    "name": "Test user",
}

const invalid3 = {
    "email": TEST_EMAIL,
    "name": "Test user",
}

const invalid4 = {
    "email": TEST_EMAIL,
    "amount": -40,
    "name": "Test user",
};

const invalid5 = {
    "email": TEST_EMAIL,
    "amount": 0,
    "name": "Test user",
};

const invalid6 = {
    "email": TEST_EMAIL,
    "amount": 300.333,
    "name": "Test user",
};


describe('Donation Create', function() {
    it('should accept a valid request with a name', function () {
        createDonation(valid1, (err, data) => {
            assert.equal(err, undefined);
            assert("email" in data);
            assert("amount" in data);
        });
    });
    it('should accept a valid request without a name', function () {
        createDonation(valid2, (err, data) => {
            assert.equal(err, undefined);
            assert("email" in data);
            assert("amount" in data);
            assert("name" in data);
        });
    });
    it('should reject a request without an email', function () {
        createDonation(invalid1, (err, data) => {
            assert(err.length > 0);
            assert.equal(data, undefined);
        });
    });
    it('should reject a request with an invalid email', function () {
        createDonation(invalid2, (err, data) => {
            assert(err.length > 0);
            assert.equal(data, undefined);
        });
    });
    it('should reject a request without an amount', function () {
        createDonation(invalid3, (err, data) => {
            assert(err.length > 0);
            assert.equal(data, undefined);
        });
    });
    it('should reject a request with a negative amount', function () {
        createDonation(invalid4, (err, data) => {
            assert(err.length > 0);
            assert.equal(data, undefined);
        });
    });
    it('should reject a request with zero amount', function () {
        createDonation(invalid5, (err, data) => {
            assert(err.length > 0);
            assert.equal(data, undefined);
        });
    });
    it('should reject a request with more than 2 decimal places of amount', function () {
        createDonation(invalid6, (err, data) => {
            assert(err.length > 0);
            assert.equal(data, undefined);
        });
    });
});

after(() => {
    setTimeout(() => {
        Donation.delete(TEST_EMAIL);
    }, 2000);
});
