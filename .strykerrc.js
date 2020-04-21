module.exports = function(config) {
    config.set({
        mutate: [
            'src/**/*.js',
            '!src/default-config.js',
        ],
        mutator: {
            name: 'javascript',
            excludedMutations: [],
        },
        packageManager: 'npm',
        reporters: [
            'html',
            'progress',
        ],
        testRunner: 'mocha',
        testFramework: 'mocha',
        coverageAnalysis: 'perTest',
        transpilers: [],
        mochaOptions: {
            spec: [
                './test/**/*.js',
            ],
        },
        thresholds: {
            high: 80,
            low: 60,
            break: 50,
        },
    });
};
