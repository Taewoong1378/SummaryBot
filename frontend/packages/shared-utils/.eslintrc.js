module.exports = {
  ...require('eslint-config-custom/eslintrc.json'),
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 13,
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
};
