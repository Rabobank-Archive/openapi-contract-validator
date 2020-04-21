module.exports = (ajv) => {
    ajv.addFormat('int64', {
        validate,
        type: 'integer',
    });
};

const MIN = -(2 ** 63);
const MAX = 2 ** 63 - 1;

/**
 * @memberof module:validator/formats
 * @alias int64
 *
 * @param {number} value
 * @return {boolean}
 */
function validate(value) {
    if (!Number.isInteger(value)) {
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
