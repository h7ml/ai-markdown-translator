module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ],
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    quotes: ['error', 'single'],
    'jsx-quotes': ['error', 'prefer-single']
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
}; 