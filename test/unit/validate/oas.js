const path = require('path');
const sinon = require('sinon');
const c = require('ansi-colors');
const outdent = require('outdent');

const contractWrapper = require('../../resources/contract-wrapper');
const Oas = require('../../../src/validate/oas');

describe('validate/Oas', function() {
    describe('constructor', function() {
        beforeEach(function() {
            this.schemaFileStub = sinon.stub(Oas.prototype, '_resolveFile')
                .callsFake(() => {
                    return contractWrapper.oas3({});
                });
        });

        afterEach(function() {
            sinon.restore();
        });

        it('initializes', function() {
            const oas = new Oas(contractWrapper.oas3({}));
            expect(oas).to.deep.equal(contractWrapper.oas3({}));
        });

        it('throws when given an unsupported OAS version', function() {
            sinon.restore();
            const schema = {
                openapi: '2.0.0',
            };

            expect(() => {
                try {
                    new Oas(schema);
                }
                catch (error) {
                    error.message = c.unstyle(error.message);
                    throw error;
                }
            }).to.throw(outdent`
                UNSUPPORTEDSCHEMAVERSION Schema version is NOT supported

                  1 | {
                > 2 |   "openapi": "2.0.0"
                    |              ^^^^^^^`);
        });

        it('initializes when given a file path', function() {
            sinon.restore();
            const oas = new Oas(path.join(__dirname, '../../resources/api/quiz/quiz.oas3.json'));
            expect(oas.info.title).to.equal('test specs');
        });


        it('returns an openapi 3 file', async function() {
            this.schemaFileStub.callsFake(() => {
                return {
                    openapi: '3.0.0',
                };
            });

            expect(new Oas('oas3')).to.deep.equal({
                openapi: '3.0.0',
            });
        });

        it('throws when it resolves a swagger file', function() {
            this.schemaFileStub.callsFake(() => {
                return {
                    swagger: '2.0',
                };
            });

            expect(() => {
                try {
                    new Oas('swagger');
                }
                catch (error) {
                    error.message = c.unstyle(error.message);
                    throw error;
                }
            }).to.throw('UNSUPPORTEDSCHEMAVERSION Schema version is NOT supported');
        });

        it('throws when it resolves an openapi 4 file', function() {
            this.schemaFileStub.callsFake(() => {
                return {
                    openapi: '4.0.0',
                };
            });

            expect(() => {
                try {
                    new Oas('oas4');
                }
                catch (error) {
                    error.message = c.unstyle(error.message);
                    throw error;
                }
            }).to.throw('UNSUPPORTEDSCHEMAVERSION Schema version is NOT supported');
        });
    });

    describe('_resolveFile', function() {
        beforeEach(function() {
            this.oas = new Oas({openapi: '3.0.0'});
        });

        it('parses stringified json', function() {
            const actual = this.oas._resolveFile('{"foo":123}');

            expect(actual).to.deep.equal({
                foo: 123,
            });
        });

        it('leaves an object alone', function() {
            const actual = this.oas._resolveFile({'foo': 123});

            expect(actual).to.deep.equal({
                foo: 123,
            });
        });

        it('imports a .json file', function() {
            const actual = this.oas._resolveFile(
                path.join(__dirname, '../../resources/api/PetStore/petstore.oas3.json'));

            expect(actual.info.title).to.equal('Swagger Petstore');
        });

        it('imports a .yml file', function() {
            const actual = this.oas._resolveFile(
                path.join(__dirname, '../../resources/api/PetStore/petstore.oas3.yml'));

            expect(actual.info.title).to.equal('Swagger Petstore');
        });

        it('imports the default of an object of paths', function() {
            const actual = this.oas._resolveFile({
                bar: 'bar/bar',
                default: path.join(__dirname, '../../resources/api/PetStore/petstore.oas3.yml'),
                foo: 'foo/foo',
                baz: 'baz/baz',
            });

            expect(actual.info.title).to.equal('Swagger Petstore');
        });
    });

    describe('resolveReferences', function() {
        beforeEach(function() {
            this.schemaFileStub = sinon.stub(Oas.prototype, '_resolveFile')
                .callsFake(() => {
                    return contractWrapper.oas3({});
                });
        });

        afterEach(function() {
            sinon.restore();
        });

        it('resolves references', async function() {
            this.schemaFileStub.callsFake(() => {
                return {
                    openapi: '3.0.0',
                    foo: {
                        '$ref': '#/bar',
                    },
                    bar: 123,
                };
            });

            const oas = new Oas('oas3');
            await oas.resolveReferences();
            expect(oas).to.deep.equal({
                openapi: '3.0.0',
                foo: 123,
                bar: 123,
            });
        });

        it('throws when there is a bad reference', async function() {
            this.schemaFileStub.callsFake(() => {
                return {
                    'openapi': '3.0.0',
                    '$ref': '#/non/existing',
                };
            });

            const oas = new Oas('oas3');
            await expect(oas.resolveReferences()).to.eventually.be.rejectedWith(
                'Something went wrong while dereferencing the OAS: '
                + 'Error resolving $ref pointer');
        });
    });
});


