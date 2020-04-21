module.exports = (ajv) => {
    ajv.addFormat('password', {
        validate,
        type: 'string',
    });
};

/**
 * @memberof module:validator/formats
 * @alias password
 *
 * @return {boolean}
 */
function validate() {
    return true;
}
