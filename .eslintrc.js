module.exports = {
    'env': {
        'browser': false,
        'commonjs': true,
        'es2021': true,
        'mocha': true,
        'node': true
    },
    'extends': 'eslint:recommended',
    'parserOptions': {
        'ecmaVersion': 12
    },
    'rules': {
        'no-const-assign': 'warn',
        'no-this-before-super': 'warn',
        'no-undef': 2,
        'no-unreachable': 'warn',
        'no-unused-vars': 'warn',
        'constructor-super': 'warn',
        'valid-typeof': 'warn',
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],
        'no-console': 0
    }
};
