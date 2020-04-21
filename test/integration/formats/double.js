const c = require('ansi-colors');

const Validator = require('../../../src').Validator;

const newResponse = require('../../resources/response-wrapper');
const newContract = require('../../resources/contract-wrapper').oas3;

const validator = new Validator();
const expectedErrorThrown = new Error('Expected an error to be thrown');

describe(`The format property: double`, function() {
    beforeEach(function() {
        this.options = {
            statusCode: 200,
            endpoint: '/endpoint',
            method: 'post',
            debug: false,
        };

        this.contract = newContract({
            'foo': {
                'type': 'number',
                'format': 'double',
            },
        });
    });

    it('throws an error when the value is not a valid double', function(done) {
        const response = newResponse({
            foo: Infinity,
        });

        validator.validate(this.contract, response, this.options)
            .then(() => {
                throw expectedErrorThrown;
            }, (error) => {
                expect(c.unstyle(error.message))
                    .to.have.string('MAXIMUM should be <= 1.7976931348623157e+308');
            })
            .then(done, done);
    });

    it('passes when it the value is a valid double', function(done) {
        const response = newResponse({
            foo: 123.12,
        });

        validator.validate(this.contract, response, this.options)
            .then(done, done);
    });
});
