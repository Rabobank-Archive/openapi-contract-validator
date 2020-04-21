/**
 * @module validator
 */

const toJsonSchema = require('openapi-schema-to-json-schema');
const traverseJsonSchema = require('json-schema-traverse');
const _ = require('lodash');

const resolve = require('./resolve');
const rules = require('./rules');
const ValidationError = require('./validation-error');


/**
 * Validate the response against an OpenAPI Schema
 *
 * @param {Ajv} ajv
 *      Instance of AJV
 * @param {Oas} oas
 * @param {Http} http
 * @param {Object}  [options={}]
 * @param {string}  [options.endpoint]
 *      The endpoint as specified in the OpenAPI Schema @default http.request.endpoint
 * @param {string}  [options.method]
 *      The HTTP method as sepcified in the OpenAPI Schema @default http.request.method
 * @param {integer} [options.statusCode]
 *      The HTTP statuscode as specified in the OpenAPI Schema @default http.response.statusCode
 * @param {boolean} [options.requireAllFields=false]
 *      Require every field in the schema
 * @param {boolean} [options.concatArrays=false]
 *      Merge content of arrays into a single value
 * @param {boolean} [options.allowEmptyString=false]
 *      Allow empty strings and strings that only contain whitespace
 * @throws {ValidationError}
 * @return {Promise}
 */
async function validate(ajv, oas, http, {
    requireAllFields=false,
    concatArrays=false,
    allowEmptyString=false,
    statusCode=http.response.statusCode,
    endpoint=null,
    method=null,
} = {}) {
    const ruleOptions = {
        requireAllFields,
        concatArrays,
        allowEmptyString,
    };

    const interaction = new resolve.Interaction(oas, http, {
        endpoint,
        statusCode,
        method,
    });
    const requestSchema = interaction.requestSchema;
    if (!_.isEmpty(requestSchema)) {
        validateOas(ajv, http.request, requestSchema, ruleOptions);
    }

    const responseSchema = interaction.responseSchema;
    validateOas(ajv, http.response, responseSchema, ruleOptions);
};
module.exports = validate;

/**
 * @param {Ajv} ajv
 * @param {Response|Request} json
 * @param {Oas} oas
 * @param {object} ruleOptions
 * @param {boolean} ruleOptions.requireAllFields
 * @param {boolean} ruleOptions.concatArrays
 * @param {boolean} ruleOptions.allowEmptyString
 *
 * @throws {Error}
 */
function validateOas(ajv, json, oas, ruleOptions) {
    let jsonSchema = oasToJsonSchema(oas);
    jsonSchema.$schema = 'https://spec.openapis.org/oas/3.0/schema/2019-04-02';
    let jsonBody = json.body;

    // Apply rules
    if (ruleOptions.requireAllFields) {
        jsonSchema = rules.requireAllFields(jsonSchema);
    }
    if (!ruleOptions.allowEmptyString) {
        jsonSchema = rules.allowEmptyString(jsonSchema);
    }
    if (ruleOptions.concatArrays) {
        [jsonSchema, jsonBody] = rules.concatArrays(jsonSchema, jsonBody);
    }

    // Perform validations
    const valid = ajv.validate(jsonSchema, jsonBody);
    if (!valid) {
        throw new ValidationError(oas, jsonBody, ajv.errors);
    }
}


/**
 * OAS is a sideset of JSON schema. Convert OAS to JSON schema.
 * @param {Oas} oas
 * @return {jsonSchema}
 */
function oasToJsonSchema(oas) {
    const schema = toJsonSchema(oas);

    // Because we are testing the contract and don't want any differences between it and the
    // response we will disallow unspecified properties and items.
    traverseJsonSchema(schema, (subSchema) => {
        if ('properties' in subSchema) {
            subSchema.additionalProperties = false;
        }
        if ('items' in subSchema) {
            subSchema.additionalItems = false;
        }
        if ('x-extensible-enum' in subSchema) {
            if (_.isEmpty(subSchema.enum)) {
                subSchema.enum = [];
            }
            subSchema.enum = _.union(subSchema.enum, subSchema['x-extensible-enum']);
        }
    });

    return schema;
}
