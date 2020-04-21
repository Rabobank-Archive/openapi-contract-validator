const Validator = require('../../../src').Validator;

const newResponse = require('../../resources/response-wrapper');
const newContract = require('../../resources/contract-wrapper').oas3;

const validator = new Validator();
const expectedErrorThrown = new Error('Expected an error to be thrown');

describe(`The pattern property`, function() {
    it(`throws when the value does not match the pattern`, function(done) {
        const options = {
            statusCode: 200,
            endpoint: '/endpoint',
            method: 'post',
            debug: false,
        };
        validator.validate(
            newContract({
                foo: {
                    type: 'string',
                    pattern: 'he+y',
                },
            }),
            newResponse({
                foo: 'not-valid',
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

    it(`passes when the value matches the pattern`, function(done) {
        const options = {
            statusCode: 200,
            endpoint: '/endpoint',
            method: 'post',
            debug: false,
        };
        validator.validate(
            newContract({
                foo: {
                    type: 'string',
                    pattern: 'he+y',
                },
            }),
            newResponse({
                foo: 'heeeeeeey',
            }),
            options,
        )
            .then(done, done);
    });
});
