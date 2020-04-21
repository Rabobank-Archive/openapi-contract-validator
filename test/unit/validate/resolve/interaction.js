const c = require('ansi-colors');
const outdent = require('outdent');

const Http = require('../../../../src/http');
const contractWrapper = require('../../../resources/contract-wrapper');
const Interaction = require('../../../../src/validate/resolve/interaction');

describe('Resolve/Interaction', function() {
    describe('constructor', function() {
        it('initializes', function() {
            const interaction = new Interaction({oas: true}, {http: true}, {
                endpoint: '/foo/bar',
                method: 'get',
                statusCode: 100,
            });

            expect(interaction).to.deep.equal({
                oas: {oas: true},
                http: {http: true},
                endpoint: '/foo/bar',
                method: 'get',
                statusCode: 100,
            });
        });
    });

    describe('get requestSchema', function() {
        it('returns the request schema of the oas based on the http object', function() {
            const oas = contractWrapper.oas3({}, {});
            const options = {};
            const http = new Http();
            http.request.method = 'POST';
            http.request.baseUrl = 'http://foo.bar';
            http.request.endpoint = 'http://foo.bar/endpoint';
            http.request.headers['accept'] = 'application/json;version=1';
            http.request.body = {body: true};

            const interaction = new Interaction(oas, http, options);
            const result = interaction.requestSchema;

            expect(result).to.deep.equal({
                '$ref': '#/components/schemas/request',
            });
        });

        it('returns the request schema of the oas based on the provided options', function() {
            const oas = contractWrapper.oas3({});
            const options = {
                endpoint: '/endpoint',
                method: 'PoSt',
            };
            const http = new Http();
            http.request.headers['accept'] = 'application/json;version=1';
            http.request.body = {body: true};

            const interaction = new Interaction(oas, http, options);
            const result = interaction.requestSchema;

            expect(result).to.deep.equal({
                '$ref': '#/components/schemas/request',
            });
        });

        it('throws when an unspecified method is used', function() {
            const oas = contractWrapper.oas3({});
            const options = {
                endpoint: '/endpoint',
                method: 'error',
            };
            const http = new Http();
            http.request.headers['accept'] = 'application/json;version=1';

            const interaction = new Interaction(oas, http, options);
            expect(() => {
                try {
                    interaction.requestSchema;
                }
                catch (error) {
                    error.message = c.unstyle(error.message);
                    throw error;
                }
            }).to.throw(`UNEXPECTEDMETHOD expected one of the specified methods for `
                + `the endpoint: ["post"]`);
        });

        it('returns the first request schema when a wrong endpoint is used', function() {
            const oas = contractWrapper.oas3({});
            const options = {
                endpoint: '/error',
                method: 'post',
            };
            const http = new Http();
            http.request.headers['accept'] = 'application/json;version=1';
            http.request.body = {body: true};

            const interaction = new Interaction(oas, http, options);
            const result = interaction.requestSchema;

            expect(result).to.deep.equal({
                '$ref': '#/components/schemas/request',
            });
        });

        it('throws when the request has an unspecified media type in accept header', function() {
            const oas = contractWrapper.oas3({});
            const options = {
                endpoint: '/endpoint',
                method: 'post',
            };
            const http = new Http();
            http.request.headers['accept'] = 'text/plain;version=1';
            http.request.headers['content-type'] = undefined;
            http.request.body = {body: true};

            const interaction = new Interaction(oas, http, options);
            expect(() => {
                try {
                    interaction.requestSchema;
                }
                catch (error) {
                    error.message = c.unstyle(error.message);
                    throw error;
                }
            }).to.throw(`UNEXPECTEDACCEPT Requested unexpected media type in Accept header. `
                + `Expected one of ["application/json","application/json;version=1"]`);
        });

        it('throws when the request has no body while the schema requires one', function() {
            const oas = contractWrapper.oas3({});
            oas.paths['/endpoint'].post.requestBody.required = true;
            const options = {
                endpoint: '/endpoint',
                method: 'post',
            };
            const http = new Http();
            http.request.headers['accept'] = 'text/plain;version=1';

            const interaction = new Interaction(oas, http, options);
            expect(() => {
                try {
                    interaction.requestSchema;
                }
                catch (error) {
                    error.message = c.unstyle(error.message);
                    throw error;
                }
            }).to.throw(`REQUESTREQUIRED Request body is required.`);
        });

        it('returns undefined when the request has no body and the schema '
                + 'does not require it', function() {
            const oas = contractWrapper.oas3({});
            const options = {
                endpoint: '/endpoint',
                method: 'post',
            };
            const http = new Http();
            http.request.headers['accept'] = 'text/plain;version=1';

            const interaction = new Interaction(oas, http, options);
            const result = interaction.requestSchema;
            expect(result).to.be.undefined;
        });

        it('throws when the request has a body while the schema does not', function() {
            const oas = contractWrapper.oas3({});
            delete oas.paths['/endpoint'].post.requestBody;
            const options = {
                endpoint: '/endpoint',
                method: 'post',
            };
            const http = new Http();
            http.request.headers['accept'] = 'text/plain;version=1';
            http.request.body = {body: true};

            const interaction = new Interaction(oas, http, options);
            expect(() => {
                try {
                    interaction.requestSchema;
                }
                catch (error) {
                    error.message = c.unstyle(error.message);
                    throw error;
                }
            }).to.throw(`REQUESTBODY Must NOT have request body.`);
        });

        it('returns undefined when both the request and the schema have no body', function() {
            const oas = contractWrapper.oas3({});
            delete oas.paths['/endpoint'].post.requestBody;
            const options = {
                endpoint: '/endpoint',
                method: 'post',
            };
            const http = new Http();
            http.request.headers['accept'] = 'text/plain;version=1';

            const interaction = new Interaction(oas, http, options);
            const result = interaction.requestSchema;
            expect(result).to.be.undefined;
        });
    });

    describe('get responseSchema', function() {
        it('returns the response schema of the oas based on the http object', function() {
            const oas = contractWrapper.oas3({});
            const options = {};
            const http = new Http();
            http.request.method = 'POST';
            http.request.baseUrl = 'http://foo.bar';
            http.request.endpoint = 'http://foo.bar/endpoint';
            http.response.headers['content-type'] = 'application/json;version=1';

            const interaction = new Interaction(oas, http, options);
            const result = interaction.responseSchema;

            expect(result).to.deep.equal({
                '$ref': '#/components/schemas/response',
            });
        });

        it('returns the response schema of the oas based on the provided options', function() {
            const oas = contractWrapper.oas3({});
            const options = {
                endpoint: '/endpoint',
                method: 'PoSt',
            };
            const http = new Http();
            http.response.headers['content-type'] = 'application/json;version=1';

            const interaction = new Interaction(oas, http, options);
            const result = interaction.responseSchema;

            expect(result).to.deep.equal({
                '$ref': '#/components/schemas/response',
            });
        });

        it('throws when the wrong method is used', function() {
            const oas = contractWrapper.oas3({});
            const options = {
                endpoint: '/endpoint',
                method: 'error',
            };
            const http = new Http();
            http.response.headers['content-type'] = 'application/json;version=1';

            const interaction = new Interaction(oas, http, options);
            expect(() => {
                try {
                    interaction.responseSchema;
                }
                catch (error) {
                    error.message = c.unstyle(error.message);
                    throw error;
                }
            }).to.throw(`UNEXPECTEDMETHOD expected one of the specified methods for the `
                + `endpoint: ["post"]`);
        });

        it('throws when the request and response versions don\'t match', function() {
            const oas = contractWrapper.oas3({});
            const options = {
                endpoint: '/endpoint',
                method: 'post',
            };
            const http = new Http();
            http.response.headers['content-type'] = 'application/json;version=2';
            http.response.parseHeaders();
            http.request.headers['content-type'] = 'application/json;version=1';
            http.request.parseHeaders();

            const interaction = new Interaction(oas, http, options);
            expect(() => {
                try {
                    interaction.responseSchema;
                }
                catch (error) {
                    error.message = c.unstyle(error.message);
                    throw error;
                }
            }).to.throw(outdent`
                VERSIONMISMATCH Responded with different version than requested.

                >  1 | {
                     | ^
                >  2 |   "request": {
                     | ^^^^^^^^^^^^^^
                >  3 |     "accept": "*/*",
                     | ^^^^^^^^^^^^^^
                >  4 |     "version": "1"
                     | ^^^^^^^^^^^^^^
                >  5 |   },
                     | ^^^^^^^^^^^^^^
                >  6 |   "response": {
                     | ^^^^^^^^^^^^^^
                >  7 |     "content-type": "application/json;version=2",
                     | ^^^^^^^^^^^^^^
                >  8 |     "version": "2"
                     | ^^^^^^^^^^^^^^
                >  9 |   }
                     | ^^^^^^^^^^^^^^
                > 10 | }
            `);
        });

        it('throws when the response has an unspecified content type', function() {
            const oas = contractWrapper.oas3({});
            const options = {
                endpoint: '/endpoint',
                method: 'post',
            };
            const http = new Http();
            http.response.headers['content-type'] = 'text/plain;version=1';

            const interaction = new Interaction(oas, http, options);
            expect(() => {
                try {
                    interaction.responseSchema;
                }
                catch (error) {
                    error.message = c.unstyle(error.message);
                    throw error;
                }
            }).to.throw(`CONTENTTYPE Responded with unexpected content type via the `
                + `content-type header. `
                + `Expected one of ["application/json;version=1"]`);
        });
    });
});
