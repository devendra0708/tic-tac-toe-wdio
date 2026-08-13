import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: [
      'node_modules/**',
      'app/**',
      'docs/**',
      'allure-report/**',
      'allure-results/**',
      '.wdio-cache/**',
      '.idea/**',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    files: ['test/**/*.ts', 'wdio.conf.ts'],
    languageOptions: {
      globals: {
        browser: 'readonly',
        $: 'readonly',
        $$: 'readonly',
        expect: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        before: 'readonly',
        beforeEach: 'readonly',
        after: 'readonly',
        afterEach: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
);
