const Http = require('../../src/http');

module.exports = function responseWrapper(body, statusCode=200) {
    const http = new Http();

    http.request.baseUrl = 'http://foo.bar';
    http.request.endpoint = '/endpoint';
    http.request.method = 'PoSt';
    http.request.headers['accept'] = '*/*';

    http.response.body = body;
    http.response.statusCode = statusCode;
    http.response.ok = (statusCode == 200);
    http.response.headers['content-type'] += ';version=1';

    return http;
};
