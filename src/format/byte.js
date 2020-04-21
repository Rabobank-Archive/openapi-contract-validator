const isBase64 = require('is-base64');
const _ = require('lodash');

module.exports = (ajv) => {
    ajv.addFormat('byte', {
        validate,
        type: 'string',
    });
};

/**
 * @memberof module:validator/formats
 * @alias byte
 *
 * @param {string} value
 * @return {boolean}
 */
function validate(value) {
    if (!_.isString(value)) {
        return false;
    }

    return isBase64(value);
}
