/**
 * @module validator/rules
 */

const fs = require('fs');
const path = require('path');

const _ = require('lodash');

const options = {};

const files = fs.readdirSync(__dirname);
files
    .filter((file) => file !== 'index.js')
    .forEach((file) => {
        const optionName = _.camelCase(path.basename(file, '.js'));
        options[optionName] = require(`./${file}`);
    });

module.exports = options;
