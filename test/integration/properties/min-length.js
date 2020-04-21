const c = require('ansi-colors');

const Validator = require('../../../src').Validator;

const newResponse = require('../../resources/response-wrapper');
const newContract = require('../../resources/contract-wrapper').oas3;

const validator = new Validator();
const expectedErrorThrown = new Error('Expected an error to be thrown');

describe(`The maxLength property`, function() {
    beforeEach(function() {
        this.options = {
            statusCode: 200,
            endpoint: '/endpoint',
            method: 'post',
            debug: false,
        };

        this.contract = newContract({
            'foo': {
                'type': 'string',
                'minLength': 5,
            },
        });
    });

    it('throws an error when it has too few characters', function(done) {
        const response = newResponse({
            foo: '1234',
        });

        validator.validate(this.contract, response, this.options)
            .then(() => {
                throw expectedErrorThrown;
            }, (error) => {
                expect(c.unstyle(error.message))
                    .to.have.string('MINLENGTH should NOT be shorter than 5 characters');
            })
            .then(done, done);
    });

    it('passes when it has the minimum amount of characters', function(done) {
        const response = newResponse({
            foo: '12345',
        });

        validator.validate(this.contract, response, this.options)
            .then(done, done);
    });

    it('passes when it has more than the minimum amount of characters', function(done) {
        const response = newResponse({
            foo: '1234567890',
        });

        validator.validate(this.contract, response, this.options)
            .then(done, done);
    });
});
