const c = require('ansi-colors');

const Http = require('../../src/http');

describe('The data struct Http', function() {
    it('initializes', function() {
        const http = new Http();

        expect(http).to.be.instanceOf(Http);
        expect(http.request).to.not.be.undefined;
        expect(http.response).to.not.be.undefined;
    });

    context('response', function() {
        beforeEach(function() {
            this.response = new Http().response;
        });

        it('initializes with json headers', function() {
            expect(this.response.headers).to.deep.equal({
                'content-type': 'application/json',
            });
        });

        describe('parseHeaders', function() {
            it('maps all header keys lowercase', function() {
                this.response.headers = {
                    'LORUM': 'Ipsum',
                    'Dolor': 'sIt',
                    'amEt': 'CONSCUER',
                    'content-type': 'text/plain+xyz',
                };

                expect(this.response.headers).to.deep.equal({
                    'lorum': 'Ipsum',
                    'dolor': 'sIt',
                    'amet': 'CONSCUER',
                    'content-type': 'text/plain+xyz',
                });
            });

            context('content-type header', function() {
                it('throws when there is no `content-type`', function() {
                    expect(() => {
                        try {
                            this.response.parseHeaders({
                                'some-header': 'value',
                            });
                        }
                        catch (error) {
                            error.message = c.unstyle(error.message);
                            throw error;
                        }
                    }).to.throw('NOCONTENTTYPE Response does not have a Content-Type header.');
                });

                it('normalizes when it has spaces around the separator', function() {
                    const result = this.response.parseHeaders({
                        'content-type': 'text/plain; foo=bar ;  rekt=false',
                    });

                    expect(result['content-type']).to.equal('text/plain;foo=bar;rekt=false');
                });

                it('removes utf-8 encoding', function() {
                    const result = this.response.parseHeaders({
                        'content-type': 'text/plain;charset=UtF-8',
                    });

                    expect(result['content-type']).to.equal('text/plain');
                });

                it('keeps utf-16 encoding', function() {
                    const result = this.response.parseHeaders({
                        'content-type': 'text/plain;charset=utf-16',
                    });

                    expect(result['content-type']).to.equal('text/plain;charset=utf-16');
                });

                context('version string', function() {
                    it('defaults to `1` if no version is provided', function() {
                        this.response.parseHeaders({
                            'content-type': 'application/json',
                        });

                        expect(this.response.version).to.equal('1');
                    });

                    it('only gets the version number', function() {
                        this.response.parseHeaders({
                            'content-type': 'application/json;version=12',
                        });

                        expect(this.response.version).to.equal('12');
                    });

                    it('handles complex versions', function() {
                        this.response.parseHeaders({
                            'content-type': 'application/json;version=2-alpha.2912',
                        });

                        expect(this.response.version).to.equal('2-alpha.2912');
                    });
                });
            });
        });
    });

    context('request', function() {
        beforeEach(function() {
            this.request = new Http().request;
        });

        it('initializes with json headers', function() {
            expect(this.request.headers).to.deep.equal({
                'content-type': 'application/json',
                'accept': '*/*',
            });
        });

        describe('parseHeaders', function() {
            it('maps all header keys lowercase', function() {
                this.request.headers = {
                    'LORUM': 'Ipsum',
                    'Dolor': 'sIt',
                    'amEt': 'CONSCUER',
                    'accept': 'text/plain+xyz',
                };

                expect(this.request.headers).to.deep.equal({
                    'lorum': 'Ipsum',
                    'dolor': 'sIt',
                    'amet': 'CONSCUER',
                    'accept': 'text/plain+xyz',
                });
            });

            context('accept header', function() {
                it('throws when there is no `accept` header', function() {
                    expect(() => {
                        try {
                            this.request.parseHeaders({
                                'some-header': 'value',
                            });
                        }
                        catch (error) {
                            error.message = c.unstyle(error.message);
                            throw error;
                        }
                    }).to.throw('NOACCEPT Request does not have an Accept header.');
                });

                context('version string', function() {
                    it('defaults to `1` if no version is provided', function() {
                        this.request.parseHeaders({
                            'accept': 'application/json',
                        });

                        expect(this.request.version).to.equal('1');
                    });

                    it('only gets the version number', function() {
                        this.request.parseHeaders({
                            'accept': 'application/json;version=12',
                        });

                        expect(this.request.version).to.equal('12');
                    });

                    it('ignores the content-type header', function() {
                        this.request.parseHeaders({
                            'accept': 'application/json',
                            'content-type': 'application/json;version=12',
                        });

                        expect(this.request.version).to.equal('1');
                    });

                    it('handles complex versions', function() {
                        this.request.parseHeaders({
                            'accept': 'application/json;version=2-alpha.2912',
                        });

                        expect(this.request.version).to.equal('2-alpha.2912');
                    });
                });
            });
        });
    });
});
