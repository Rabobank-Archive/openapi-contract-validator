const c = require('ansi-colors');

const Validator = require('../../../src').Validator;

const newResponse = require('../../resources/response-wrapper');
const newContract = require('../../resources/contract-wrapper').oas3;

const validator = new Validator();
const expectedErrorThrown = new Error('Expected an error to be thrown');

describe(`The format property`, function() {
    it(`throws when the format is unkown`, async function() {
        const options = {
            statusCode: 200,
            endpoint: '/endpoint',
            method: 'post',
            debug: false,
        };
        await validator.validate(
            newContract({
                foo: {
                    type: 'string',
                    format: 'unkownFormat',
                },
            }),
            newResponse({
                foo: 'bar',
            }),
            options,
        )
            .then(() => {
                throw expectedErrorThrown;
            })
            .catch((error) => {
                expect(c.unstyle(error.message))
                    .to.have.string('unknown format "unkownFormat" is used in schema '
                        + 'at path "#/properties/foo"');
            });
    });

    it(`passes when the value matches the format`, async function() {
        const options = {
            statusCode: 200,
            endpoint: '/endpoint',
            method: 'post',
            debug: false,
        };
        await validator.validate(
            newContract({
                foo: {
                    type: 'string',
                    format: 'date',
                },
            }),
            newResponse({
                foo: '2020-01-16',
            }),
            options,
        );
    });
});
