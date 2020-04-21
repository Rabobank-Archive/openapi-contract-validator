const Validator = require('../../src').Validator;

const newResponse = require('../resources/response-wrapper');
const contract = require('../resources/api/quiz/quiz.oas3.json');
const response = newResponse(require('../resources/response/quiz.max-fill.json'));

const validator = new Validator();

describe('Quiz max fill', function() {
    it('Happy flow with requireAllFields flag set', function(done) {
        const options = {
            requireAllFields: true,
            statusCode: 200,
            endpoint: '/endpoint',
            method: 'post',
            debug: false,
        };

        validator.validate(
            contract,
            response,
            options,
        ).then(done, done);
    });

    it('Error flow with requireAllFields flag set', function(done) {
        const options = {
            requireAllFields: true,
            statusCode: 200,
            endpoint: '/endpoint',
            method: 'post',
            debug: false,
        };

        validator.validate(
            contract,
            newResponse({
                'quiz': {
                    'category': [{
                        'name': 'sport',
                        'questions': [{
                            'question': 'Which one is correct team name in NBA?',
                            'answer': {
                                'answer': 'Huston Rocket',
                            },
                        }],
                    }],
                },
                'updated': {
                    year: 2020,
                },
            }),
            options,
        ).then(() => {
            done(new Error('Resolved where we expected an error'));
        }, () => {
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
            endpoint: '/endpoint',
            method: 'post',
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
            endpoint: '/endpoint',
            method: 'post',
            debug: false,
        };

        validator.validate(
            contract,
            response,
            options,
        ).then(done, done);
    });
});
