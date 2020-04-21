const c = require('ansi-colors');

const Validator = require('../../../src').Validator;

const newResponse = require('../../resources/response-wrapper');
const newContract = require('../../resources/contract-wrapper').oas3;

const validator = new Validator();
const expectedErrorThrown = new Error('Expected an error to be thrown');

describe(`The minItems property`, function() {
    beforeEach(function() {
        this.options = {
            statusCode: 200,
            endpoint: '/endpoint',
            method: 'post',
            debug: false,
        };

        this.contract = newContract({
            'foo': {
                'type': 'array',
                'minItems': 2,
                'items': {
                    'type': 'object',
                },
            },
        });
    });

    it('throws an error when it has too few items', function(done) {
        const response = newResponse({
            foo: [{}],
        });

        validator.validate(this.contract, response, this.options)
            .then(() => {
                throw expectedErrorThrown;
            }, (error) => {
                expect(c.unstyle(error.message))
                    .to.have.string('MINITEMS should NOT have fewer than 2 items');
            })
            .then(done, done);
    });

    it('passes when it has the minimum amount of items', function(done) {
        const response = newResponse({
            foo: [{}, {}],
        });

        validator.validate(this.contract, response, this.options)
            .then(done, done);
    });

    it('passes when it has more than the minimum amount of items', function(done) {
        const response = newResponse({
            foo: [{}, {}, {}, {}, {}, {}, {}, {}],
        });

        validator.validate(this.contract, response, this.options)
            .then(done, done);
    });
});
