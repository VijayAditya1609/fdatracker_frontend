module.exports = {
  root: true,
  ignorePatterns: ['dist', 'node_modules', 'coverage'],
  env: {
    browser: true,
    es2020: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:sonarjs/recommended',
    'plugin:prettier/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: [
    'react-hooks',
    'react-refresh',
    'import',
    'jsx-a11y',
    'sonarjs',
    'complexity',
    '@typescript-eslint',
    'prettier'
  ],
  rules: {
    // React Hooks rules
    'react-hooks/exhaustive-deps': 'warn',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true }
    ],
    
    // Import rules
    'import/no-unresolved': 'off', // TypeScript handles this
    'import/order': [
      'warn',
      {
        'groups': [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index'
        ],
        'newlines-between': 'always',
        'alphabetize': { 'order': 'asc', 'caseInsensitive': true }
      }
    ],
    'import/no-duplicates': 'warn',
    'import/no-cycle': 'warn',
    
    // Complexity rules
    'complexity': ['warn', 10],
    'sonarjs/cognitive-complexity': ['warn', 15],
    'max-depth': ['warn', 3],
    'max-nested-callbacks': ['warn', 3],
    'max-params': ['warn', 4],
    
    // Additional rules
    'no-console': 'warn',
    'no-debugger': 'warn',
    'no-alert': 'warn',
    'no-unused-vars': 'off', // TypeScript handles this
    '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn'
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      extends: [
        'plugin:@typescript-eslint/recommended'
      ],
      rules: {
        '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }]
      }
    }
  ]
};
