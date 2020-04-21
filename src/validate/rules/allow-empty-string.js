const traverse = require('traverse');
const _ = require('lodash');

/**
 * Require every field in the schema
 *
 * @memberof module:validator/rules
 * @param {jsonSchema} schema
 * @return {jsonSchema}
 */
function allowEmptyString(schema) {
    schema = _.cloneDeep(schema);

    traverse(schema).forEach((subSchema) => {
        if (subSchema.type === 'string') {
            subSchema._noEmpty = true;
        }
    });
    return schema;
};
module.exports = allowEmptyString;
