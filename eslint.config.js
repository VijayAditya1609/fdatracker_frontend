import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import sonarjs from 'eslint-plugin-sonarjs';
import complexity from 'eslint-plugin-complexity';

export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'coverage'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'import': importPlugin,
      'jsx-a11y': jsxA11y,
      'sonarjs': sonarjs,
      'complexity': complexity,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      ...sonarjs.configs.recommended.rules,
      
      // React Hooks rules
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
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
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  }
);
