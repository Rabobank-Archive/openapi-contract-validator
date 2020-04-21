const c = require('ansi-colors');

const Validator = require('../../../src').Validator;

const newResponse = require('../../resources/response-wrapper');
const newContract = require('../../resources/contract-wrapper').oas3;

const validator = new Validator();
const expectedErrorThrown = new Error('Expected an error to be thrown');

describe(`The uniqueItems property`, function() {
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
                'uniqueItems': true,
                'items': {
                    'type': 'string',
                },
            },
        });
    });

    it('throws an error when it has repeated items', function(done) {
        const response = newResponse({
            foo: ['bar', 'bar', 'foo'],
        });

        validator.validate(this.contract, response, this.options)
            .then(() => {
                throw expectedErrorThrown;
            }, (error) => {
                expect(c.unstyle(error.message))
                    .to.have.string('UNIQUEITEMS should NOT have duplicate items');
            })
            .then(done, done);
    });

    it('passes when all items are unique', function(done) {
        const response = newResponse({
            foo: ['bar', 'ba', 'b'],
        });

        validator.validate(this.contract, response, this.options)
            .then(done, done);
    });
});
