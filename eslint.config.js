import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'dev-dist'] },
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
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                'react-icons/fa',
                'react-icons/fa6',
                'react-icons/io',
                'react-icons/io5',
                'react-icons/go',
                'react-icons/md',
                'react-icons/bs',
                'react-icons/ai',
                'react-icons/hi',
                'react-icons/hi2',
                'react-icons/ri',
                'react-icons/bi',
                'react-icons/im',
                'react-icons/gi',
                'react-icons/si',
                'react-icons/ti',
                'react-icons/cg',
                'react-icons/tb',
                'react-icons/pi',
              ],
              message:
                'Use Lucide icons via `react-icons/lu` only. See AGENTS.md for design guidelines.',
            },
          ],
        },
      ],
    },
  },
)
