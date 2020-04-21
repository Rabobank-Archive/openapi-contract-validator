const c = require('ansi-colors');

const Validator = require('../../../src').Validator;

const newResponse = require('../../resources/response-wrapper');
const newContract = require('../../resources/contract-wrapper').oas3;

const validator = new Validator();
const expectedErrorThrown = new Error('Expected an error to be thrown');

describe(`The maxProperties property`, function() {
    beforeEach(function() {
        this.options = {
            statusCode: 200,
            endpoint: '/endpoint',
            method: 'post',
            debug: false,
        };

        this.contract = newContract({
            'foo': {
                'type': 'object',
                'maxProperties': 2,
                'properties': {
                    'alpha': {
                        'type': 'string',
                    },
                    'beta': {
                        'type': 'string',
                    },
                    'gamma': {
                        'type': 'string',
                    },
                },
            },
        });
    });

    it('throws an error when it has too many properties', function(done) {
        const response = newResponse({
            foo: {
                alpha: 'A',
                beta: 'B',
                gamma: 'C',
            },
        });

        validator.validate(this.contract, response, this.options)
            .then(() => {
                throw expectedErrorThrown;
            }, (error) => {
                expect(c.unstyle(error.message))
                    .to.have.string('MAXPROPERTIES should NOT have more than 2 properties');
            })
            .then(done, done);
    });

    it('passes when it has the maximum amount of properties', function(done) {
        const response = newResponse({
            foo: {
                alpha: 'A',
                beta: 'B',
            },
        });

        validator.validate(this.contract, response, this.options)
            .then(done, done);
    });

    it('passes when it has less than the maximum amount of properties', function(done) {
        const response = newResponse({
            foo: {},
        });

        validator.validate(this.contract, response, this.options)
            .then(done, done);
    });
});

