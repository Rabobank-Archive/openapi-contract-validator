/* eslint-disable mocha/no-setup-in-describe */

const c = require('ansi-colors');

const Validator = require('../../../src').Validator;

const newResponse = require('../../resources/response-wrapper');
const newContract = require('../../resources/contract-wrapper').oas3;

const validator = new Validator();
const expectedErrorThrown = new Error('Expected an error to be thrown');

describe('The type property', function() {
    context('type: object', function() {
        expectToThrowOnTypes('object', [
            'string',
            'number',
            'array',
            'integer',
            'boolean',
        ]);
    });

    context('type: array', function() {
        expectToThrowOnTypes('array', [
            'string',
            'number',
            'object',
            'integer',
        ]);
    });

    context('type: number', function() {
        expectToThrowOnTypes('number', [
            'string',
            'array',
            'object',
        ]);
    });

    context('type: string', function() {
        expectToThrowOnTypes('string', [
            'number',
            'array',
            'object',
            'integer',
        ]);
    });

    context('type: integer', function() {
        expectToThrowOnTypes('integer', [
            'string',
            'number',
            'array',
            'object',
        ]);
    });

    context('type: boolean', function() {
        expectToThrowOnTypes('boolean', [
            'string',
            'number',
            'array',
            'integer',
            'object',
        ]);

        describe('Truthy values', function() {
            it('throws an error when it encounters a truthy string', function(done) {
                const options = {
                    statusCode: 200,
                    endpoint: '/endpoint',
                    method: 'post',
                    debug: false,
                };
                validator.validate(
                    newContract({
                        foo: {type: 'boolean'},
                    }),
                    newResponse({
                        foo: 'true',
                    }),
                    options,
                )
                    .then(() => {
                        done(expectedErrorThrown);
                    })
                    .catch((error) => {
                        expect(c.unstyle(error.message))
                            .to.include(`TYPE should be boolean`);
                        done();
                    })
                    .catch(done);
            });

            it('throws an error when it encounters a truthy number', function(done) {
                const options = {
                    statusCode: 200,
                    endpoint: '/endpoint',
                    method: 'post',
                    debug: false,
                };
                validator.validate(
                    newContract({
                        foo: {type: 'boolean'},
                    }),
                    newResponse({
                        foo: 1,
                    }),
                    options,
                )
                    .then(() => {
                        done(expectedErrorThrown);
                    })
                    .catch((error) => {
                        expect(c.unstyle(error.message))
                            .to.include(`TYPE should be boolean`);
                        done();
                    })
                    .catch(done);
            });
        });

        describe('Falsy values', function() {
            it('throws an error when it encounters a falsy string', function(done) {
                const options = {
                    statusCode: 200,
                    endpoint: '/endpoint',
                    method: 'post',
                    debug: false,
                };
                validator.validate(
                    newContract({
                        foo: {type: 'boolean'},
                    }),
                    newResponse({
                        foo: 'false',
                    }),
                    options,
                )
                    .then(() => {
                        done(expectedErrorThrown);
                    })
                    .catch((error) => {
                        expect(c.unstyle(error.message))
                            .to.include(`TYPE should be boolean`);
                        done();
                    })
                    .catch(done);
            });

            it('throws an error when it encounters a falsy number', function(done) {
                const options = {
                    statusCode: 200,
                    endpoint: '/endpoint',
                    method: 'post',
                    debug: false,
                };
                validator.validate(
                    newContract({
                        foo: {type: 'boolean'},
                    }),
                    newResponse({
                        foo: 0,
                    }),
                    options,
                )
                    .then(() => {
                        done(expectedErrorThrown);
                    })
                    .catch((error) => {
                        expect(c.unstyle(error.message))
                            .to.include(`TYPE should be boolean`);
                        done();
                    })
                    .catch(done);
            });
        });
    });

    it('throws if the type is unkown', function(done) {
        const options = {
            statusCode: 200,
            endpoint: '/endpoint',
            method: 'post',
            debug: false,
        };
        validator.validate(
            newContract({
                foo: {type: 'unkown'},
            }),
            newResponse({
                foo: 123.123,
            }),
            options,
        )
            .then(() => {
                done(expectedErrorThrown);
            })
            .catch((error) => {
                expect(c.unstyle(error.message))
                    .to.include(`Type "unkown" is not a valid type`);
                done();
            })
            .catch(done);
    });
});


/**
 * @param {string} type
 * @param {string[]} throwOn
 */
function expectToThrowOnTypes(type, throwOn) {
    const examples = {
        array: [],
        object: {},
        number: 123.1,
        integer: 123,
        string: 'foo',
        boolean: true,
    };

    throwOn.forEach((badType) => {
        it(`throws when the value is type ${badType}`, function(done) {
            const options = {
                statusCode: 200,
                endpoint: '/endpoint',
                method: 'post',
                debug: false,
            };
            validator.validate(
                newContract({
                    foo: {type: type},
                }),
                newResponse({
                    foo: examples[badType],
                }),
                options,
            )
                .then(() => {
                    done(expectedErrorThrown);
                })
                .catch((error) => {
                    expect(c.unstyle(error.message))
                        .to.include(`TYPE should be ${type}`);
                    done();
                })
                .catch(done);
        });
    });

    it(`passes when the value is type ${type}`, function(done) {
        const options = {
            statusCode: 200,
            endpoint: '/endpoint',
            method: 'post',
            debug: false,
        };
        validator.validate(
            newContract({
                foo: {type: type},
            }),
            newResponse({
                foo: examples[type],
            }),
            options,
        )
            .then(() => {
                done();
            })
            .catch(done);
    });
}
