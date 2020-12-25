module.exports = {
  globals: {
    wx: true,
    App: true,
    Page: true,
    Component: true,
    getApp: true,
    getCurrentPages: true,
  },
  rules: {
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
  },
  overrides: [
    {
      files: ['./**/*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
      },
      plugins: ['@typescript-eslint'],
      extends: [
        'plugin:import/typescript',
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
      ],
      rules: {},
    },
    {
      files: ['./**/*.wxs'],
      parserOptions: {
        ecmaVersion: 5,
        sourceType: 'script',
      },
      globals: {
        getDate: 'readonly',
        getRegExp: 'readonly',
        MAX_VALUE: 'readonly',
        MIN_VALUE: 'readonly',
        NEGATIVE_INFINITY: 'readonly',
        POSITIVE_INFINITY: 'readonly',
      },
      extends: ['eslint:recommended'],
      rules: {
        strict: 'off',
        'no-var': 'off',
        'vars-on-top': 'off',
        'prefer-template': 'off',
        'object-shorthand': 'off',
        'prefer-destructuring': 'off',
      },
    },
  ],
};
