/**
 * @module validator/keywords
 */

const fs = require('fs');

/**
 * Add all available keywords in this folder to AJV
 * @param {Ajv} ajv
 */
function gatherKeywords(ajv) {
    const files = fs.readdirSync(__dirname);
    files
        .filter((file) => file !== 'index.js')
        .forEach((file) => {
            require(`./${file}`)(ajv);
        });
};
module.exports = gatherKeywords;
