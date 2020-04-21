const _ = require('lodash');
const acceptHeaderParser = require('@hapi/accept');

const ValidationError = require('../validation-error');

/**
 * Find the schema endpoint for the given request endpoint
 *
 * @memberof module:validator/resolve
 *
 * @param {string[]} endpointMasks List of OAS compatible endpoints
 * @param {string} endpoint The request endpoint
 * @return {string}
 */
function resolveEndpoint(endpointMasks, endpoint) {
    // Remove query string from the endpoint
    endpoint = _.first(endpoint.split('?'));

    const endpointSplit = endpoint.split('/');
    endpoint = null;

    for (const mask of endpointMasks) {
        const maskSplit = mask.split('/');

        if (maskSplit.length !== endpointSplit.length) {
            continue;
        }

        let match = true;
        for (const [i, element] of maskSplit.entries()) {
            if (element === endpointSplit[i]) {
                continue;
            }
            if (element.match(/^{.+}$/g)) {
                // We found a parameter placeholder. ex: /foo/{id}/bar
                // A placeholder can be any value, so this is fine.
                continue;
            }
            match = false;
            break;
        }

        if (match) {
            endpoint = mask;
            break;
        }
    }

    if (!endpoint) {
        console.warn(`Could not find a matching endpoint for endpoint `
            + `'${endpointSplit.join('/')}'. Using the first in the schema.`);
        endpoint = endpointMasks[0];
    }

    return endpoint;
};
exports.endpoint = resolveEndpoint;


/**
 * Find the schema status code for the given request
 *
 * @memberof module:validator/resolve
 *
 * @param {object} responses
 * @param {number} code
 * @return {number|'default'}
 */
function resolveStatusCode(responses, code) {
    const hasDefault = 'default' in responses;

    if (!code) {
        // For some reason there is no status code defined
        if (hasDefault) {
            return 'default';
        }

        // We'll use the first in the schema
        return Number(_.keys(responses)[0]);
    }

    if (!responses[code]) {
        if (hasDefault) {
            return 'default';
        }

        throw new ValidationError({}, code, [{
            keyword: 'statusCode',
            message: `Responded with unexpected status code and there is no `
                + `'default' defined to fall back to.`,
        }]);
    }

    return code;
};
exports.statusCode = resolveStatusCode;


/**
 * @memberof module:validator/resolve
 *
 * @param {Oas} oas
 * @param {string} endpoint
 * @param {string} method
 * @return {Partial<Oas>}
 * @throws {ValidationError}
 */
function resolveInteractionDefinition(oas, endpoint, method) {
    const schema = oas.paths[endpoint][method];
    if (_.isUndefined(schema)) {
        throw new ValidationError(oas, {endpoint, method}, [{
            keyword: 'unexpectedMethod',
            dataPath: `#/method`,
            schemaPath: `#/paths/${endpoint}/${method}`,
            message: `expected one of the specified methods for the endpoint: `
                + JSON.stringify(_.keys(oas.paths[endpoint])),
        }]);
    }

    return schema;
}
exports.interactionDefinition = resolveInteractionDefinition;


/**
 * @memberof module:validator/resolve
 *
 * @param {Partial<Oas>} schema
 * @param {object} responseHeaders
 * @return {string}
 */
function resolveContentType(schema, responseHeaders) {
    const contentType = responseHeaders['content-type'];
    if (!schema.hasOwnProperty(contentType)) {
        throw new ValidationError(schema, responseHeaders, [{
            keyword: 'contentType',
            dataPath: '#/content-type',
            message: `Responded with unexpected content type via the content-type header. `
                + `Expected one of ${JSON.stringify(_.keys(schema))}`,
        }]);
    }
    return contentType;
}
exports.contentType = resolveContentType;


/**
 * @memberof module:validator/resolve
 *
 * @param {Partial<Oas>} schema
 * @param {object} requestHeaders
 * @return {string}
 */
function resolveAcceptType(schema, requestHeaders) {
    const acceptableTypes = _.keys(schema);
    if (acceptableTypes.includes(requestHeaders.accept)) {
        return requestHeaders.accept;
    }

    const mediaType = acceptHeaderParser.mediaType(requestHeaders.accept, acceptableTypes);
    if (mediaType.length === 0) {
        throw new ValidationError(schema, requestHeaders, [{
            keyword: 'unexpectedAccept',
            dataPath: '#/accept',
            message: `Requested unexpected media type in Accept header. `
                + `Expected one of ${JSON.stringify(acceptableTypes)}`,
        }]);
    }
    return mediaType;
};
exports.acceptType = resolveAcceptType;
