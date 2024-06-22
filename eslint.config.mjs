import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { fixupConfigRules, includeIgnoreFile } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});
const gitignorePath = path.resolve(__dirname, '.gitignore');

/** @type {import("eslint").Linter.FlatConfig[]} */
// eslint-disable-next-line import/no-anonymous-default-export
export default [
  includeIgnoreFile(gitignorePath),
  ...fixupConfigRules(
    compat.extends('next/core-web-vitals', 'plugin:storybook/recommended'),
  ),
  {
    // 'https://next-intl-docs.vercel.app/docs/workflows/linting'
    name: 'next-intl navigation',
    rules: {
      // Consistently import navigation APIs from `@/navigation`
      'no-restricted-imports': [
        'error',
        {
          name: 'next/link',
          message: 'Please import from `@/navigation` instead.',
        },
        {
          name: 'next/navigation',
          importNames: [
            'redirect',
            'permanentRedirect',
            'useRouter',
            'usePathname',
          ],
          message: 'Please import from `@/navigation` instead.',
        },
      ],
    },
  },
];
