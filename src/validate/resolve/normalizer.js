
/**
 * @private
 * @param {string} endpoint
 * @param {Http} http
 * @return {string} endpoint
 */
function normalizeEndpoint(endpoint, http) {
    if (!endpoint) {
        return http.request.endpoint
            .replace(http.request.baseUrl, '')
            .replace(/\?.+$/, '');
    }
    return endpoint;
}
exports.endpoint = normalizeEndpoint;


/**
 * @private
 * @param {string} method
 * @param {Http} http
 * @return {string} method
 */
function normalizeMethod(method, http) {
    if (!method) {
        return http.request.method.toLowerCase();
    }
    return method.toLowerCase();
}
exports.method = normalizeMethod;
