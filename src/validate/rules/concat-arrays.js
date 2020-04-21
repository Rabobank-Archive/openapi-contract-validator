const traverse = require('traverse');
const _ = require('lodash');

/**
 * Merge content of arrays into a single object
 *
 * @memberof module:validator/rules
 * @param {jsonSchema} schema
 * @param {object} object
 * @return {object}
 */
function concatArrays(schema, object) {
    traverse(schema).forEach((subSchema) => {
        if (subSchema.type === 'array' && 'items' in subSchema) {
            subSchema.minItems = 1;
            subSchema.maxItems = 1;
        }
    });

    object = traverse(object)
        .map((value) => {
            if (_.isArray(value) && value.length > 1) {
                let concat;

                if (!_.isObject(value[0])) {
                    concat = value.reduce((a, b) => `${a} ${b}`);
                }
                else {
                    concat = {};
                    value.forEach((object_) => {
                        concat = Object.assign(concat, object_);
                    });
                }
                return [concat];
            }
            return value;
        });

    return [schema, object];
};
module.exports = concatArrays;
