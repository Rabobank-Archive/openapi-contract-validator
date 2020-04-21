const c = require('ansi-colors');

const Validator = require('../../../src').Validator;

const newResponse = require('../../resources/response-wrapper');
const newContract = require('../../resources/contract-wrapper').oas3;

const validator = new Validator();
const expectedErrorThrown = new Error('Expected an error to be thrown');

describe(`The format property: int32`, function() {
    beforeEach(function() {
        this.options = {
            statusCode: 200,
            endpoint: '/endpoint',
            method: 'post',
            debug: false,
        };

        this.contract = newContract({
            'foo': {
                'type': 'integer',
                'format': 'int32',
            },
        });
    });

    it('throws an error when the value is not a valid int32', function(done) {
        const response = newResponse({
            foo: Infinity,
        });

        validator.validate(this.contract, response, this.options)
            .then(() => {
                throw expectedErrorThrown;
            }, (error) => {
                expect(c.unstyle(error.message))
                    .to.have.string('MAXIMUM should be <= 2147483647');
            })
            .then(done, done);
    });

    it('passes when it the value is a valid int32', function(done) {
        const response = newResponse({
            foo: 123,
        });

        validator.validate(this.contract, response, this.options)
            .then(done, done);
    });
});
