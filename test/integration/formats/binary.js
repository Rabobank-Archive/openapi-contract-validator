const Validator = require('../../../src').Validator;

const newResponse = require('../../resources/response-wrapper');
const newContract = require('../../resources/contract-wrapper').oas3;

const validator = new Validator();

describe(`The format property: binary`, function() {
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
                'format': 'binary',
            },
        });
    });

    it('always passes as it can\'t be asserted', function(done) {
        const response = newResponse({
            foo: 'fwjaojanvpunq89cu9urpyh9php9xum032uir80fj',
        });

        validator.validate(this.contract, response, this.options)
            .then(done, done);
    });
});
