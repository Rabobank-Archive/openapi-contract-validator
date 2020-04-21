const _ = require('lodash');
const ValidationError = require('./validate/validation-error');

class Http {
    /**
     * Generic way to store Http transactions
     */
    constructor() {
        /**
         * @type {Response}
         */
        this.response = new Response();

        /**
         * @type {Request}
         */
        this.request = new Request();
    }
}
module.exports = Http;

class Request {
    /**
     * Describes an HTTP request
     */
    constructor() {
        /**
         * @type {string}
         */
        this.baseUrl = '';

        /**
         * @type {string}
         */
        this.endpoint = '';

        /**
         * @type {string}
         */
        this.method = '';

        /**
         * @type {object}
         */
        this._headers = {
            'content-type': 'application/json',
            'accept': '*/*',
        };

        /**
         * @type {object}
         */
        this.body = null;

        /**
         * @type {string}
         */
        this.raw;

        this.parseHeaders();
    }

    set headers(headers) {
        headers = _.cloneDeep(headers);
        this._headers = this.parseHeaders(headers);
    }

    get headers() {
        return this._headers;
    }

    /**
     * @param {object} headers
     * @return {object}
     * @throws {ValidationError}
     */
    parseHeaders(headers=this.headers) {
        headers = _.mapKeys(headers, (_, key) => key.toLowerCase());

        if (_.isEmpty(headers.accept)) {
            throw new ValidationError({}, headers, [{
                keyword: 'noAccept',
                message: `Request does not have an Accept header.`,
            }]);
        }

        this.version = getVersionFromMediaType(headers.accept);
        return headers;
    }
}

class Response {
    /**
     * Describes an HTTP response
     */
    constructor() {
        /**
         * @type {Number}
         */
        this.statusCode;

        /**
         * @type {boolean}
         */
        this.ok;

        /**
         * @type {object}
         */
        this._headers = {
            'content-type': 'application/json',
        };

        /**
         * @type {object}
         */
        this.body = null;

        /**
         * @type {string}
         */
        this.raw;

        this.parseHeaders();
    }

    set headers(headers) {
        headers = _.cloneDeep(headers);
        this._headers = this.parseHeaders(headers);
    }

    get headers() {
        return this._headers;
    }

    /**
     * @param {object} headers
     * @return {object}
     * @throws {ValidationError}
     */
    parseHeaders(headers=this.headers) {
        headers = _.mapKeys(headers, (_, key) => key.toLowerCase());

        let contentType = headers['content-type'];

        if (_.isEmpty(contentType)) {
            throw new ValidationError({}, headers, [{
                keyword: 'noContentType',
                message: `Response does not have a Content-Type header.`,
            }]);
        }

        contentType = contentType
            .split(/\s*;\s*/)
            .filter((value) => {
                // Charset UTF-8 is default for REST, so it's omitted
                return value.toLowerCase() !== 'charset=utf-8';
            })
            .join(';');

        headers['content-type'] = contentType;
        this.version = getVersionFromMediaType(contentType);
        return headers;
    }
}

/**
 * @private
 * @param {string} type
 * @return {string}
 */
function getVersionFromMediaType(type) {
    return type
        .split(/\s*;\s*/)
        .reduce((version, type) => {
            if (type.startsWith('version=')) {
                return type.split('=')[1];
            }
            return version;
        }, '1');
}
