module.exports = {
    plugins: [
        'sonarjs',
        'mocha',
        'unicorn',
    ],
    extends: [
        'google',
        'plugin:sonarjs/recommended',
        'plugin:unicorn/recommended',
        'plugin:mocha/recommended',
    ],
    settings: {
        mocha: {
            additionalSuiteNames: ['bundle'],
        },
    },
    parserOptions: {
        ecmaVersion: 8
    },
    env: {
        node: true,
        es6: true,
    },
    rules: {
        'indent': [
            'error',
            4,
        ],
        'max-len': [
            'error',
            100,
        ],
        'linebreak-style': 'off',
        'brace-style': [
            'error',
            'stroustrup',
        ],
        'operator-linebreak': ['error', 'before'],
        'require-jsdoc': ['error', {
            require: {
                ClassDeclaration: false,
            }
        }],
    },
    overrides: [{
        files: [
            'test/**/*.js'
        ],
        rules: {
            'sonarjs/no-duplicate-string': 'off',
            'sonarjs/no-identical-functions': 'off',
            'no-invalid-this': 'off',
            'guard-for-in': 'off',
        }
    }]
};
