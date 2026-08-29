module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-native',
    'unused-imports',
    'import',
    'react-hooks',
  ],
  env: {
    'react-native/react-native': true,
    es2021: true,
    node: true,
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        'no-shadow': 'off',
        'no-undef': 'off',
        'react/no-unstable-nested-components': 'off',
      },
    },
  ],
  rules: {
    'import/no-named-as-default-member': 'off',
    'import/no-named-as-default': 'off',

    // Disable the default ESLint unused vars rule
    'no-unused-vars': 'off',

    // ✅ Unused import handling via plugin
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],

    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
      'babel-module': {
        root: ['./'],
        alias: {
          app: './app',
        },
      },
    },
    react: {
      version: 'detect',
    },
  },
};
