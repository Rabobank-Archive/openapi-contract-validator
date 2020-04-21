module.exports = (ajv) => {
    ajv.addFormat('int32', {
        validate,
        type: 'integer',
    });
};

const MIN = -(2 ** 31);
const MAX = 2 ** 31 - 1;

/**
 * @memberof module:validator/formats
 * @alias int32
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
