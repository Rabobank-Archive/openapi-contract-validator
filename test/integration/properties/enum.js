const c = require('ansi-colors');

const Validator = require('../../../src').Validator;

const newResponse = require('../../resources/response-wrapper');
const newContract = require('../../resources/contract-wrapper').oas3;

const validator = new Validator();
const expectedErrorThrown = new Error('Expected an error to be thrown');

[
    'enum',
    'x-extensible-enum',
].forEach((enumProperty) => {
    describe(`The ${enumProperty} property`, function() {
        it(`throws when the value is not in ${enumProperty}`, async function() {
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
                        [enumProperty]: [
                            'a',
                            'b',
                        ],
                    },
                }),
                newResponse({
                    foo: 'not-in-enum',
                }),
                options,
            )
                .then(() => {
                    throw expectedErrorThrown;
                })
                .catch((error) => {
                    expect(c.unstyle(error.message))
                        .to.have.string(
                            'Unexpected value, should be equal to one of the allowed values');
                });
        });

        it(`passes when the value is in ${enumProperty}`, async function() {
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
                        [enumProperty]: [
                            'a',
                            'b',
                        ],
                    },
                }),
                newResponse({
                    foo: 'a',
                }),
                options,
            );
        });

        it(`throws when the value is not in ${enumProperty} with type: number`, async function() {
            const options = {
                statusCode: 200,
                endpoint: '/endpoint',
                method: 'post',
                debug: false,
            };
            await validator.validate(
                newContract({
                    foo: {
                        type: 'number',
                        [enumProperty]: [
                            1,
                            2,
                        ],
                    },
                }),
                newResponse({
                    foo: 99999999,
                }),
                options,
            )
                .then(() => {
                    throw expectedErrorThrown;
                })
                .catch((error) => {
                    expect(c.unstyle(error.message))
                        .to.have.string(
                            'Unexpected value, should be equal to one of the allowed values');
                });
        });

        it(`throws when the value is not in ${enumProperty} with type: array`, async function() {
            const options = {
                statusCode: 200,
                endpoint: '/endpoint',
                method: 'post',
                debug: false,
            };
            await validator.validate(
                newContract({
                    foo: {
                        type: 'array',
                        [enumProperty]: [
                            [1, 2],
                            [2, 3],
                        ],
                    },
                }),
                newResponse({
                    foo: ['not-in-enum'],
                }),
                options,
            )
                .then(() => {
                    throw expectedErrorThrown;
                })
                .catch((error) => {
                    expect(c.unstyle(error.message))
                        .to.have.string('left.charCodeAt is not a function');
                });
        });

        it(`throws when the value is not in ${enumProperty} with type: object`, async function() {
            const options = {
                statusCode: 200,
                endpoint: '/endpoint',
                method: 'post',
                debug: false,
            };
            await validator.validate(
                newContract({
                    foo: {
                        type: 'object',
                        [enumProperty]: [
                            {a: 1},
                            {b: 2},
                        ],
                    },
                }),
                newResponse({
                    foo: {a: 'not-in-enum'},
                }),
                options,
            )
                .then(() => {
                    throw expectedErrorThrown;
                })
                .catch((error) => {
                    expect(c.unstyle(error.message))
                        .to.have.string(
                            'Unexpected value, should be equal to one of the allowed values');
                });
        });
    });
});


/* eslint-disable-next-line mocha/max-top-level-suites */
describe('The enum property in combination with the x-extensible-enum property', function() {
    it(`passes when the value is in enum`, async function() {
        const options = {
            statusCode: 200,
            endpoint: '/endpoint',
            method: 'post',
            debug: false,
        };
        await validator.validate(
            newContract({
                foo: {
                    'type': 'string',
                    'enum': [
                        'a',
                        'b',
                    ],
                    'x-extensible-enum': [
                        'b',
                        'c',
                    ],
                },
            }),
            newResponse({
                foo: 'a',
            }),
            options,
        );
    });

    it(`passes when the value is in x-extensible-enum`, async function() {
        const options = {
            statusCode: 200,
            endpoint: '/endpoint',
            method: 'post',
            debug: false,
        };
        await validator.validate(
            newContract({
                foo: {
                    'type': 'string',
                    'enum': [
                        'a',
                        'b',
                    ],
                    'x-extensible-enum': [
                        'b',
                        'c',
                    ],
                },
            }),
            newResponse({
                foo: 'a',
            }),
            options,
        );
    });
});
