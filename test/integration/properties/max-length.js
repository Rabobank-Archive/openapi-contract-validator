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
                'maxLength': 5,
            },
        });
    });

    it('throws an error when it has too many characters', function(done) {
        const response = newResponse({
            foo: '123456',
        });

        validator.validate(this.contract, response, this.options)
            .then(() => {
                throw expectedErrorThrown;
            }, (error) => {
                expect(c.unstyle(error.message))
                    .to.have.string('MAXLENGTH should NOT be longer than 5 characters');
            })
            .then(done, done);
    });

    it('passes when it has the maximum amount of characters', function(done) {
        const response = newResponse({
            foo: '54321',
        });

        validator.validate(this.contract, response, this.options)
            .then(done, done);
    });

    it('passes when it has less than the maximum amount of characters', function(done) {
        const response = newResponse({
            foo: '1',
        });

        validator.validate(this.contract, response, this.options)
            .then(done, done);
    });
});
