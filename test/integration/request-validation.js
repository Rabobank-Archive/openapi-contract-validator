const c = require('ansi-colors');

const Validator = require('../../src').Validator;
const Http = require('../../src').Http;

const contract = require('../resources/api/employees/employees.oas3.json');

const validator = new Validator();
const expectedErrorThrown = new Error('Expected an error to be thrown');

const options = {
    statusCode: 200,
    endpoint: '/',
    method: 'post',
    debug: false,
};

describe('Request validation', function() {
    beforeEach(function() {
        this.http = new Http();
        this.http.request.baseUrl = 'http://base.url';
        this.http.request.endpoint = options.endpoint;
        this.http.request.method = options.method;
        this.http.response.statusCode = options.statusCode;
    });

    context('POST employees/query', function() {
        beforeEach(function() {
            this.options = options;
            this.options.endpoint = '/employees/query';
            this.options.method = 'post';
            this.options.requireAllFields = false;
        });

        it('throws when the request body is incomplete with requireAllFields set', function(done) {
            this.http.request.body = {
                id: {},
            };
            this.http.response.body = {};

            this.options.requireAllFields = true;

            validator
                .validate(
                    contract,
                    this.http,
                    this.options,
                )
                .then(() => {
                    done(expectedErrorThrown);
                }, (error) => {
                    expect(c.unstyle(error.message))
                        .to.include(`REQUIRED should have required property 'to'`)
                        .to.include(`REQUIRED should have required property 'surname'`);
                    done();
                })
                .catch(done);
        });

        it('throws when there is no request body', function(done) {
            this.http.request.body = {};
            this.http.response.body = {response: 'bad'};

            validator
                .validate(
                    contract,
                    this.http,
                    this.options,
                )
                .then(() => {
                    done(expectedErrorThrown);
                }, (error) => {
                    expect(c.unstyle(error.message))
                        .to.include('requestRequired Request body is required');
                    done();
                })
                .catch(done);
        });

        it('throws when the request body is invalid', function(done) {
            this.http.request.body = {request: 'bad'};
            this.http.response.body = {response: 'bad'};

            validator
                .validate(
                    contract,
                    this.http,
                    this.options,
                )
                .then(() => {
                    done(expectedErrorThrown);
                }, (error) => {
                    expect(c.unstyle(error.message))
                        .to.include('request is not expected to be here!');
                    done();
                })
                .catch(done);
        });

        it('throws when the response body is invalid', function(done) {
            this.http.request.body = {id: {}};
            this.http.response.body = {response: 'bad'};

            validator
                .validate(
                    contract,
                    this.http,
                    this.options,
                )
                .then(() => {
                    done(expectedErrorThrown);
                }, (error) => {
                    expect(c.unstyle(error.message))
                        .to.include('response is not expected to be here!');
                    done();
                })
                .catch(done);
        });

        it('passes when the request body is valid', function(done) {
            this.http.request.body = {
                id: {},
            };
            this.http.response.body = {};

            validator
                .validate(
                    contract,
                    this.http,
                    this.options,
                )
                .then(done, done);
        });
    });

    context('POST employees/list', function() {
        beforeEach(function() {
            this.options = options;
            this.options.endpoint = '/employees/list';
            this.options.method = 'post';
            this.options.requireAllFields = false;
        });

        it('passes when there is no request body', function(done) {
            this.http.request.body = {};
            this.http.response.body = {};

            validator
                .validate(
                    contract,
                    this.http,
                    this.options,
                )
                .then(done, done);
        });

        it('throws when the request body is invalid', function(done) {
            this.http.request.body = {request: 'bad'};
            this.http.response.body = {response: 'bad'};

            validator
                .validate(
                    contract,
                    this.http,
                    this.options,
                )
                .then(() => {
                    done(expectedErrorThrown);
                }, (error) => {
                    expect(c.unstyle(error.message))
                        .to.include('request is not expected to be here!');
                    done();
                })
                .catch(done);
        });

        it('throws when the response body is invalid', function(done) {
            this.http.request.body = {id: {}};
            this.http.response.body = {response: 'bad'};

            validator
                .validate(
                    contract,
                    this.http,
                    this.options,
                )
                .then(() => {
                    done(expectedErrorThrown);
                }, (error) => {
                    expect(c.unstyle(error.message))
                        .to.include('response is not expected to be here!');
                    done();
                })
                .catch(done);
        });

        it('passes when the request body is valid', function(done) {
            this.http.request.body = {
                id: {},
            };
            this.http.response.body = {};

            validator
                .validate(
                    contract,
                    this.http,
                    this.options,
                )
                .then(done, done);
        });
    });

    context('GET employees/list', function() {
        beforeEach(function() {
            this.options = options;
            this.options.endpoint = '/employees/list';
            this.options.method = 'GET';
            this.options.requireAllFields = false;
        });

        it('passes when there is no request body', function(done) {
            this.http.request.body = null;
            this.http.response.body = {};

            validator
                .validate(
                    contract,
                    this.http,
                    this.options,
                )
                .then(done, done);
        });

        it('throws when there is a request body', function(done) {
            this.http.request.body = {id: {}};
            this.http.response.body = {};

            validator
                .validate(
                    contract,
                    this.http,
                    this.options,
                )
                .then(() => {
                    done(expectedErrorThrown);
                }, (error) => {
                    expect(c.unstyle(error.message))
                        .to.include('requestBody Must NOT have request body');
                    done();
                })
                .catch(done);
        });

        it('throws when the response body is invalid', function(done) {
            this.http.request.body = null;
            this.http.response.body = {response: 'bad'};

            validator
                .validate(
                    contract,
                    this.http,
                    this.options,
                )
                .then(() => {
                    done(expectedErrorThrown);
                }, (error) => {
                    expect(c.unstyle(error.message))
                        .to.include('response is not expected to be here!');
                    done();
                })
                .catch(done);
        });
    });
});
