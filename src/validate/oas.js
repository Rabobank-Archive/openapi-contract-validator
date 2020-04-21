const fs = require('fs');
const yaml = require('js-yaml');
const _ = require('lodash');
const $refParser = require('json-schema-ref-parser');

const ValidationError = require('./validation-error');

class Oas {
    constructor(oas) {
        oas = this._resolveFile(oas);
        this._validateVersion(oas);
        Object.assign(this, oas);
    }

    /**
     * @private
     * @param {object} schema
     * @throws {ValidationError}
     */
    _validateVersion(schema) {
        if (schema.openapi && schema.openapi.startsWith('3.0')) {
            return;
        }

        throw new ValidationError(schema, schema, [{
            keyword: 'unsupportedSchemaVersion',
            message: 'Schema version is NOT supported',
            dataPath: `#/${_.first(_.keys(schema))}`,
        }]);
    }

    /**
     * @private
     * @param {openApiSchema|string|object} definition
     * @return {openApiSchema}
     */
    _resolveFile(definition) {
        definition = definition.default || definition;

        if (typeof definition == 'string') {
            if (definition.endsWith('.yml') || definition.endsWith('.yaml')) {
                return yaml.safeLoad(fs.readFileSync(definition, 'utf8'));
            }
            else if (definition.endsWith('.json') || definition.endsWith('.js')) {
                return require(definition);
            }
            else {
                return JSON.parse(definition);
            }
        }

        return _.cloneDeep(definition);
    };


    /**
     * Resolve all $ref keys in the OpenAPI Schema
     * @return {Oas} this
     */
    async resolveReferences() {
        await $refParser.dereference(this)
            .catch((error) => {
                error.message = 'Something went wrong while dereferencing the OAS: '
                    + error.message;
                throw error;
            });
        return this;
    }
}
module.exports = Oas;
