const sinon = require('sinon');
const c = require('ansi-colors');
const outdent = require('outdent');

const resolve = require('../../../../src/validate/resolve/resolver');

describe('Resolve/resolver', function() {
    describe('statusCode', function() {
        beforeEach(function() {
            const schema = require('../../../resources/api/PetStore/petstore.oas3.json');
            this.responses = schema.paths['/pets'].get.responses;
        });

        it('returns the provided statuscode when its defined in the contract', function() {
            const statusCode = resolve.statusCode(this.responses, 200);

            expect(statusCode).to.equal(200);
        });

        it('returns `default` when there is no statuscode provided '
                + 'and default is defined', function() {
            const statusCode = resolve.statusCode(this.responses);

            expect(statusCode).to.equal('default');
        });

        it('returns the first statuscode in the contract when there is no statuscode provided '
                + 'and default is not defined', function() {
            const responses = Object.assign({}, this.responses);
            delete responses.default;

            const statusCode = resolve.statusCode(responses);

            expect(statusCode).to.equal(200);
        });

        it('returns `default` when the provided statuscode is not defined '
                + 'and default is not defined', function() {
            const statusCode = resolve.statusCode(this.responses, 300);

            expect(statusCode).to.equal('default');
        });

        it('throws when when the provided statuscode is not defined '
                + 'and default is not defined', function() {
            const responses = Object.assign({}, this.responses);
            delete responses.default;

            expect(() => {
                try {
                    resolve.statusCode(responses, 300);
                }
                catch (error) {
                    error.message = c.unstyle(error.message);
                    throw error;
                }
            })
                .to.throw(`STATUSCODE Responded with unexpected status code and there is no `
                    + `'default' defined to fall back to.`);
        });
    });

    describe('endpoint', function() {
        beforeEach(function() {
            this.schemaEndpoints = [
                '/pets',
                '/pet',
                '/pets/{id}',
                '/pets/foo/{bar}',
            ];

            this.consoleWarnStub = sinon.stub(console, 'warn');
        });

        afterEach(function() {
            sinon.restore();
        });

        context('It returns the schema endpoint based on the request endpoint', function() {
            it('does not have parameters', function() {
                expect(resolve.endpoint(this.schemaEndpoints, '/pet'))
                    .to.equal('/pet');
                expect(resolve.endpoint(this.schemaEndpoints, '/pets'))
                    .to.equal('/pets');
            });

            it('has querystring parameters', function() {
                expect(resolve.endpoint(this.schemaEndpoints, '/pet?foo'))
                    .to.equal('/pet');
                expect(resolve.endpoint(this.schemaEndpoints, '/pets?id=123'))
                    .to.equal('/pets');
            });

            it('has path parameters', function() {
                expect(resolve.endpoint(this.schemaEndpoints, '/pets/12345'))
                    .to.equal('/pets/{id}');
                expect(resolve.endpoint(this.schemaEndpoints, '/pets/fluffy2'))
                    .to.equal('/pets/{id}');

                expect(resolve.endpoint(this.schemaEndpoints, '/pets/foo/fluffy2'))
                    .to.equal('/pets/foo/{bar}');
            });
        });

        it('warns and returns the first endpoint if no matching endpoint can be found', function() {
            expect(resolve.endpoint(this.schemaEndpoints, '/unresolvable/endpoint'))
                .to.equal('/pets');

            expect(this.consoleWarnStub).to.be.calledOnce;
            expect(this.consoleWarnStub).to.be.calledWithExactly(
                `Could not find a matching endpoint for endpoint '/unresolvable/endpoint'. `
                + `Using the first in the schema.`);
        });
    });

    describe('acceptType', function() {
        it('returns the one valid requested media type', function() {
            const schema = {
                'application/json;version=2': {},
            };
            const headers = {
                accept: 'application/json;version=2',
            };

            const result = resolve.acceptType(schema, headers);

            expect(result).to.equal('application/json;version=2');
        });

        it('returns the closest match in a Accept pattern', function() {
            const schema = {
                'application/json;version=2': {},
            };
            const headers = {
                accept: 'application/*;version=2',
            };

            const result = resolve.acceptType(schema, headers);

            expect(result).to.equal('application/json;version=2');
        });

        it('returns the exact match when there are multiple options', function() {
            const schema = {
                'application/json': {},
                'application/json;version=1': {},
                'application/json;version=2': {},
            };
            const headers = {
                accept: 'application/json;version=2',
            };

            const result = resolve.acceptType(schema, headers);

            expect(result).to.equal('application/json;version=2');
        });

        it('throws when there is no match to the one option', function() {
            const schema = {
                'application/json': {},
            };
            const headers = {
                accept: 'plain/text',
            };

            expect(() => {
                try {
                    resolve.acceptType(schema, headers);
                }
                catch (error) {
                    error.message = c.unstyle(error.message);
                    throw error;
                }
            }).to.throw('UNEXPECTEDACCEPT Requested unexpected media type in Accept header. '
                + 'Expected one of ["application/json"]');
        });

        it('throws when there is no match to the two option', function() {
            const schema = {
                'application/json': {},
                'application/xml': {},
            };
            const headers = {
                accept: 'plain/text',
            };

            expect(() => {
                try {
                    resolve.acceptType(schema, headers);
                }
                catch (error) {
                    error.message = c.unstyle(error.message);
                    throw error;
                }
            }).to.throw(outdent`
                ${'UNEXPECTEDACCEPT Requested unexpected media type in Accept header. '
                    + 'Expected one of ["application/json","application/xml"]'}

                  1 | {
                > 2 |   "accept": "plain/text"
                    |             ^^^^^^^^^^^^`);
        });
    });

    describe('contentType', function() {
        it('returns the response media type', function() {
            const schema = {
                'application/json;version=2': {},
            };
            const headers = {
                'content-type': 'application/json;version=2',
            };

            const result = resolve.contentType(schema, headers);

            expect(result).to.equal('application/json;version=2');
        });

        it('throws when the content type is not in the schema', function() {
            const schema = {
                'application/json': {},
            };
            const headers = {
                'content-type': 'plain/text',
            };

            expect(() => {
                try {
                    resolve.contentType(schema, headers);
                }
                catch (error) {
                    error.message = c.unstyle(error.message);
                    throw error;
                }
            }).to.throw(outdent`
                ${'CONTENTTYPE Responded with unexpected content type via the content-type header. '
                    + 'Expected one of ["application/json"]'}

                  1 | {
                > 2 |   "content-type": "plain/text"
                    |                   ^^^^^^^^^^^^`);
        });
    });

    describe('interactionDefinition', function() {
        it('returns the response media type', function() {
            const endpoint = '/foo/bar';
            const method = 'get';
            const oas = {
                paths: {
                    [endpoint]: {
                        [method]: 'Definitly not undefined',
                    },
                },
            };

            const result = resolve.interactionDefinition(oas, endpoint, method);

            expect(result).to.equal('Definitly not undefined');
        });

        it('throws when the content type is not in the schema', function() {
            const endpoint = '/foo/bar';
            const method = 'get';
            const oas = {
                paths: {
                    [endpoint]: {
                        post: true,
                        put: true,
                    },
                },
            };

            expect(() => {
                try {
                    resolve.interactionDefinition(oas, endpoint, method);
                }
                catch (error) {
                    error.message = c.unstyle(error.message);
                    throw error;
                }
            }).to.throw(outdent`
                ${'UNEXPECTEDMETHOD expected one of the specified methods for the endpoint: '
                    + '["post","put"]'}

                  1 | {
                  2 |   "endpoint": "/foo/bar",
                > 3 |   "method": "get"
                    |             ^^^^^`);
        });
    });
});
