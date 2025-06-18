import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // Only the most critical JavaScript errors
      'no-undef': 'error',        // Catches undefined variables
      
      // Only the most critical React errors
      'react/jsx-no-undef': 'error',            // Catches undefined variables
      'react/jsx-no-duplicate-props': 'error',  // Duplicate props will cause unexpected behavior
      'react/no-direct-mutation-state': 'error', // Direct state mutations break React's state management
      
      // Critical Hook rules - these prevent subtle bugs
      'react-hooks/rules-of-hooks': 'error',    // Hooks must be called in the same order every render
      
      // Fast Refresh - only if you're using React Fast Refresh
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
]
