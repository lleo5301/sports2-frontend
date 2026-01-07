/**
 * ESLint configuration for frontend React/Vite application
 *
 * This configuration enforces React best practices:
 * - 2-space indentation
 * - Single quotes
 * - ESM module syntax
 * - React and browser environment
 */

module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    react: {
      version: '18.2'
    }
  },
  plugins: ['react-refresh'],
  rules: {
    // React Refresh
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true }
    ],

    // React rules
    'react/prop-types': 'off', // We use JSDoc instead
    'react/jsx-no-target-blank': 'off',

    // Indentation: 2 spaces
    'indent': ['error', 2, {
      'SwitchCase': 1,
      'ignoredNodes': ['TemplateLiteral']
    }],

    // Quotes: single quotes
    'quotes': ['error', 'single', {
      'avoidEscape': true,
      'allowTemplateLiterals': true
    }],

    // Semicolons: required
    'semi': ['error', 'always'],

    // Comma style
    'comma-dangle': ['error', 'never'],
    'comma-spacing': ['error', { 'before': false, 'after': true }],

    // No console in production (warning instead of error for development)
    'no-console': 'warn',

    // Allow unused vars with underscore prefix
    'no-unused-vars': ['error', {
      'argsIgnorePattern': '^_',
      'varsIgnorePattern': '^_'
    }],

    // Prefer const
    'prefer-const': 'error',

    // Require === and !==
    'eqeqeq': ['error', 'always'],

    // Disallow var
    'no-var': 'error',

    // No trailing spaces
    'no-trailing-spaces': 'error',

    // No multiple empty lines
    'no-multiple-empty-lines': ['error', { 'max': 1, 'maxEOF': 0 }],

    // End of line
    'eol-last': ['error', 'always']
  }
};
