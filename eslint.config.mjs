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

// eslint-disable-next-line import/no-anonymous-default-export
export default [
  includeIgnoreFile(gitignorePath),
  ...fixupConfigRules(
    compat.extends('next/core-web-vitals', 'plugin:storybook/recommended'),
  ),
];
