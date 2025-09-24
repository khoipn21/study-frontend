//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'
import reactHooks from 'eslint-plugin-react-hooks'
import importX from 'eslint-plugin-import-x'
import react from 'eslint-plugin-react'
import prettier from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

export default [
  ...tanstackConfig,
  prettierConfig, // Disables ESLint rules that conflict with Prettier
  {
    plugins: {
      'react-hooks': reactHooks,
      'import-x': importX,
      react: react,
      prettier: prettier,
    },
    rules: {
      // Prettier integration
      'prettier/prettier': [
        'error',
        {
          semi: false,
          singleQuote: true,
          trailingComma: 'all',
        },
      ],

      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // React-specific rules for better component validation
      'react/jsx-no-undef': 'error',
      'react/jsx-uses-react': 'off', // Not needed in React 17+
      'react/jsx-uses-vars': 'error',
      'react/no-unescaped-entities': 'warn',
      'react/no-unknown-property': 'error',
      // Import resolution rules
      'import-x/no-unresolved': 'error',
      'import-x/named': 'error',
      'import-x/default': 'error',
      'import-x/namespace': 'error',
      'import-x/no-absolute-path': 'error',
      'import-x/no-dynamic-require': 'warn',
      'import-x/no-self-import': 'warn',
      'import-x/no-cycle': 'warn',
      'import-x/no-useless-path-segments': 'error',
      'import/order': 'warn',
      // TypeScript rules for catching runtime errors
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'off',
    },
    settings: {
      'import-x/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
        node: true,
      },
      react: {
        version: 'detect',
      },
    },
  },
  {
    ignores: [
      '.output/**',
      '.nitro/**',
      'dist/**',
      'build/**',
      '.vite/**',
      'node_modules/**',
      '**/*.generated.ts',
      'src/routeTree.gen.ts',
      'eslint.config.js',
      'prettier.config.js',
      'vite.config.ts',
      'tailwind.config.ts',
      'postcss.config.js',
    ],
  },
]
