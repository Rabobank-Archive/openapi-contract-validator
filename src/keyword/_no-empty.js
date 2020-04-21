const _ = require('lodash');

const error = {
    keyword: '_noEmpty',
    message: 'empty strings should be omitted',
    // eslint-disable-next-line unicorn/prevent-abbreviations
    params: {
        keyword: '_noEmpty',
    },
};

module.exports = (ajv) => {
    ajv.addKeyword(error.keyword, {
        type: 'string',
        validate: validate,
        errors: true,
    });
};

/**
 * @memberof module:validator/keywords
 * @alias _noEmpty
 *
 * @param {jsonSchema} schema
 * @param {string} data
 * @return {boolean}
 */
function validate(schema, data) {
    if (_.isString(data) && data.trim() !== '') {
        return true;
    }

    validate.errors = [];
    validate.errors.push(error);
}
