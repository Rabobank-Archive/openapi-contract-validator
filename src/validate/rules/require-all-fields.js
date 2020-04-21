const traverse = require('traverse');
const _ = require('lodash');

/**
 * Require every field in the schema
 *
 * @memberof module:validator/rules
 * @param {jsonSchema} jsonSchema
 * @return {jsonSchema}
 */
function requireAllFields(jsonSchema) {
    const schema = _.cloneDeep(jsonSchema);

    traverse(schema).forEach((subSchema) => {
        if (subSchema.type === 'object' && 'properties' in subSchema) {
            let properties = subSchema.properties;
            properties = _.omitBy(properties, (property) => {
                return property['x-requireAllFields-ignore'] === true;
            });

            subSchema.required = _.keys(properties);
        }
    });

    return schema;
};
module.exports = requireAllFields;
