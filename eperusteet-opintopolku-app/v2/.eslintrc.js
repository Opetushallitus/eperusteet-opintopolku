module.exports = {
  'env': {
    'browser': true,
    'es6': true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/typescript'
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly'
  },
  'parserOptions': {
    'ecmaVersion': 2018,
    'sourceType': 'module',
    'ecmaFeatures': {
    },
  },
  'plugins': [
    'vue'
  ],
  'rules': {
    'array-bracket-spacing': ['error', 'never'],
    'no-useless-constructor': 'off',
    'operator-linebreak': ['error', 'before'],
    'newline-per-chained-call': 'error',
    'brace-style': ['error', 'stroustrup'],
    'space-before-function-paren': ['error', {
      'anonymous': 'never',
      'named': 'never',
      'asyncArrow': 'always',
    }],
    'indent': [
      'error',
      2
    ],
    'comma-dangle': ['error', 'only-multiline'],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'always'
    ]
  }
};
