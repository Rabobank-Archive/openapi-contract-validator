const Validator = require('../../../src').Validator;

const newResponse = require('../../resources/response-wrapper');
const newContract = require('../../resources/contract-wrapper').oas3;

const validator = new Validator();
const expectedErrorThrown = new Error('Expected an error to be thrown');

// SKIP: Not implemented. Issue 1235671
/* eslint-disable-next-line mocha/no-setup-in-describe */
describe.skip(`The nullable property`, function() {
    it(`throws when the value is null with nullable: false`, function(done) {
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
                },
            }),
            newResponse({
                foo: null,
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

    it(`passes when the value is null with nullable: true`, function(done) {
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
                    nullable: true,
                },
            }),
            newResponse({
                foo: null,
            }),
            options,
        )
            .then(done, done);
    });

    it(`passes when the value is not-null with nullable: true`, function(done) {
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
                    nullable: true,
                },
            }),
            newResponse({
                foo: 'not-null',
            }),
            options,
        )
            .then(done, done);
    });
});
