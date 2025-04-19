import path from 'node:path';
import js from '@eslint/js';
import { fixupConfigRules, includeIgnoreFile } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

/** @type {import("eslint").Linter.Config[]} */
// eslint-disable-next-line import/no-anonymous-default-export
export default [
  includeIgnoreFile(path.resolve(import.meta.dirname, '.gitignore')),
  ...fixupConfigRules(
    // @ts-ignore
    compat.extends('next/core-web-vitals', 'plugin:storybook/recommended'),
  ),
  {
    // 'https://next-intl-docs.vercel.app/docs/workflows/linting'
    name: 'next-intl navigation',
    rules: {
      // Consistently import navigation APIs from `@/i18n/routing`
      'no-restricted-imports': [
        'error',
        {
          name: 'next/link',
          message: 'Please import from `@/i18n/routing` instead.',
        },
        {
          name: 'next/navigation',
          importNames: [
            'redirect',
            'permanentRedirect',
            'useRouter',
            'usePathname',
          ],
          message: 'Please import from `@/i18n/routing` instead.',
        },
      ],
    },
  },
];
