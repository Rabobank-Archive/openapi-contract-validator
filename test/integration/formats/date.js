const c = require('ansi-colors');

const Validator = require('../../../src').Validator;

const newResponse = require('../../resources/response-wrapper');
const newContract = require('../../resources/contract-wrapper').oas3;

const validator = new Validator();
const expectedErrorThrown = new Error('Expected an error to be thrown');

describe(`The format property: date`, function() {
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
                'format': 'date',
            },
        });
    });

    it('throws an error when the value is not a valid date', function(done) {
        const response = newResponse({
            foo: 'not-a-date',
        });

        validator.validate(this.contract, response, this.options)
            .then(() => {
                throw expectedErrorThrown;
            }, (error) => {
                expect(c.unstyle(error.message))
                    .to.have.string('FORMAT should match format "date"');
            })
            .then(done, done);
    });

    it('passes when it the value is a valid date', function(done) {
        const response = newResponse({
            foo: '2020-01-10',
        });

        validator.validate(this.contract, response, this.options)
            .then(done, done);
    });
});
