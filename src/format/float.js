const _ = require('lodash');

module.exports = (ajv) => {
    ajv.addFormat('float', {
        validate,
        type: 'number',
    });
};

const MIN = -(2 ** 128);
const MAX = 2 ** 128 - 1;

/**
 * @memberof module:validator/formats
 * @alias float
 *
 * @param {number} value
 * @return {boolean}
 */
function validate(value) {
    if (!_.isNumber(value) || _.isNaN(value)) {
        return false;
    }

    if (value < MIN) {
        return false;
    }
    if (value > MAX) {
        return false;
    }

    return true;
}
