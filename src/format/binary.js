module.exports = (ajv) => {
    ajv.addFormat('binary', {
        validate,
        type: 'string',
    });
};

/**
 * @memberof module:validator/formats
 * @alias binary
 *
 * @return {boolean}
 */
function validate() {
    return true;
}
