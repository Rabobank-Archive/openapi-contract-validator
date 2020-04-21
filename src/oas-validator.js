const _ = require('lodash');
const Ajv = require('ajv');

// OAS3 uses JSON schema draft 4
const metaSchema = require('ajv/lib/refs/json-schema-draft-04.json');
const oasSchema = require('./oas3.jsonSchema.json');

const logger = require('./logger');
const assertContract = require('./validate/validate');
const Oas = require('./validate/oas');
const defaultConfig = require('./default-config');

/**
 * OAS validator
 */
class OasValidator {
    /**
     * @param {oasValidatorConfig} [config]
     */
    constructor(config={}) {
        this.config = _.defaultsDeep(config, defaultConfig);

        this._ajv = new Ajv({
            schemaId: 'id',
            meta: false,
            validateSchema: false,
            jsonPointers: true,
            coerceTypes: false,
            strictKeywords: false,
            format: 'full',
            logger: logger,
            allErrors: true,
        });

        this._ajv.addMetaSchema(metaSchema);
        this._ajv._opts.defaultMeta = metaSchema.id;

        this._ajv.addSchema(oasSchema);

        require('./format')(this._ajv);
        require('./keyword')(this._ajv);
    }

    /**
     * @param {oasSchema} schema
     * @param {Http} http
     * @param {object} options
     * @async
     */
    async validate(schema, http, options) {
        const oas = new Oas(schema);
        await oas.resolveReferences();
        await assertContract(this._ajv, oas, http, _.defaultsDeep(options, this.config));
    }

    /**
     * @alias ajv.addFormat
     */
    addFormat(...arguments_) {
        this._ajv.addFormat(...arguments_);
    }

    /**
     * @alias ajv.addKeyword
     */
    addKeyword(...arguments_) {
        this._ajv.addKeyword(...arguments_);
    }
}

module.exports = OasValidator;
