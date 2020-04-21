const Validator = require('../../../src').Validator;

const newResponse = require('../../resources/response-wrapper');
const newContract = require('../../resources/contract-wrapper').oas3;

const validator = new Validator();
const expectedErrorThrown = new Error('Expected an error to be thrown');

describe(`The multipleOf property`, function() {
    it(`throws when the value is not a multiple of`, function(done) {
        const options = {
            statusCode: 200,
            endpoint: '/endpoint',
            method: 'post',
            debug: false,
        };
        validator.validate(
            newContract({
                foo: {
                    type: 'number',
                    multipleOf: 2,
                },
            }),
            newResponse({
                foo: 11,
            }),
            options,
        )
            .then(() => {
                done(expectedErrorThrown);
            })
            .catch(() => {
                done();
            });
    });

    it(`passes when the value is a multiple of`, function(done) {
        const options = {
            statusCode: 200,
            endpoint: '/endpoint',
            method: 'post',
            debug: false,
        };
        validator.validate(
            newContract({
                foo: {
                    type: 'number',
                    multipleOf: 2,
                },
            }),
            newResponse({
                foo: 5006,
            }),
            options,
        )
            .then(done, done);
    });
});
