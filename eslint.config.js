// eslint.config.js
//  @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'
import prettierConfig from 'eslint-config-prettier'
import importX from 'eslint-plugin-import-x'
import prettier from 'eslint-plugin-prettier'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'

export default [
  ...tanstackConfig,
  prettierConfig,
  {
    plugins: {
      'react-hooks': reactHooks,
      'import-x': importX,
      react,
      prettier,
    },
    rules: {
      // Prettier
      'prettier/prettier': [
        'error',
        {
          semi: false,
          singleQuote: true,
          trailingComma: 'all',
        },
      ],

      // React
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/jsx-no-undef': 'error',
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',
      'react/no-unescaped-entities': 'warn',
      'react/no-unknown-property': 'error',

      // Import rules
      'import-x/no-unresolved': 'error',
      'import-x/named': 'error',
      'import-x/default': 'error',
      'import-x/namespace': 'error',
      'import-x/no-absolute-path': 'error',
      'import-x/no-dynamic-require': 'warn',
      'import-x/no-self-import': 'warn',
      'import-x/no-cycle': 'warn',
      'import-x/no-useless-path-segments': 'error',

      // 🔑 Auto-fixable import order
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
            'object',
            'type',
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],

      'import/consistent-type-specifier-style': 'warn',

      // TS runtime safety
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/prefer-optional-chain': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
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
