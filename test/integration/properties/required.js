const c = require('ansi-colors');

const Validator = require('../../../src').Validator;

const newResponse = require('../../resources/response-wrapper');
const newContract = require('../../resources/contract-wrapper').oas3;

const validator = new Validator();
const expectedErrorThrown = new Error('Expected an error to be thrown');

describe('The required property', function() {
    it('throws an error when a required string is missing', function(done) {
        const options = {
            statusCode: 200,
            endpoint: '/endpoint',
            method: 'post',
            debug: false,
        };
        validator.validate(
            newContract({
                foo: {type: 'string'},
                bar: {type: 'string'},
            }, ['foo']),
            newResponse({
                // foo is missing here
                bar: '123',
            }),
            options,
        )
            .then(() => {
                done(expectedErrorThrown);
            })
            .catch((error) => {
                expect(c.unstyle(error.message))
                    .to.include(`REQUIRED should have required property 'foo'`);
                done();
            })
            .catch(done);
    });

    it('throws an error when a required object is missing', function(done) {
        const options = {
            statusCode: 200,
            endpoint: '/endpoint',
            method: 'post',
            debug: false,
        };
        validator.validate(
            newContract({
                foo: {type: 'object'},
                bar: {type: 'string'},
            }, ['foo']),
            newResponse({
                // foo is missing here
                bar: '123',
            }),
            options,
        )
            .then(() => {
                done(expectedErrorThrown);
            })
            .catch((error) => {
                expect(c.unstyle(error.message))
                    .to.include(`REQUIRED should have required property 'foo'`);
                done();
            })
            .catch(done);
    });

    it('throws an error when a required array is missing', function(done) {
        const options = {
            statusCode: 200,
            endpoint: '/endpoint',
            method: 'post',
            debug: false,
        };
        validator.validate(
            newContract({
                foo: {type: 'array'},
                bar: {type: 'string'},
            }, ['foo']),
            newResponse({
                // foo is missing here
                bar: '123',
            }),
            options,
        )
            .then(() => {
                done(expectedErrorThrown);
            })
            .catch((error) => {
                expect(c.unstyle(error.message))
                    .to.include(`REQUIRED should have required property 'foo'`);
                done();
            })
            .catch(done);
    });

    it('throws an error when a required number is missing', function(done) {
        const options = {
            statusCode: 200,
            endpoint: '/endpoint',
            method: 'post',
            debug: false,
        };
        validator.validate(
            newContract({
                foo: {type: 'number'},
                bar: {type: 'string'},
            }, ['foo']),
            newResponse({
                // foo is missing here
                bar: '123',
            }),
            options,
        )
            .then(() => {
                done(expectedErrorThrown);
            })
            .catch((error) => {
                expect(c.unstyle(error.message))
                    .to.include(`REQUIRED should have required property 'foo'`);
                done();
            })
            .catch(done);
    });

    it('passes when only required fields are present', function(done) {
        const options = {
            statusCode: 200,
            endpoint: '/endpoint',
            method: 'post',
            debug: false,
        };
        validator.validate(
            newContract({
                foo: {type: 'string'},
                bar: {type: 'string'},
                lorum: {
                    type: 'object',
                    required: [
                        'ipsum',
                    ],
                    properties: {
                        ipsum: {type: 'string'},
                        dolor: {type: 'string'},
                        sit: {type: 'string'},
                        amet: {type: 'string'},
                    },
                },
            }, ['foo', 'lorum']),
            newResponse({
                foo: '123',
                lorum: {
                    ipsum: '456',
                },
            }),
            options,
        )
            .then(done, done);
    });

    it('passes when the non-required parent of a required child is missing', function(done) {
        const options = {
            statusCode: 200,
            endpoint: '/endpoint',
            method: 'post',
            debug: false,
        };
        validator.validate(
            newContract({
                foo: {type: 'string'},
                bar: {type: 'string'},
                lorum: {
                    type: 'object',
                    required: [
                        'ipsum',
                    ],
                    properties: {
                        ipsum: {type: 'string'},
                        dolor: {type: 'string'},
                        sit: {type: 'string'},
                        amet: {type: 'string'},
                    },
                },
            }, ['foo']),
            newResponse({
                foo: '123',
            }),
            options,
        )
            .then(done, done);
    });

    it('throws when the required child of a non-required parent is missing', function(done) {
        const options = {
            statusCode: 200,
            endpoint: '/endpoint',
            method: 'post',
            debug: false,
        };
        validator.validate(
            newContract({
                foo: {type: 'string'},
                bar: {type: 'string'},
                lorum: {
                    type: 'object',
                    required: [
                        'ipsum',
                    ],
                    properties: {
                        ipsum: {type: 'string'},
                        dolor: {type: 'string'},
                        sit: {type: 'string'},
                        amet: {type: 'string'},
                    },
                },
            }, ['foo']),
            newResponse({
                foo: '123',
                lorum: {
                    // ipsum is missing here
                    dolor: 'foo',
                },
            }),
            options,
        )
            .then(() => {
                done(expectedErrorThrown);
            })
            .catch((error) => {
                expect(c.unstyle(error.message))
                    .to.include(`REQUIRED should have required property 'ipsum'`);
                done();
            })
            .catch(done);
    });

    it('passes when all fields are present', function(done) {
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
                bar: {
                    type: 'string',
                },
            }, ['foo']),
            newResponse({
                foo: '123',
                bar: '123',
            }),
            options,
        )
            .then(done, done);
    });
});
