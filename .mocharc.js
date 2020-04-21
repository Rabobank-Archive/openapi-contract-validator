module.exports = {
    reporter: 'mocha-multi-reporters',
    'reporter-option': [
        'configFile=.mocha-reporterrc.js'
    ],
    recursive: true,
    exclude: [
        '.git',
        'node_modules',
        'test/resources',
    ],
    ui: 'BDD-bundle',
    require: [
        'choma',
        'chai/register-expect',
        'mocha-bundle-ui',
        './test/setup.js',
    ],
};
