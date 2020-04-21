/**
 * @module validator/formats
 */

const fs = require('fs');

/**
 * Add all available formats in this folder to AJV
 * @param {Ajv} ajv
 */
function gatherFormats(ajv) {
    const files = fs.readdirSync(__dirname);
    files
        .filter((file) => file !== 'index.js')
        .forEach((file) => {
            require(`./${file}`)(ajv);
        });
};
module.exports = gatherFormats;
