import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import next from 'eslint-config-next'

export default tseslint.config(
  // `.wrangler/**` holds wrangler's own bundle output. It is gitignored but
  // was not ignored here, so `pnpm lint` failed on generated worker code for
  // anyone who had run `pnpm preview` or `pnpm deploy` first.
  {
    ignores: [
      '.next/**',
      '.open-next/**',
      '.wrangler/**',
      'node_modules/**',
      'next-env.d.ts',
      'src/lib/api-types.ts',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...next,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' },
      ],
    },
  },
)
