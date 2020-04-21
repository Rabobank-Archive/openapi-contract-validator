const _ = require('lodash');

const ValidationError = require('../validation-error');
const normalize = require('./normalizer');
const resolve = require('./resolver');

/**
 * @memberof module:validator/resolve
 */
class Interaction {
    /**
     * @param {Oas} oas
     * @param {Http} http
     * @param {object} options
     * @param {string} options.endpoint
     * @param {string} options.method
     * @param {number} options.statusCode
     */
    constructor(oas, http, {
        endpoint,
        statusCode,
        method,
    }) {
        this.oas = oas;
        this.http = http;

        this.endpoint = normalize.endpoint(endpoint, http);
        this.method = normalize.method(method, http);
        this.statusCode = statusCode;
    }


    /**
     * The schema for its http request to be used for validation.
     * @return {object}
     */
    get requestSchema() {
        const endpointMask = resolve.endpoint(_.keys(this.oas.paths), this.endpoint);
        const requestBodySchema = resolve.interactionDefinition(
            this.oas, endpointMask, this.method).requestBody;

        const hasRequestBody = !_.isEmpty(this.http.request.body);
        const hasRequestBodySchema = !_.isUndefined(requestBodySchema);
        if (!hasRequestBodySchema && !hasRequestBody) {
            return;
        }
        else if (!hasRequestBodySchema && hasRequestBody) {
            throw new ValidationError(this.oas, this.http.request.body, [{
                keyword: 'requestBody',
                message: 'Must NOT have request body.',
            }]);
        }
        else if (hasRequestBodySchema && !hasRequestBody) {
            if (requestBodySchema.required) {
                throw new ValidationError(this.oas, this.http.request.body, [{
                    keyword: 'requestRequired',
                    message: 'Request body is required.',
                }]);
            }
            return;
        }

        // Both exist
        const content = requestBodySchema.content;
        const mediaType = resolve.acceptType(content, this.http.request.headers);
        return content[mediaType].schema;
    };

    /**
     * The schema for its http response to be used for validation.
     * @return {Partial<Oas>}
     */
    get responseSchema() {
        const {request, response} = this.http;
        if (response.version !== request.version) {
            const headers = {
                request: {
                    'accept': request.headers.accept,
                    'version': request.version,
                },
                response: {
                    'content-type': response.headers['content-type'],
                    'version': response.version,
                },
            };

            throw new ValidationError(this.oas, headers, [{
                keyword: 'versionMismatch',
                message: `Responded with different version than requested.`,
            }]);
        }

        const endpointMask = resolve.endpoint(_.keys(this.oas.paths), this.endpoint);
        const responses = resolve.interactionDefinition(
            this.oas, endpointMask, this.method).responses;

        const statusCode = resolve.statusCode(responses, this.statusCode);
        const content = responses[statusCode].content;
        const mediaType = resolve.contentType(content, response.headers);
        return content[mediaType].schema;
    };
}
module.exports = Interaction;
