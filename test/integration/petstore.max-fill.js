const Validator = require('../../src').Validator;

const newResponse = require('../resources/response-wrapper');
const contract = require('../resources/api/PetStore/petstore.oas3.json');
const response = newResponse(require('../resources/response/petstore.max-fill.json'));

const validator = new Validator();

describe('Petstore max fill', function() {
    it('Happy flow with requireAllFields flag set', function(done) {
        const options = {
            requireAllFields: true,
            statusCode: 200,
            endpoint: '/pets',
            method: 'get',
            debug: false,
        };
        validator.validate(
            contract,
            response,
            options,
        ).then(done, done);
    });

    it('Happy flow with concatArrays flag set', function(done) {
        const options = {
            concatArrays: true,
            statusCode: 200,
            endpoint: '/pets',
            method: 'get',
            debug: false,
        };
        validator.validate(
            contract,
            response,
            options,
        ).then(done, done);
    });

    it('Happy flow with validateValues unset', function(done) {
        const options = {
            validateValues: false,
            statusCode: 200,
            endpoint: '/pets',
            method: 'get',
            debug: false,
        };
        validator.validate(
            contract,
            response,
            options,
        ).then(done, done);
    });

    it('Happy flow without flags set', function(done) {
        const options = {
            statusCode: 200,
            endpoint: '/pets',
            method: 'get',
            debug: false,
        };
        validator.validate(
            contract,
            response,
            options,
        ).then(done, done);
    });
});
