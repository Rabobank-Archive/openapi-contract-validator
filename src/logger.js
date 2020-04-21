/**
 * @module logger
 */

const ignoredLogMessages = [
    'schema $id ignored https://github.com/epoberezkin/ajv/blob/master/lib/definition_schema.js',
];

/**
 * @private
 * @param {string} level
 * @param {any[]} messages
 */
function logMessage(level, messages) {
    if (ignoredLogMessages.includes(messages.join(' '))) {
        return;
    }

    console[level](...messages);
}

/**
 * Log a warning but ignore certain specific messages
 * @param  {...string} message
 */
function warn(...message) {
    logMessage('warn', message);
}
exports.warn = warn;

/**
 * Log a message but ignore certain specific messages
 * @param  {...string} message
 */
function log(...message) {
    logMessage('log', message);
}
exports.log = log;

/**
 * Log an error but ignore certain specific messages
 * @param  {...string} message
 */
function error(...message) {
    logMessage('error', message);
}
exports.error = error;
