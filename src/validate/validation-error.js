const betterAjvErrors = require('better-ajv-errors');
const _ = require('lodash');

class ValidationError extends Error {
    /**
     *
     * @param {Oas} oas
     * @param {object} jsonBody
     * @param {object[]} ajvErrors
     */
    constructor(oas, jsonBody, ajvErrors) {
        ajvErrors.map((error) => {
            return _.defaultsDeep(error, {
                dataPath: '',
            });
        });

        super(betterAjvErrors(oas, jsonBody, ajvErrors, {
            indent: 2,
            dataPath: true,
        }));
        this.name = 'ValidationError';
    }
}

module.exports = ValidationError;
