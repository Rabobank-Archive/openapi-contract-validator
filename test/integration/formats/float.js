const c = require('ansi-colors');

const Validator = require('../../../src').Validator;

const newResponse = require('../../resources/response-wrapper');
const newContract = require('../../resources/contract-wrapper').oas3;

const validator = new Validator();
const expectedErrorThrown = new Error('Expected an error to be thrown');

describe(`The format property: float`, function() {
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
                'format': 'float',
            },
        });
    });

    it('throws an error when the value is not a valid float', function(done) {
        const response = newResponse({
            foo: Infinity,
        });

        validator.validate(this.contract, response, this.options)
            .then(() => {
                throw expectedErrorThrown;
            }, (error) => {
                expect(c.unstyle(error.message))
                    .to.have.string('MAXIMUM should be <= 3.402823669209385e+38');
            })
            .then(done, done);
    });

    it('passes when it the value is a valid float', function(done) {
        const response = newResponse({
            foo: 123.12,
        });

        validator.validate(this.contract, response, this.options)
            .then(done, done);
    });
});
