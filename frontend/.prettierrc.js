const tailwindPlugin = require('prettier-plugin-tailwindcss');
const sortImportsPlugin = require('@trivago/prettier-plugin-sort-imports');

const mixedPlugin = {
  parsers: {
    typescript: {
      ...tailwindPlugin.parsers.typescript,
      preprocess: sortImportsPlugin.parsers.typescript.preprocess,
    },
  },
  options: {
    ...sortImportsPlugin.options,
  },
};

const tsOption = {
  arrowParens: 'always',
  jsxSingleQuote: true,
  bracketSameLine: true,
  singleQuote: true,
  semi: true,
  bracketSpacing: true,
  useTabs: false,
  tabWidth: 2,
  trailingComma: 'all',
  printWidth: 100,
  endOfLine: 'auto',
  importOrder: [
    '^re(.*)$',
    '<THIRD_PARTY_MODULES>',
    '^@(?:components|templates|pages|containers)(.*)$',
    '^@(?:apis|interfaces|config)(.*)$',
    '^@(?:assets|constants|hooks|styles|utils|contexts)(.*)$',
    '^[./]',
  ],
  plugins: [mixedPlugin],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};

module.exports = {
  overrides: [
    {
      files: '*.{ts,tsx}',
      options: {
        ...tsOption,
      },
    },
    {
      files: '*.{js,jsx}',
      options: {
        ...tsOption,
        printWidth: 80,
      },
    },
    {
      files: '*.{css,scss}',
      options: {
        singleQuote: false,
        semi: true,
        useTabs: true,
        tabWidth: 2,
      },
    },
  ],
};
