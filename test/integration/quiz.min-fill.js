const Validator = require('../../src').Validator;

const newResponse = require('../resources/response-wrapper');
const contract = require('../resources/api/quiz/quiz.oas3.json');
const response = newResponse(require('../resources/response/quiz.min-fill.json'));

const validator = new Validator();
const expectedErrorThrown = new Error('Expected an error to be thrown');

const path = require('path');

describe('Quiz min fill', function() {
    it('should fail when the requireAllFields flag is set', function(done) {
        const options = {
            requireAllFields: true,
            statusCode: 200,
            endpoint: '/endpoint',
            method: 'post',
            debug: false,
        };

        validator
            .validate(
                contract,
                response,
                options,
            )
            .then(() => {
                done(expectedErrorThrown);
            }, (error) => {
                done();
            });
    });

    it('Happy flow with concatArrays flag set', function(done) {
        const options = {
            concatArrays: true,
            statusCode: 200,
            endpoint: '/endpoint',
            method: 'post',
            debug: false,
        };

        validator
            .validate(
                path.join(__dirname, '../resources/api/quiz/quiz.oas3.json'),
                response,
                options,
            )
            .then(done, done);
    });

    it('Happy flow with validateValues unset', function(done) {
        const options = {
            validateValues: false,
            statusCode: 200,
            endpoint: '/endpoint',
            method: 'post',
            debug: false,
        };

        validator
            .validate(
                contract,
                response,
                options,
            )
            .then(done, done);
    });

    it('Happy flow without flags set', function(done) {
        const options = {
            statusCode: 200,
            endpoint: '/endpoint',
            method: 'post',
            debug: false,
        };

        validator
            .validate(
                contract,
                response,
                options,
            )
            .then(done, done);
    });
});
