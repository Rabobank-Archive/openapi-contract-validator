const c = require('ansi-colors');

const Validator = require('../../../src').Validator;

const newResponse = require('../../resources/response-wrapper');
const newContract = require('../../resources/contract-wrapper').oas3;

const validator = new Validator();
const expectedErrorThrown = new Error('Expected an error to be thrown');

describe(`The minimum property`, function() {
    beforeEach(function() {
        this.options = {
            statusCode: 200,
            endpoint: '/endpoint',
            method: 'post',
            debug: false,
        };
    });

    it('can handle a minimum of 0', function(done) {
        const contract = newContract({
            'foo': {
                type: 'number',
                minimum: 0,
            },
        });
        const response = newResponse({
            'foo': -1,
        });

        validator.validate(contract, response, this.options)
            .then(() => {
                throw expectedErrorThrown;
            }, (error) => {
                expect(c.unstyle(error.message))
                    .to.have.string('MINIMUM should be >= 0');
            })
            .then(done, done);
    });

    describe('With inclusive minimum (exclusiveMinimum: false)', function() {
        beforeEach(function() {
            this.contract = newContract({
                'foo': {
                    'type': 'number',
                    'minimum': 10,
                },
            });
        });

        it('throws an error when the value is under the lower edge', function(done) {
            const response = newResponse({
                'foo': 9,
            });

            validator.validate(this.contract, response, this.options)
                .then(() => {
                    throw expectedErrorThrown;
                }, (error) => {
                    expect(c.unstyle(error.message))
                        .to.have.string('MINIMUM should be >= 10');
                })
                .then(done, done);
        });

        it('passes when the value is on the lower edge', function(done) {
            const response = newResponse({
                'foo': 10,
            });

            validator.validate(this.contract, response, this.options)
                .then(done, done);
        });
    });


    describe('With exclusive minimum (exclusiveMinimum: true)', function() {
        beforeEach(function() {
            this.contract = newContract({
                'foo': {
                    'type': 'number',
                    'minimum': 10,
                    'exclusiveMinimum': true,
                },
            });
        });

        it('throws an error when the value is on the lower edge', function(done) {
            const response = newResponse({
                'foo': 10,
            });

            validator.validate(this.contract, response, this.options)
                .then(() => {
                    throw expectedErrorThrown;
                }, (error) => {
                    expect(c.unstyle(error.message))
                        .to.have.string('EXCLUSIVEMINIMUM should be > 10');
                })
                .then(done, done);
        });

        it('passes when the value is above the lower edge', function(done) {
            const response = newResponse({
                'foo': 11,
            });

            validator.validate(this.contract, response, this.options)
                .then(done, done);
        });
    });
});
