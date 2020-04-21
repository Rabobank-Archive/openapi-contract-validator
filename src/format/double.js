const _ = require('lodash');

module.exports = (ajv) => {
    ajv.addFormat('double', {
        validate,
        type: 'number',
    });
};

const MIN = -Number.MAX_VALUE;
const MAX = Number.MAX_VALUE;

/**
 * @memberof module:validator/formats
 * @alias double
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
