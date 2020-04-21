const c = require('ansi-colors');

const Validator = require('../../../src').Validator;

const newResponse = require('../../resources/response-wrapper');
const newContract = require('../../resources/contract-wrapper').oas3;

const validator = new Validator();
const expectedErrorThrown = new Error('Expected an error to be thrown');

describe(`The maximum property`, function() {
    describe('With inclusive maximum (exclusiveMaximum: false)', function() {
        beforeEach(function() {
            this.contract = newContract({
                'foo': {
                    'type': 'number',
                    'maximum': 10,
                },
            });
        });

        it('throws an error when the value is above the upper edge', function(done) {
            const response = newResponse({
                'foo': 11,
            });

            validator.validate(this.contract, response, this.options)
                .then(() => {
                    throw expectedErrorThrown;
                }, (error) => {
                    expect(c.unstyle(error.message))
                        .to.have.string('MAXIMUM should be <= 10');
                })
                .then(done, done);
        });

        it('passes when the value is on the upper edge', function(done) {
            const response = newResponse({
                'foo': 10,
            });

            validator.validate(this.contract, response, this.options)
                .then(done, done);
        });
    });

    describe('With exclusive maximum (exclusiveMaximum: true)', function() {
        beforeEach(function() {
            this.contract = newContract({
                'foo': {
                    'type': 'number',
                    'maximum': 10,
                    'exclusiveMaximum': true,
                },
            });
        });

        it('throws an error when the value is on the upper edge', function(done) {
            const response = newResponse({
                'foo': 10,
            });

            validator.validate(this.contract, response, this.options)
                .then(() => {
                    throw expectedErrorThrown;
                }, (error) => {
                    expect(c.unstyle(error.message))
                        .to.have.string('EXCLUSIVEMAXIMUM should be < 10');
                })
                .then(done, done);
        });

        it('passes when the value is below the upper edge', function(done) {
            const response = newResponse({
                'foo': 9,
            });

            validator.validate(this.contract, response, this.options)
                .then(done, done);
        });
    });
});
