const normalize = require('../../../../src/validate/resolve/normalizer');

describe('Resolve/parser', function() {
    describe('endpoint', function() {
        beforeEach(function() {
            this.http = {
                request: {
                    endpoint: 'base.url/lipsum',
                    baseUrl: 'base.url',
                },
            };
        });

        it('returns the provided endpoint unchanged with no Http object', function() {
            const result = normalize.endpoint('/foo/bar/baz');
            expect(result).to.equal('/foo/bar/baz');
        });

        it('returns the provided endpoint unchanged with Http object', function() {
            const result = normalize.endpoint('/foo/bar/baz', this.http);
            expect(result).to.equal('/foo/bar/baz');
        });

        it('returns the endpoint without base url in the Http obejct when no endpoint'
                + ' is provided', function() {
            const result = normalize.endpoint(null, this.http);
            expect(result).to.equal('/lipsum');
        });

        it('returns the endpoint without query parameters from the Http obejct when no endpoint'
                + ' is provided', function() {
            this.http.request.baseUrl = '';
            this.http.request.endpoint = '/lipsum?dolor=sit&amet=conscuer';

            const result = normalize.endpoint(null, this.http);
            expect(result).to.equal('/lipsum');
        });
    });

    describe('method', function() {
        beforeEach(function() {
            this.http = {
                request: {
                    method: 'Put',
                },
            };
        });

        it('returns the provided lowercase method unchanged with no Http object', function() {
            const result = normalize.method('get');
            expect(result).to.equal('get');
        });

        it('returns the provided method in lower case with no Http object', function() {
            const result = normalize.method('PoSt');
            expect(result).to.equal('post');
        });

        it('returns the provided lowercase method unchanged with Http object', function() {
            const result = normalize.method('get', this.http);
            expect(result).to.equal('get');
        });

        it('returns the method in the Http obejct when no endpoint is provided', function() {
            const result = normalize.method(null, this.http);
            expect(result).to.equal('put');
        });
    });
});
