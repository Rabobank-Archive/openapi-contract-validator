const c = require('ansi-colors');

const Validator = require('../../../src').Validator;

const newResponse = require('../../resources/response-wrapper');
const newContract = require('../../resources/contract-wrapper').oas3;

const validator = new Validator();
const expectedErrorThrown = new Error('Expected an error to be thrown');

describe(`The minProperties property`, function() {
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
                'minProperties': 2,
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
                    'delta': {
                        'type': 'string',
                    },
                },
            },
        });
    });

    it('throws an error when it has too few properties', function(done) {
        const response = newResponse({
            foo: {
                alpha: 'A',
            },
        });

        validator.validate(this.contract, response, this.options)
            .then(() => {
                throw expectedErrorThrown;
            }, (error_) => {
                expect(c.unstyle(error_.message))
                    .to.have.string('MINPROPERTIES should NOT have fewer than 2 properties');
            })
            .then(done, done);
    });

    it('passes when it has the minimum amount of properties', function(done) {
        const response = newResponse({
            foo: {
                alpha: 'A',
                beta: 'B',
            },
        });

        validator.validate(this.contract, response, this.options)
            .then(done, done);
    });

    it('passes when it has more than the minimum amount of properties', function(done) {
        const response = newResponse({
            foo: {
                alpha: 'A',
                beta: 'B',
                gamma: 'G',
                delta: 'D',
            },
        });

        validator.validate(this.contract, response, this.options)
            .then(done, done);
    });
});

