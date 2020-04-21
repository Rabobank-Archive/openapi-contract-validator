module.exports = (ajv) => {
    ajv.addFormat('date', {
        validate,
        type: 'string',
    });
};

/**
 * @memberof module:validator/formats
 * @alias date
 *
 * @param {string} value
 * @return {boolean}
 */
function validate(value) {
    if (!value) return false;

    const match = value.match(/\d{4}-\d{2}-\d{2}/);
    return match != null;
}
